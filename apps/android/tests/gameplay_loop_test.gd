extends SceneTree

const TEST_SAVE_PATH := "user://gameplay_loop_contract_test.json"
const FIELD_LOOT_GEAR_ID := "gear.bastion-vest"
const MainScene := preload("res://scenes/main.tscn")


func _initialize() -> void:
	_cleanup()
	var runtime = MainScene.instantiate()
	runtime.save_path = TEST_SAVE_PATH
	root.add_child(runtime)
	await process_frame
	await process_frame
	# Keep this state contract hermetic by suppressing transient UI timers.
	runtime.feedback_label = null
	if not runtime.prototype_field_inventory.has_item("weapon.warden9") or not runtime.prototype_field_inventory.has_item("gear.fieldpack45"):
		_fail_with_runtime(runtime, "Starter field inventory was not initialized.")
		return
	if runtime.prototype_field_inventory.has_item(FIELD_LOOT_GEAR_ID):
		_fail_with_runtime(runtime, "Milestone gear was carried before the infected drop was collected.")
		return
	runtime.inventory_selected_item_id = FIELD_LOOT_GEAR_ID
	runtime._equip_selected_item()
	if runtime.prototype_loadout.equipped_item_id("gear") != "gear.fieldpack45":
		_fail_with_runtime(runtime, "Preview-only gear could be equipped before field collection.")
		return

	runtime.beacon_reached = true
	runtime._defeat_infected(true, false)
	if runtime.infected != null or runtime.salvage_drop == null:
		_fail_with_runtime(runtime, "Defeating the infected did not create the field-loot drop.")
		return
	if String(runtime.salvage_drop.get_meta("prototype_item_id", "")) != FIELD_LOOT_GEAR_ID:
		_fail_with_runtime(runtime, "Infected drop did not reference the deterministic catalog gear item.")
		return

	runtime.player.global_position = runtime.salvage_drop.global_position
	runtime._collect_pickups()
	if not runtime.salvage_drop_collected or runtime.salvage_drop != null:
		_fail_with_runtime(runtime, "Field-loot collection did not clear the world drop.")
		return
	if not runtime.prototype_field_inventory.has_item(FIELD_LOOT_GEAR_ID):
		_fail_with_runtime(runtime, "Collected gear was not added to local field inventory.")
		return
	if int(runtime.inventory.get("scrap", 0)) != 3:
		_fail_with_runtime(runtime, "Loot collection did not preserve the existing scrap reward.")
		return

	runtime._update_objective()
	if not runtime.run_complete:
		_fail_with_runtime(runtime, "Collecting the infected drop did not complete the route.")
		return
	runtime.inventory_selected_item_id = FIELD_LOOT_GEAR_ID
	runtime._equip_selected_item()
	if runtime.prototype_loadout.equipped_item_id("gear") != FIELD_LOOT_GEAR_ID:
		_fail_with_runtime(runtime, "Collected gear could not be equipped from local field inventory.")
		return
	if String(runtime.player_gear.get_meta("prototype_item_id", "")) != FIELD_LOOT_GEAR_ID:
		_fail_with_runtime(runtime, "Equipped gear did not update the player presentation.")
		return

	runtime.player.position = Vector3(2.25, 1.0, -1.75)
	if not runtime._save_game():
		_fail_with_runtime(runtime, "Completed gameplay state could not be saved.")
		return
	var saved_text := FileAccess.get_file_as_string(TEST_SAVE_PATH)
	var saved: Variant = JSON.parse_string(saved_text)
	if typeof(saved) != TYPE_DICTIONARY or int(saved.get("schema_version", 0)) != 7:
		_fail_with_runtime(runtime, "Gameplay loop did not write save schema 7.")
		return
	var field_state: Dictionary = saved.get("prototype_field_inventory", {})
	if not Array(field_state.get("carried_item_ids", [])).has(FIELD_LOOT_GEAR_ID):
		_fail_with_runtime(runtime, "Save file did not include collected field gear.")
		return
	for forbidden_term: String in ["purchase", "entitlement", "price", "provider"]:
		if saved_text.to_lower().contains(forbidden_term):
			_fail_with_runtime(runtime, "Local gameplay save leaked commerce state: %s." % forbidden_term)
			return

	runtime.queue_free()
	await process_frame
	var restored = MainScene.instantiate()
	restored.save_path = TEST_SAVE_PATH
	root.add_child(restored)
	await process_frame
	await process_frame
	if not restored.run_complete or restored.infected != null or not restored.salvage_drop_collected:
		_fail_with_runtime(restored, "Reload did not restore completed encounter and collected-drop state.")
		return
	if not restored.prototype_field_inventory.has_item(FIELD_LOOT_GEAR_ID):
		_fail_with_runtime(restored, "Reload lost collected field inventory.")
		return
	if restored.prototype_loadout.equipped_item_id("gear") != FIELD_LOOT_GEAR_ID:
		_fail_with_runtime(restored, "Reload lost the equipped gear selection.")
		return
	if String(restored.player_gear.get_meta("prototype_item_id", "")) != FIELD_LOOT_GEAR_ID:
		_fail_with_runtime(restored, "Reload lost the equipped gear presentation.")
		return
	if restored.player.position.distance_to(Vector3(2.25, 1.0, -1.75)) > 0.01:
		_fail_with_runtime(restored, "Reload lost the saved player position.")
		return
	var pad_rect: Rect2 = restored.movement_pad.get_global_rect()
	if not restored._begin_touch_pointer(77, pad_rect.get_center() + Vector2(48.0, 0.0)):
		_fail_with_runtime(restored, "Completed save did not accept continued movement input.")
		return
	if restored.prototype_touch_input.movement_vector().length() <= 0.1:
		_fail_with_runtime(restored, "Continued movement input remained neutral after reload.")
		return

	restored.queue_free()
	await process_frame
	_cleanup()
	print("Android gameplay loop test passed: spawn, encounter, defeat, catalog loot, field inventory, gear equip, save, reload, and continued input.")
	quit(0)


func _fail_with_runtime(runtime, message: String) -> void:
	if runtime != null and is_instance_valid(runtime):
		runtime.queue_free()
	_fail(message)


func _fail(message: String) -> void:
	push_error(message)
	_cleanup()
	quit(1)


func _cleanup() -> void:
	DirAccess.remove_absolute(ProjectSettings.globalize_path(TEST_SAVE_PATH))
