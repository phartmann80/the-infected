extends SceneTree

const CombatMotionScript := preload("res://scripts/prototype_combat_motion.gd")
const CombatFeedbackScript := preload("res://scripts/prototype_combat_feedback.gd")
const ActorAnimationScript := preload("res://scripts/prototype_actor_animation.gd")
const SceneAudioScript := preload("res://scripts/prototype_scene_audio.gd")
const MainScript := preload("res://scripts/main.gd")
const SCENE_AUDIO_PATH := "res://data/scene_audio.v1.json"


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
	if motion.melee_progress() <= 0.0 or motion.melee_progress() > 1.0:
		_fail("Combat motion did not expose bounded melee progress for the articulated rig.")
		return

	var survivor_animation := ActorAnimationScript.new(ActorAnimationScript.ROLE_SURVIVOR)
	var survivor_pose: Dictionary = {}
	var survivor_step_observed := false
	for frame in range(8):
		survivor_pose = survivor_animation.advance(0.1, 1.0)
		survivor_step_observed = survivor_step_observed or bool(survivor_pose.get("footstep", false))
	var left_leg: Vector3 = survivor_pose.get("left_leg_rotation", Vector3.ZERO)
	var right_leg: Vector3 = survivor_pose.get("right_leg_rotation", Vector3.ZERO)
	if not survivor_step_observed or absf(left_leg.x + right_leg.x) > 0.01:
		_fail("Survivor locomotion did not produce synchronized opposite-leg motion and a footstep event.")
		return
	var melee_pose := survivor_animation.advance(0.016, 0.0, "idle", 0.0, ActorAnimationScript.ACTION_MELEE, 0.5)
	var melee_torso: Vector3 = melee_pose.get("torso_rotation", Vector3.ZERO)
	var melee_arm: Vector3 = melee_pose.get("right_arm_rotation", Vector3.ZERO)
	if absf(melee_torso.y) < 25.0 or melee_arm.x > -60.0:
		_fail("Survivor melee animation did not coordinate torso twist and striking arm pose.")
		return
	var infected_animation := ActorAnimationScript.new(ActorAnimationScript.ROLE_INFECTED)
	var windup_pose := infected_animation.advance(0.016, 0.0, "wind-up", 0.75)
	var windup_arm: Vector3 = windup_pose.get("right_arm_rotation", Vector3.ZERO)
	if float(windup_pose.get("root_position_y", 0.0)) > -0.10 or windup_arm.x > -90.0:
		_fail("Infected wind-up animation did not create a readable crouch and raised strike pose.")
		return

	var scene_audio := SceneAudioScript.new()
	if not scene_audio.load_from_path(SCENE_AUDIO_PATH):
		_fail("Scene audio catalog did not load: %s" % scene_audio.error_message)
		return
	if scene_audio.surface_id_at(Vector3(0.0, 0.0, 4.0)) != "surface.concrete":
		_fail("Default route position did not resolve to concrete foley.")
		return
	if scene_audio.surface_id_at(Vector3(0.0, 0.0, -7.0)) != "surface.metal":
		_fail("Checkpoint zone did not resolve to metal foley.")
		return
	if scene_audio.surface_id_at(Vector3(-6.5, 0.0, -2.0)) != "surface.gravel":
		_fail("Vehicle zone did not resolve to gravel foley.")
		return
	if scene_audio.beacon_cue_id() != "audio.environment.beacon.pulse":
		_fail("Scene audio catalog did not expose the spatial beacon cue.")
		return
	var survivor_metal := scene_audio.footstep_profile(SceneAudioScript.ROLE_SURVIVOR, Vector3(0.0, 0.0, -7.0), "left")
	var infected_metal := scene_audio.footstep_profile(SceneAudioScript.ROLE_INFECTED, Vector3(0.0, 0.0, -7.0), "right")
	if survivor_metal.get("cueId", "") != "audio.foley.survivor.footstep.metal" or infected_metal.get("cueId", "") != "audio.foley.infected.footstep.metal":
		_fail("Surface foley did not preserve distinct survivor and spatial infected cue IDs.")
		return
	var survivor_synthesis := survivor_metal.get("synthesis", {}) as Dictionary
	var infected_synthesis := infected_metal.get("synthesis", {}) as Dictionary
	if float(infected_synthesis.get("baseFrequencyHz", 0.0)) >= float(survivor_synthesis.get("baseFrequencyHz", 0.0)):
		_fail("Infected foley profile did not retain its heavier deterministic pitch treatment.")
		return
	var route_ambience := scene_audio.reset_ambience(SceneAudioScript.AMBIENCE_ROUTE)
	var threat_ambience := scene_audio.advance_ambience(0.5, SceneAudioScript.AMBIENCE_THREAT)
	if threat_ambience.get("cueId", "") != "audio.ambience.checkpoint.threat" or float(threat_ambience.get("gain", 0.0)) <= float(route_ambience.get("gain", 0.0)):
		_fail("Threat ambience did not crossfade toward the higher-pressure scene state.")
		return
	var narration := scene_audio.narration_for_event("threat_spotted")
	if narration.get("audioCueId", "") != "audio.narration.operator.threat_spotted" or String(narration.get("subtitle", "")).length() < 20:
		_fail("Narration event did not expose stable voice and subtitle timing data.")
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
	if not main.prototype_scene_audio.load_from_path(SCENE_AUDIO_PATH):
		main.free()
		_fail("Main runtime narration director could not load scene audio data.")
		return
	main._queue_narration("route_start")
	main._queue_narration("threat_spotted")
	if main.active_narration.get("id", "") != "narration.operator.threat_spotted":
		main.free()
		_fail("High-priority combat narration did not interrupt lower-priority route guidance.")
		return
	main.free()
	print("Android combat polish test passed: articulated motion, surface-aware spatial foley, adaptive ambience, narration cue contracts, blended weapon motion, low-frame-rate fire buffering, hit markers, damage overlay, and camera response.")
	quit(0)


func _fail(message: String) -> void:
	push_error(message)
	quit(1)
