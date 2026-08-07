extends SceneTree

# PR A — Save persistence automated tests
# These tests cover what CI can deterministically prove about the save system.
# Android lifecycle behavior (Recents, background/resume, close/reopen) remains
# a physical-device validation gate and is NOT claimed by these headless tests.

const TEST_SAVE_PATH := "user://persistence_contract_test.json"
const MainScene := preload("res://scenes/main.tscn")

var runtime: Node3D
var failures: Array[String] = []
var tests_run := 0


func _initialize() -> void:
	_run_test("test_save_file_creation", test_save_file_creation)
	_run_test("test_save_file_replacement", test_save_file_replacement)
	_run_test("test_save_serialization_fields", test_save_serialization_fields)
	_run_test("test_load_after_fresh_init", test_load_after_fresh_init)
	_run_test("test_schema_version_handling", test_schema_version_handling)
	_run_test("test_corrupt_save_behavior", test_corrupt_save_behavior)
	_run_test("test_missing_save_behavior", test_missing_save_behavior)
	_run_test("test_state_restoration_fields", test_state_restoration_fields)
	_run_test("test_repeated_save_load_cycles", test_repeated_save_load_cycles)
	_run_test("test_reset_run_clears_state", test_reset_run_clears_state)
	_report()
	quit()


func _run_test(name: String, fn: Callable) -> void:
	tests_run += 1
	# Clean up any previous test save file
	DirAccess.remove_absolute(TEST_SAVE_PATH)
	# Clean up the real save file too
	DirAccess.remove_absolute("user://save_v1.json")
	fn.call(name)
	# Clean up after test
	DirAccess.remove_absolute(TEST_SAVE_PATH)
	DirAccess.remove_absolute("user://save_v1.json")


func _create_runtime() -> Node3D:
	if runtime != null and is_instance_valid(runtime):
		runtime.queue_free()
	runtime = MainScene.instantiate()
	runtime.save_path = TEST_SAVE_PATH
	get_root().add_child(runtime)
	return runtime


func _destroy_runtime() -> void:
	if runtime != null and is_instance_valid(runtime):
		runtime.queue_free()
	runtime = null


func _assert_eq(name: String, actual, expected, context: String = "") -> void:
	if actual != expected:
		failures.append("%s: expected %s, got %s %s" % [name, str(expected), str(actual), context])


func _assert_true(name: String, value: bool, context: String = "") -> void:
	if not value:
		failures.append("%s: expected true, got false %s" % [name, context])


func _assert_false(name: String, value: bool, context: String = "") -> void:
	if value:
		failures.append("%s: expected false, got true %s" % [name, context])


func _assert_file_exists(name: String, path: String) -> void:
	if not FileAccess.file_exists(path):
		failures.append("%s: expected file at %s" % [name, path])


func _assert_file_not_exists(name: String, path: String) -> void:
	if FileAccess.file_exists(path):
		failures.append("%s: did not expect file at %s" % [name, path])


# Test 1: Save file is created when _save_game() is called
func test_save_file_creation(name: String) -> void:
	var r := _create_runtime()
	r._save_game()
	_assert_file_exists(name + ".save_created", TEST_SAVE_PATH)
	_destroy_runtime()


# Test 2: Save file is replaced/updated on subsequent saves
func test_save_file_replacement(name: String) -> void:
	var r := _create_runtime()
	r._save_game()
	var first_content := FileAccess.get_file_as_string(TEST_SAVE_PATH)
	# Change observable state
	r.health = 50
	r._save_game()
	var second_content := FileAccess.get_file_as_string(TEST_SAVE_PATH)
	_assert_true(name + ".content_changed", first_content != second_content)
	# Verify the new content reflects the changed state
	var parsed = JSON.parse_string(second_content)
	_assert_eq(name + ".updated_health", int(parsed.get("health", -1)), 50)
	_destroy_runtime()


