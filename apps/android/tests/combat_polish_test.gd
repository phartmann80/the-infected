extends SceneTree

const CombatMotionScript := preload("res://scripts/prototype_combat_motion.gd")
const CombatFeedbackScript := preload("res://scripts/prototype_combat_feedback.gd")
const MainScript := preload("res://scripts/main.gd")


func _initialize() -> void:
	var motion := CombatMotionScript.new()
	motion.trigger_fire(1.0)
	var recoil := motion.advance(0.016, 0.0)
	var recoil_offset: Vector3 = recoil.get("firearm_position_offset", Vector3.ZERO)
	if recoil_offset.z <= 0.1:
		_fail("Fire did not produce a readable blended recoil offset.")
		return
	var recovered := motion.advance(0.2, 0.0)
	var recovered_offset: Vector3 = recovered.get("firearm_position_offset", Vector3.ZERO)
	if recovered_offset.z >= recoil_offset.z:
		_fail("Recoil did not decay toward the resting pose.")
		return
	motion.trigger_reload(1.0)
	var reload_midpoint := motion.advance(0.5, 0.0)
	var reload_rotation: Vector3 = reload_midpoint.get("firearm_rotation_offset", Vector3.ZERO)
	if reload_rotation.x < 20.0 or not motion.is_reload_active():
		_fail("Reload midpoint did not produce the expected blended presentation.")
		return
	motion.advance(0.51, 0.0)
	if motion.is_reload_active():
		_fail("Reload motion did not complete at the configured duration.")
		return
	motion.trigger_melee(1.0)
	if bool(motion.advance(0.30, 0.0).get("melee_impact", false)):
		_fail("Melee impact fired before the animation impact point.")
		return
	if not bool(motion.advance(0.13, 0.0).get("melee_impact", false)):
		_fail("Melee impact did not fire when the blended swing crossed its impact point.")
		return
	if bool(motion.advance(0.10, 0.0).get("melee_impact", false)):
		_fail("Melee impact fired more than once during one swing.")
		return

	var feedback := CombatFeedbackScript.new()
	feedback.register_infected_hit(38, false, false)
	if feedback.marker_text() != "HIT" or feedback.hit_marker_alpha() < 0.99:
		_fail("Standard infected hit feedback was not registered.")
		return
	feedback.advance(CombatFeedbackScript.HIT_MARKER_DURATION * 0.5)
	if feedback.hit_marker_alpha() <= 0.0 or feedback.hit_marker_alpha() >= 0.75:
		_fail("Hit marker did not decay over time.")
		return
	feedback.register_infected_hit(38, true, false)
	if feedback.marker_text() != "BREAK":
		_fail("Interrupted attack did not produce BREAK feedback.")
		return
	feedback.register_infected_hit(92, false, true)
	if feedback.marker_text() != "DOWN" or feedback.hit_strength() <= 1.0:
		_fail("Defeat feedback did not reflect a heavy final hit.")
		return
	feedback.register_player_damage(10)
	if feedback.damage_overlay_alpha() <= 0.0 or feedback.camera_impact() <= 0.0:
		_fail("Player damage did not produce overlay and camera feedback.")
		return
	feedback.advance(CombatFeedbackScript.PLAYER_DAMAGE_DURATION + 0.01)
	if feedback.damage_overlay_alpha() != 0.0:
		_fail("Player damage overlay did not clear after its bounded duration.")
		return

	var main := MainScript.new()
	var weapon := {
		"id": "weapon.test",
		"name": "Test weapon",
		"category": "weapon",
		"status": "prototype",
		"canonical": false,
		"stats": {"damage": 38, "rangeMeters": 12.0, "fireRateRpm": 120.0},
		"ammo": {"type": "test", "capacity": 4},
		"reload": {"durationSeconds": 1.0},
	}
	if not main.prototype_weapon_state.initialize(weapon, 0):
		main.free()
		_fail("Buffered-fire test weapon did not initialize.")
		return
	main.prototype_weapon_state.try_fire()
	main.prototype_weapon_state.advance(main.prototype_weapon_state.fire_cooldown_remaining() - 0.05)
	main.fire_buffer_timer = 0.12
	main._update_weapon_state(0.13)
	if main.prototype_weapon_state.magazine_ammo() != 2 or main.fire_buffer_timer != 0.0:
		main.free()
		_fail("Buffered fire did not resolve when a low frame rate crossed both timer boundaries.")
		return
	main.free()
	print("Android combat polish test passed: blended recoil, reload, melee impact timing, low-frame-rate fire buffering, hit markers, damage overlay, and camera response.")
	quit(0)


func _fail(message: String) -> void:
	push_error(message)
	quit(1)
