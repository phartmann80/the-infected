extends SceneTree

# PR A — Save persistence automated tests
# These tests cover what CI can deterministically prove about the save system.
# Android lifecycle behavior (Recents, background/resume, close/reopen) remains
# a physical-device validation gate and is NOT claimed by these headless tests.

const TEST_SAVE_PATH := "user://persistence_contract_test.json"
const MainScene := preload("res://scenes/main.tscn")

var failures: Array[String] = []
var tests_run := 0


func _initialize() -> void:
	# Test 1: Save file creation
	tests_run += 1
	_cleanup_files()
	var r1 = MainScene.instantiate()
	r1.save_path = TEST_SAVE_PATH
	root.add_child(r1)
	await process_frame
	r1._save_game()
	if not FileAccess.file_exists(TEST_SAVE_PATH):
		failures.append("test_save_file_creation: expected file at %s" % TEST_SAVE_PATH)
	r1.queue_free()
	await process_frame
	_cleanup_files()

	# Test 2: Save file replacement
	tests_run += 1
	_cleanup_files()
	var r2 = MainScene.instantiate()
	r2.save_path = TEST_SAVE_PATH
	root.add_child(r2)
	await process_frame
	r2._save_game()
	var first_content := FileAccess.get_file_as_string(TEST_SAVE_PATH)
	r2.health = 50
	r2._save_game()
	var second_content := FileAccess.get_file_as_string(TEST_SAVE_PATH)
	if first_content == second_content:
		failures.append("test_save_file_replacement: content did not change")
	var parsed2: Variant = JSON.parse_string(second_content)
	if int(parsed2.get("health", -1)) != 50:
		failures.append("test_save_file_replacement: expected health 50, got %d" % int(parsed2.get("health", -1)))
	r2.queue_free()
	await process_frame
	_cleanup_files()

	# Test 3: Save serialization fields
	tests_run += 1
	_cleanup_files()
	var r3 = MainScene.instantiate()
	r3.save_path = TEST_SAVE_PATH
	root.add_child(r3)
	await process_frame
	r3._save_game()
	var parsed3: Variant = JSON.parse_string(FileAccess.get_file_as_string(TEST_SAVE_PATH))
	if int(parsed3.get("schema_version", -1)) != r3.SAVE_SCHEMA_VERSION:
		failures.append("test_save_serialization_fields: schema_version mismatch")
	for field in ["health", "infected_health", "beacon_reached", "run_complete", "inventory", "position", "camera_yaw", "collected_pickups", "prototype_field_inventory", "prototype_loadout", "prototype_weapon_state"]:
		if not parsed3.has(field):
			failures.append("test_save_serialization_fields: missing field %s" % field)
	r3.queue_free()
	await process_frame
	_cleanup_files()

	# Test 4: Load after fresh init — validates actual startup autoload contract
	# Runtime A saves → Runtime B auto-loads via _ready() → _load_save()
	# We do NOT manually call _load_save() on Runtime B.
	# We do NOT disable production autoload.
	tests_run += 1
	_cleanup_files()
	var ra = MainScene.instantiate()
	ra.save_path = TEST_SAVE_PATH
	root.add_child(ra)
	await process_frame
	ra.health = 30
	ra.beacon_reached = true
	ra._save_game()
	if not FileAccess.file_exists(TEST_SAVE_PATH):
		failures.append("test_load_after_fresh_init: save file not created")
	ra.queue_free()
	await process_frame
	# Runtime B: _ready() will call _load_save() automatically
	var rb = MainScene.instantiate()
	rb.save_path = TEST_SAVE_PATH
	root.add_child(rb)
	await process_frame
	await process_frame
	# Verify auto-restored state (no manual _load_save() call)
	if rb.health != 30:
		failures.append("test_load_after_fresh_init: expected auto-restored health 30, got %d" % rb.health)
	if not rb.beacon_reached:
		failures.append("test_load_after_fresh_init: expected auto-restored beacon_reached true, got false")
	rb.queue_free()
	await process_frame
	_cleanup_files()

	# Test 5: Schema version handling
	tests_run += 1
	_cleanup_files()
	var file := FileAccess.open(TEST_SAVE_PATH, FileAccess.WRITE)
	file.store_string(JSON.stringify({"schema_version": 0, "health": 50}))
	file.close()
	var r5a = MainScene.instantiate()
	r5a.save_path = TEST_SAVE_PATH
	root.add_child(r5a)
	await process_frame
	var loaded5a: bool = r5a._load_save()
	if loaded5a:
		failures.append("test_schema_version_handling: schema 0 should be rejected")
	if r5a.health != r5a.STARTING_HEALTH:
		failures.append("test_schema_version_handling: health should be default after rejecting schema 0")
	r5a.queue_free()
	await process_frame
	_cleanup_files()
	file = FileAccess.open(TEST_SAVE_PATH, FileAccess.WRITE)
	file.store_string(JSON.stringify({"schema_version": 999, "health": 50}))
	file.close()
	var r5b = MainScene.instantiate()
	r5b.save_path = TEST_SAVE_PATH
	root.add_child(r5b)
	await process_frame
	var loaded5b: bool = r5b._load_save()
	if loaded5b:
		failures.append("test_schema_version_handling: schema 999 should be rejected")
	r5b.queue_free()
	await process_frame
	_cleanup_files()

	# Test 6: Corrupt save behavior
	tests_run += 1
	_cleanup_files()
	file = FileAccess.open(TEST_SAVE_PATH, FileAccess.WRITE)
	file.store_string("this is not json {{{")
	file.close()
	var r6a = MainScene.instantiate()
	r6a.save_path = TEST_SAVE_PATH
	root.add_child(r6a)
	await process_frame
	var loaded6a: bool = r6a._load_save()
	if loaded6a:
		failures.append("test_corrupt_save_behavior: corrupt JSON should be rejected")
	if r6a.health != r6a.STARTING_HEALTH:
		failures.append("test_corrupt_save_behavior: health should be default after corrupt save")
	r6a.queue_free()
	await process_frame
	_cleanup_files()
	file = FileAccess.open(TEST_SAVE_PATH, FileAccess.WRITE)
	file.store_string("")
	file.close()
	var r6b = MainScene.instantiate()
	r6b.save_path = TEST_SAVE_PATH
	root.add_child(r6b)
	await process_frame
	var loaded6b: bool = r6b._load_save()
	if loaded6b:
		failures.append("test_corrupt_save_behavior: empty file should be rejected")
	r6b.queue_free()
	await process_frame
	_cleanup_files()

	# Test 7: Missing save behavior
	tests_run += 1
	_cleanup_files()
	var r7 = MainScene.instantiate()
	r7.save_path = TEST_SAVE_PATH
	root.add_child(r7)
	await process_frame
	var loaded7: bool = r7._load_save()
	if loaded7:
		failures.append("test_missing_save_behavior: missing save should return false")
	if r7.health != r7.STARTING_HEALTH:
		failures.append("test_missing_save_behavior: health should be default")
	r7.queue_free()
	await process_frame
	_cleanup_files()

	# Test 8: State restoration fields
	tests_run += 1
	_cleanup_files()
	var r8a = MainScene.instantiate()
	r8a.save_path = TEST_SAVE_PATH
	root.add_child(r8a)
	await process_frame
	r8a.health = 45
	r8a.beacon_reached = true
	r8a.inventory["ammo"] = 12
	r8a.inventory["medkits"] = 3
	r8a.inventory["scrap"] = 7
	r8a.camera_yaw = 1.5
	r8a._save_game()
	r8a.queue_free()
	await process_frame
	var r8b = MainScene.instantiate()
	r8b.save_path = TEST_SAVE_PATH
	root.add_child(r8b)
	await process_frame
	r8b._load_save()
	if r8b.health != 45:
		failures.append("test_state_restoration_fields: expected health 45, got %d" % r8b.health)
	if not r8b.beacon_reached:
		failures.append("test_state_restoration_fields: expected beacon_reached true")
	if int(r8b.inventory.get("ammo", -1)) != 12:
		failures.append("test_state_restoration_fields: expected ammo 12, got %d" % int(r8b.inventory.get("ammo", -1)))
	if int(r8b.inventory.get("medkits", -1)) != 3:
		failures.append("test_state_restoration_fields: expected medkits 3, got %d" % int(r8b.inventory.get("medkits", -1)))
	if int(r8b.inventory.get("scrap", -1)) != 7:
		failures.append("test_state_restoration_fields: expected scrap 7, got %d" % int(r8b.inventory.get("scrap", -1)))
	if r8b.camera_yaw != 1.5:
		failures.append("test_state_restoration_fields: expected camera_yaw 1.5, got %f" % r8b.camera_yaw)
	r8b.queue_free()
	await process_frame
	_cleanup_files()

	# Test 9: Repeated save/load cycles
	tests_run += 1
	_cleanup_files()
	var r9a = MainScene.instantiate()
	r9a.save_path = TEST_SAVE_PATH
	root.add_child(r9a)
	await process_frame
	r9a.health = 80
	r9a._save_game()
	r9a.queue_free()
	await process_frame
	for i in range(5):
		var ri = MainScene.instantiate()
		ri.save_path = TEST_SAVE_PATH
		root.add_child(ri)
		await process_frame
		var loaded9: bool = ri._load_save()
		if not loaded9:
			failures.append("test_repeated_save_load_cycles: cycle %d load failed" % i)
		if ri.health != 80:
			failures.append("test_repeated_save_load_cycles: cycle %d expected health 80, got %d" % [i, ri.health])
		ri.health = 80 - (i + 1) * 10
		ri._save_game()
		ri.queue_free()
		await process_frame
	var r9f = MainScene.instantiate()
	r9f.save_path = TEST_SAVE_PATH
	root.add_child(r9f)
	await process_frame
	r9f._load_save()
	if r9f.health != 80 - 5 * 10:
		failures.append("test_repeated_save_load_cycles: final health expected %d, got %d" % [80 - 5 * 10, r9f.health])
	r9f.queue_free()
	await process_frame
	_cleanup_files()

	# Test 10: RESET RUN clears/overwrites state
	tests_run += 1
	_cleanup_files()
	var r10a = MainScene.instantiate()
	r10a.save_path = TEST_SAVE_PATH
	root.add_child(r10a)
	await process_frame
	r10a.health = 20
	r10a.beacon_reached = true
	r10a._save_game()
	r10a.queue_free()
	await process_frame
	var r10b = MainScene.instantiate()
	r10b.save_path = TEST_SAVE_PATH
	root.add_child(r10b)
	await process_frame
	r10b._load_save()
	if r10b.health != 20:
		failures.append("test_reset_run_clears_state: loaded health expected 20, got %d" % r10b.health)
	if not r10b.beacon_reached:
		failures.append("test_reset_run_clears_state: expected beacon_reached true after load")
	r10b._restart_run()
	if r10b.health != r10b.STARTING_HEALTH:
		failures.append("test_reset_run_clears_state: reset health expected %d, got %d" % [r10b.STARTING_HEALTH, r10b.health])
	if r10b.beacon_reached:
		failures.append("test_reset_run_clears_state: expected beacon_reached false after reset")
	var parsed10: Variant = JSON.parse_string(FileAccess.get_file_as_string(TEST_SAVE_PATH))
	if int(parsed10.get("health", -1)) != r10b.STARTING_HEALTH:
		failures.append("test_reset_run_clears_state: saved reset health expected %d, got %d" % [r10b.STARTING_HEALTH, int(parsed10.get("health", -1))])
	if bool(parsed10.get("beacon_reached", true)):
		failures.append("test_reset_run_clears_state: saved reset beacon_reached should be false")
	r10b.queue_free()
	await process_frame
	_cleanup_files()

	_report()
	quit()


func _cleanup_files() -> void:
	DirAccess.remove_absolute(ProjectSettings.globalize_path(TEST_SAVE_PATH))
	DirAccess.remove_absolute(ProjectSettings.globalize_path("user://save_v1.json"))


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