extends SceneTree

const TouchInputScript := preload("res://scripts/prototype_touch_input.gd")
const MainScene := preload("res://scenes/main.tscn")


func _initialize() -> void:
	if bool(ProjectSettings.get_setting("input_devices/pointing/emulate_mouse_from_touch", true)):
		_fail("Touch-to-mouse emulation must remain disabled so movement cannot trigger melee.")
		return
	var touch := TouchInputScript.new()
	var center := Vector2(100.0, 100.0)
	if not touch.begin_movement(1, center, center, 80.0):
		_fail("Primary movement pointer was not accepted.")
		return
	if touch.movement_vector() != Vector2.ZERO:
		_fail("Movement pad center did not remain neutral.")
		return
	if touch.begin_movement(2, center, center, 80.0):
		_fail("A second pointer replaced the active movement pointer.")
		return
	touch.update_movement(1, center + Vector2(40.0, 0.0), center, 80.0)
	var half_press := touch.movement_vector()
	if half_press.x < 0.40 or half_press.x > 0.44 or absf(half_press.y) > 0.001:
		_fail("Movement dead-zone remapping did not preserve analog response.")
		return
	touch.update_movement(1, center + Vector2(120.0, 120.0), center, 80.0)
	if touch.movement_vector().length() < 0.99 or touch.movement_vector().length() > 1.001:
		_fail("Movement vector was not bounded at the pad radius.")
		return
	if not touch.begin_look(2):
		_fail("Independent look pointer was not accepted alongside movement.")
		return
	if not touch.update_look(2, Vector2(22.0, 4.0), 220.0):
		_fail("Look drag was not accepted for the active pointer.")
		return
	var look_delta := touch.consume_look_delta()
	if look_delta < 0.099 or look_delta > 0.101 or touch.consume_look_delta() != 0.0:
		_fail("Look input was not normalized and consumed exactly once.")
		return
	touch.update_look(2, Vector2(500.0, 0.0), 220.0)
	if touch.consume_look_delta() != TouchInputScript.MAX_LOOK_FRACTION_PER_TICK:
		_fail("Large look drag was not bounded for frame-time stability.")
		return
	if not touch.end_pointer(1) or touch.movement_vector() != Vector2.ZERO:
		_fail("Releasing movement did not return the pad to neutral.")
		return
	if not touch.end_pointer(2) or touch.look_pointer_id() != -1:
		_fail("Releasing look did not clear the active pointer.")
		return
	touch.begin_movement(3, center + Vector2(80.0, 0.0), center, 80.0)
	touch.begin_look(4)
	touch.reset()
	if touch.movement_pointer_id() != -1 or touch.look_pointer_id() != -1 or touch.movement_vector() != Vector2.ZERO:
		_fail("Touch reset did not clear transient input state.")
		return

	var runtime = MainScene.instantiate()
	root.add_child(runtime)
	await process_frame
	await process_frame
	var viewport_rect := Rect2(Vector2.ZERO, Vector2(1280.0, 720.0))
	if runtime.movement_pad == null or not viewport_rect.encloses(runtime.movement_pad.get_global_rect()):
		runtime.queue_free()
		_fail("Movement pad was not fully contained by the prototype viewport.")
		return
	if runtime.look_pad == null or not viewport_rect.encloses(runtime.look_pad.get_global_rect()):
		runtime.queue_free()
		_fail("Look surface was not fully contained by the prototype viewport.")
		return
	if runtime.movement_pad.get_global_rect().intersects(runtime.look_pad.get_global_rect()):
		runtime.queue_free()
		_fail("Movement and look surfaces overlap in the landscape layout.")
		return
	if runtime.narration_label == null or not viewport_rect.encloses(runtime.narration_label.get_global_rect()):
		runtime.queue_free()
		_fail("Narration subtitles were not contained by the landscape safe area.")
		return
	if not (runtime.prototype_infected_foley_audio_player is AudioStreamPlayer3D) or not (runtime.prototype_beacon_audio_player is AudioStreamPlayer3D):
		runtime.queue_free()
		_fail("Infected foley and beacon locator cues were not configured as spatial audio emitters.")
		return
	if runtime.find_child("zone_checkpoint_metal", true, false) == null or runtime.find_child("zone_vehicle_gravel", true, false) == null:
		runtime.queue_free()
		_fail("Scene surface zones were not represented in the runtime environment.")
		return
	if runtime.status_label.text.contains("Renderer:") or runtime.status_label.text.contains("Data:"):
		runtime.queue_free()
		_fail("Player HUD still exposes technical diagnostics in the objective hierarchy.")
		return
	var buttons := runtime.find_children("*", "Button", true, false)
	for button in buttons:
		if button.custom_minimum_size.x < 48.0 or button.custom_minimum_size.y < 48.0:
			runtime.queue_free()
			_fail("A touch button is smaller than the 48 pixel prototype minimum: %s." % button.name)
			return
	runtime.queue_free()
	await process_frame
	print("Android touch input test passed: analog dead zone, bounded multitouch, drag look, release recovery, landscape subtitle containment, spatial scene-audio emitters, readable HUD hierarchy, and touch target sizing.")
	quit(0)


func _fail(message: String) -> void:
	push_error(message)
	quit(1)
