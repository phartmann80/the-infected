class_name PrototypeActorAnimation
extends RefCounted

const ROLE_SURVIVOR := "survivor"
const ROLE_INFECTED := "infected"

const ACTION_NONE := "none"
const ACTION_FIRE := "fire"
const ACTION_RELOAD := "reload"
const ACTION_MELEE := "melee"

var _role := ROLE_SURVIVOR
var _elapsed := 0.0
var _locomotion_phase := 0.0
var _locomotion_blend := 0.0


func _init(role: String = ROLE_SURVIVOR) -> void:
	_role = role if role == ROLE_INFECTED else ROLE_SURVIVOR


func reset() -> void:
	_elapsed = 0.0
	_locomotion_phase = 0.0
	_locomotion_blend = 0.0


func advance(
	delta: float,
	movement_ratio: float,
	state: String = "idle",
	state_progress: float = 0.0,
	action: String = ACTION_NONE,
	action_progress: float = 0.0,
) -> Dictionary:
	var safe_delta := maxf(delta, 0.0)
	_elapsed += safe_delta
	var target_blend := clampf(movement_ratio, 0.0, 1.0)
	_locomotion_blend = move_toward(_locomotion_blend, target_blend, safe_delta * 6.0)
	var previous_step_marker := int(floor(_locomotion_phase / PI))
	_locomotion_phase += safe_delta * lerpf(4.8, 8.6, _locomotion_blend) * _locomotion_blend
	var current_step_marker := int(floor(_locomotion_phase / PI))
	var gait := sin(_locomotion_phase) * _locomotion_blend
	var bounce := absf(sin(_locomotion_phase)) * 0.035 * _locomotion_blend
	var stride := 30.0 if _role == ROLE_SURVIVOR else 37.0

	var pose := {
		"root_position_y": bounce,
		"root_rotation": Vector3(0.0, 0.0, -gait * (1.3 if _role == ROLE_SURVIVOR else 2.4)),
		"torso_rotation": Vector3(-3.5 * _locomotion_blend, 0.0, gait * 2.4),
		"head_rotation": Vector3(0.0, -gait * 2.0, -gait * 1.2),
		"left_arm_rotation": Vector3(gait * stride * 0.82, 0.0, -5.0),
		"right_arm_rotation": Vector3(-gait * stride * 0.82, 0.0, 5.0),
		"left_leg_rotation": Vector3(-gait * stride, 0.0, 0.0),
		"right_leg_rotation": Vector3(gait * stride, 0.0, 0.0),
		"footstep": _locomotion_blend > 0.34 and current_step_marker > previous_step_marker,
		"footstep_side": "left" if current_step_marker % 2 == 0 else "right",
		"locomotion_blend": _locomotion_blend,
	}

	if _role == ROLE_INFECTED:
		_apply_infected_state(pose, state, clampf(state_progress, 0.0, 1.0), gait)
	else:
		_apply_survivor_action(pose, action, clampf(action_progress, 0.0, 1.0))
	return pose


func _apply_survivor_action(pose: Dictionary, action: String, progress: float) -> void:
	match action:
		ACTION_MELEE:
			var swing := sin(progress * PI)
			pose["torso_rotation"] = Vector3(-4.0, -34.0 * swing, -8.0 * swing)
			pose["head_rotation"] = Vector3(0.0, 12.0 * swing, 0.0)
			pose["right_arm_rotation"] = Vector3(-78.0 * swing, 0.0, -28.0 * swing)
			pose["left_arm_rotation"] = Vector3(-18.0 * swing, 0.0, -8.0)
		ACTION_RELOAD:
			var reload_curve := sin(progress * PI)
			pose["torso_rotation"] = Vector3(8.0 * reload_curve, -8.0 * reload_curve, 0.0)
			pose["head_rotation"] = Vector3(12.0 * reload_curve, 0.0, 0.0)
			pose["left_arm_rotation"] = Vector3(-62.0 * reload_curve, 8.0, -18.0)
			pose["right_arm_rotation"] = Vector3(-54.0 * reload_curve, -6.0, 16.0)
		ACTION_FIRE:
			pose["torso_rotation"] = Vector3(-4.5 * progress, 0.0, -2.5 * progress)
			pose["right_arm_rotation"] = Vector3(-12.0 * progress, 0.0, 4.0)


func _apply_infected_state(pose: Dictionary, state: String, progress: float, gait: float) -> void:
	pose["left_arm_rotation"] = Vector3(-18.0 + gait * 18.0, 0.0, -12.0)
	pose["right_arm_rotation"] = Vector3(-24.0 - gait * 18.0, 0.0, 14.0)
	pose["torso_rotation"] = Vector3(7.0 - absf(gait) * 4.0, 0.0, gait * 4.0)
	match state:
		"dormant":
			pose["root_position_y"] = sin(_elapsed * 1.25) * 0.018
			pose["torso_rotation"] = Vector3(7.0 + sin(_elapsed * 1.25) * 1.2, 0.0, sin(_elapsed * 0.72) * 1.4)
			pose["head_rotation"] = Vector3(7.0, -16.0, sin(_elapsed * 0.9) * 4.0)
			pose["left_arm_rotation"] = Vector3(12.0, 0.0, -8.0)
			pose["right_arm_rotation"] = Vector3(19.0, 0.0, 13.0)
		"alert":
			pose["root_position_y"] = -0.06 * sin(progress * PI)
			pose["torso_rotation"] = Vector3(-10.0, 0.0, 0.0)
			pose["head_rotation"] = Vector3(-12.0, lerpf(-24.0, 22.0, progress), 5.0)
			pose["left_arm_rotation"] = Vector3(-28.0, 0.0, -18.0)
			pose["right_arm_rotation"] = Vector3(-34.0, 0.0, 20.0)
		"wind-up":
			var windup := sin(progress * PI * 0.5)
			pose["root_position_y"] = -0.16 * windup
			pose["torso_rotation"] = Vector3(20.0 * windup, -7.0, 0.0)
			pose["head_rotation"] = Vector3(-18.0 * windup, 0.0, 0.0)
			pose["left_arm_rotation"] = Vector3(lerpf(-18.0, -104.0, windup), 0.0, -24.0)
			pose["right_arm_rotation"] = Vector3(lerpf(-24.0, -112.0, windup), 0.0, 27.0)
		"recovery":
			var recovery := 1.0 - progress
			pose["root_position_y"] = -0.10 * recovery
			pose["torso_rotation"] = Vector3(18.0 * recovery, 9.0 * recovery, 0.0)
			pose["left_arm_rotation"] = Vector3(-58.0 * recovery, 0.0, -16.0)
			pose["right_arm_rotation"] = Vector3(-66.0 * recovery, 0.0, 19.0)
		"staggered":
			var stagger := sin(progress * PI)
			pose["root_position_y"] = 0.04 * stagger
			pose["torso_rotation"] = Vector3(-13.0 * stagger, 11.0 * stagger, 19.0 * stagger)
			pose["head_rotation"] = Vector3(9.0 * stagger, -14.0 * stagger, -12.0 * stagger)
			pose["left_arm_rotation"] = Vector3(34.0 * stagger, 0.0, -27.0)
			pose["right_arm_rotation"] = Vector3(-8.0, 0.0, 32.0 * stagger)
