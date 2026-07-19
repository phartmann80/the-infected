class_name PrototypeInfectedBrain
extends RefCounted

const STATE_DORMANT := "dormant"
const STATE_ALERT := "alert"
const STATE_PURSUIT := "pursuit"
const STATE_WINDUP := "wind-up"
const STATE_RECOVERY := "recovery"
const STATE_STAGGERED := "staggered"

const PROXIMITY_DETECTION_RANGE := 5.6
const ATTACK_ENTER_RANGE := 1.72
const ATTACK_RESOLVE_RANGE := 2.05
const ALERT_DURATION := 0.46
const WINDUP_DURATION := 0.48
const RECOVERY_DURATION := 0.76
const STAGGER_DURATION := 0.28
const POST_STAGGER_GRACE := 0.24

var _state := STATE_DORMANT
var _state_timer := 0.0
var _attack_cooldown := 0.0
var _elapsed := 0.0
var _engaged := false


func reset(start_engaged: bool = false) -> void:
	_state = STATE_PURSUIT if start_engaged else STATE_DORMANT
	_state_timer = 0.0
	_attack_cooldown = 0.0
	_elapsed = 0.0
	_engaged = start_engaged


func advance(delta: float, distance_to_player: float, objective_active: bool) -> Dictionary:
	_elapsed += maxf(delta, 0.0)
	_attack_cooldown = maxf(_attack_cooldown - delta, 0.0)
	var previous_state := _state
	var attack_requested := false

	match _state:
		STATE_DORMANT:
			if objective_active or distance_to_player <= PROXIMITY_DETECTION_RANGE:
				_engaged = true
				_set_state(STATE_ALERT, ALERT_DURATION)
		STATE_ALERT, STATE_STAGGERED:
			_tick_state_timer(delta)
			if _state_timer <= 0.0:
				_set_state(STATE_PURSUIT)
		STATE_WINDUP:
			_tick_state_timer(delta)
			if _state_timer <= 0.0:
				attack_requested = true
				_attack_cooldown = RECOVERY_DURATION
				_set_state(STATE_RECOVERY, RECOVERY_DURATION)
		STATE_RECOVERY:
			_tick_state_timer(delta)
			if _state_timer <= 0.0:
				_set_state(STATE_PURSUIT)
		STATE_PURSUIT:
			if distance_to_player <= ATTACK_ENTER_RANGE and _attack_cooldown <= 0.0:
				_set_state(STATE_WINDUP, WINDUP_DURATION)

	var speed_scale := 0.0
	var strafe_weight := 0.0
	if _state == STATE_PURSUIT:
		speed_scale = clampf((distance_to_player - ATTACK_ENTER_RANGE) / 4.5, 0.48, 1.0)
		if distance_to_player > 2.8:
			strafe_weight = sin(_elapsed * 2.15) * 0.22

	return {
		"state": _state,
		"state_changed": _state != previous_state,
		"previous_state": previous_state,
		"attack_requested": attack_requested,
		"speed_scale": speed_scale,
		"strafe_weight": strafe_weight,
	}


func apply_stagger() -> bool:
	var interrupted_attack := _state == STATE_WINDUP
	_engaged = true
	_attack_cooldown = maxf(_attack_cooldown, POST_STAGGER_GRACE)
	_set_state(STATE_STAGGERED, STAGGER_DURATION)
	return interrupted_attack


func state() -> String:
	return _state


func state_timer() -> float:
	return _state_timer


func is_engaged() -> bool:
	return _engaged


func _set_state(next_state: String, duration: float = 0.0) -> void:
	_state = next_state
	_state_timer = maxf(duration, 0.0)


func _tick_state_timer(delta: float) -> void:
	_state_timer = maxf(_state_timer - delta, 0.0)