# Test 3: Save serialization contains all expected fields
func test_save_serialization_fields(name: String) -> void:
	var r := _create_runtime()
	r._save_game()
	var parsed = JSON.parse_string(FileAccess.get_file_as_string(TEST_SAVE_PATH))
	_assert_eq(name + ".schema_version", int(parsed.get("schema_version", -1)), r.SAVE_SCHEMA_VERSION)
	_assert_true(name + ".has_health", parsed.has("health"))
	_assert_true(name + ".has_infected_health", parsed.has("infected_health"))
	_assert_true(name + ".has_beacon_reached", parsed.has("beacon_reached"))
	_assert_true(name + ".has_run_complete", parsed.has("run_complete"))
	_assert_true(name + ".has_inventory", parsed.has("inventory"))
	_assert_true(name + ".has_position", parsed.has("position"))
	_assert_true(name + ".has_camera_yaw", parsed.has("camera_yaw"))
	_assert_true(name + ".has_collected_pickups", parsed.has("collected_pickups"))
	_assert_true(name + ".has_prototype_field_inventory", parsed.has("prototype_field_inventory"))
	_assert_true(name + ".has_prototype_loadout", parsed.has("prototype_loadout"))
	_assert_true(name + ".has_prototype_weapon_state", parsed.has("prototype_weapon_state"))
	_destroy_runtime()


# Test 4: Load after fresh game-state initialization restores state
func test_load_after_fresh_init(name: String) -> void:
	var r := _create_runtime()
	r.health = 30
	r.beacon_reached = true
	r._save_game()
	_destroy_runtime()

	# Simulate a fresh process by creating a new runtime instance
	var r2 := _create_runtime()
	# The fresh runtime should have default state before load
	_assert_eq(name + ".default_health_before_load", r2.health, r2.STARTING_HEALTH)
	_assert_false(name + ".default_beacon_before_load", r2.beacon_reached)

	# Now load the save
	var loaded := r2._load_save()
	_assert_true(name + ".load_succeeded", loaded)
	_assert_eq(name + ".restored_health", r2.health, 30)
	_assert_true(name + ".restored_beacon", r2.beacon_reached)
	_destroy_runtime()


# Test 5: Schema version handling rejects incompatible versions
func test_schema_version_handling(name: String) -> void:
	# Write a save with schema version 0 (below MIN_SUPPORTED)
	var file := FileAccess.open(TEST_SAVE_PATH, FileAccess.WRITE)
	file.store_string(JSON.stringify({"schema_version": 0, "health": 50}))
	file.close()

	var r := _create_runtime()
	var loaded := r._load_save()
	_assert_false(name + ".rejects_schema_0", loaded)
	# Health should remain at default, not 50
	_assert_eq(name + ".health_not_restored", r.health, r.STARTING_HEALTH)
	_destroy_runtime()

	# Write a save with schema version 999 (above current)
	DirAccess.remove_absolute(TEST_SAVE_PATH)
	file = FileAccess.open(TEST_SAVE_PATH, FileAccess.WRITE)
	file.store_string(JSON.stringify({"schema_version": 999, "health": 50}))
	file.close()

	r = _create_runtime()
	loaded = r._load_save()
	_assert_false(name + ".rejects_schema_999", loaded)
	_destroy_runtime()


# Test 6: Corrupt save file is handled gracefully
func test_corrupt_save_behavior(name: String) -> void:
	# Write corrupt JSON
	var file := FileAccess.open(TEST_SAVE_PATH, FileAccess.WRITE)
	file.store_string("this is not json {{{")
	file.close()

	var r := _create_runtime()
	var loaded := r._load_save()
	_assert_false(name + ".corrupt_rejected", loaded)
	# Game should continue with default state
	_assert_eq(name + ".default_health_after_corrupt", r.health, r.STARTING_HEALTH)
	_destroy_runtime()

	# Write empty file
	DirAccess.remove_absolute(TEST_SAVE_PATH)
	file = FileAccess.open(TEST_SAVE_PATH, FileAccess.WRITE)
	file.store_string("")
	file.close()

	r = _create_runtime()
	loaded = r._load_save()
	_assert_false(name + ".empty_rejected", loaded)
	_destroy_runtime()


