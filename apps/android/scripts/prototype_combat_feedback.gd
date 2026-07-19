class_name PrototypeCombatFeedback
extends RefCounted

const HIT_MARKER_DURATION := 0.18
const INTERRUPT_MARKER_DURATION := 0.24
const DEFEAT_MARKER_DURATION := 0.34
const PLAYER_DAMAGE_DURATION := 0.32

var _hit_marker_timer := 0.0
var _hit_marker_duration := HIT_MARKER_DURATION
var _hit_strength := 0.0
var _marker_text := "HIT"
var _player_damage_timer := 0.0
var _camera_impact := 0.0


func reset() -> void:
	_hit_marker_timer = 0.0
	_hit_marker_duration = HIT_MARKER_DURATION
	_hit_strength = 0.0
	_marker_text = "HIT"
	_player_damage_timer = 0.0
	_camera_impact = 0.0


func register_infected_hit(damage: int, interrupted: bool, defeated: bool) -> void:
	_hit_strength = clampf(float(damage) / 80.0, 0.45, 1.25)
	_marker_text = "DOWN" if defeated else ("BREAK" if interrupted else "HIT")
	_hit_marker_duration = DEFEAT_MARKER_DURATION if defeated else (INTERRUPT_MARKER_DURATION if interrupted else HIT_MARKER_DURATION)
	_hit_marker_timer = _hit_marker_duration
	_camera_impact = maxf(_camera_impact, 0.22 + _hit_strength * 0.18)


func register_player_damage(damage: int) -> void:
	_player_damage_timer = PLAYER_DAMAGE_DURATION
	_camera_impact = maxf(_camera_impact, clampf(float(damage) / 20.0, 0.45, 1.0))


func advance(delta: float) -> void:
	var safe_delta := maxf(delta, 0.0)
	_hit_marker_timer = maxf(_hit_marker_timer - safe_delta, 0.0)
	_player_damage_timer = maxf(_player_damage_timer - safe_delta, 0.0)
	_camera_impact = move_toward(_camera_impact, 0.0, safe_delta * 5.5)


func hit_marker_alpha() -> float:
	if _hit_marker_timer <= 0.0:
		return 0.0
	return clampf(_hit_marker_timer / _hit_marker_duration, 0.0, 1.0)


func damage_overlay_alpha() -> float:
	return clampf(_player_damage_timer / PLAYER_DAMAGE_DURATION, 0.0, 1.0) * 0.24


func camera_impact() -> float:
	return _camera_impact


func hit_strength() -> float:
	return _hit_strength


func marker_text() -> String:
	return _marker_text