# Test 7: Missing save file returns false gracefully
func test_missing_save_behavior(name: String) -> void:
	# Ensure no save file exists
	DirAccess.remove_absolute(TEST_SAVE_PATH)
	var r := _create_runtime()
	var loaded := r._load_save()
	_assert_false(name + ".missing_returns_false", loaded)
	# Game should have default state
	_assert_eq(name + ".default_health", r.health, r.STARTING_HEALTH)
	_destroy_runtime()


# Test 8: State restoration of important persisted fields
func test_state_restoration_fields(name: String) -> void:
	var r := _create_runtime()
	r.health = 45
	r.beacon_reached = true
	r.inventory["ammo"] = 12
	r.inventory["medkits"] = 3
	r.inventory["scrap"] = 7
	r.camera_yaw = 1.5
	r._save_game()
	_destroy_runtime()

	var r2 := _create_runtime()
	r2._load_save()
	_assert_eq(name + ".health", r2.health, 45)
	_assert_true(name + ".beacon_reached", r2.beacon_reached)
	_assert_eq(name + ".ammo", int(r2.inventory.get("ammo", -1)), 12)
	_assert_eq(name + ".medkits", int(r2.inventory.get("medkits", -1)), 3)
	_assert_eq(name + ".scrap", int(r2.inventory.get("scrap", -1)), 7)
	_assert_eq(name + ".camera_yaw", r2.camera_yaw, 1.5)
	_destroy_runtime()


# Test 9: Repeated save/load cycles maintain consistency
func test_repeated_save_load_cycles(name: String) -> void:
	var r := _create_runtime()
	r.health = 80
	r._save_game()
	_destroy_runtime()

	for i in range(5):
		var ri := _create_runtime()
		var loaded := ri._load_save()
		_assert_true(name + ".cycle_%d_load" % i, loaded)
		_assert_eq(name + ".cycle_%d_health" % i, ri.health, 80)
		# Modify state slightly each cycle
		ri.health = 80 - (i + 1) * 10
		ri._save_game()
		_destroy_runtime()

	# Final load should have the last saved value
	var rf := _create_runtime()
	rf._load_save()
	_assert_eq(name + ".final_health", rf.health, 80 - 5 * 10)
	_destroy_runtime()


# Test 10: RESET RUN clears/overwrites saved state
func test_reset_run_clears_state(name: String) -> void:
	var r := _create_runtime()
	r.health = 20
	r.beacon_reached = true
	r._save_game()
	_destroy_runtime()

	# Load the saved state, then reset
	var r2 := _create_runtime()
	r2._load_save()
	_assert_eq(name + ".loaded_health", r2.health, 20)
	_assert_true(name + ".loaded_beacon", r2.beacon_reached)

	# Reset the run
	r2._restart_run()
	_assert_eq(name + ".reset_health", r2.health, r2.STARTING_HEALTH)
	_assert_false(name + ".reset_beacon", r2.beacon_reached)

	# The save file should now contain the reset state
	var parsed = JSON.parse_string(FileAccess.get_file_as_string(TEST_SAVE_PATH))
	_assert_eq(name + ".saved_reset_health", int(parsed.get("health", -1)), r2.STARTING_HEALTH)
	_assert_false(name + ".saved_reset_beacon", bool(parsed.get("beacon_reached", true)))
	_destroy_runtime()


func _report() -> void:
	print("\n=== Persistence Test Results ===")
	print("Tests run: %d" % tests_run)
	print("Failures: %d" % failures.size())
	if failures.size() > 0:
		print("\nFAILURES:")
		for f in failures:
			print("  - %s" % f)
		print("\nRESULT: FAIL")
	else:
		print("\nRESULT: PASS")