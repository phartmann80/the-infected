class_name PrototypeCombatMotion
extends RefCounted

const MELEE_IMPACT_POINT := 0.42

var _recoil_weight := 0.0
var _recoil_strength := 1.0
var _reload_total := 0.0
var _reload_remaining := 0.0
var _melee_total := 0.0
var _melee_remaining := 0.0
var _melee_impact_emitted := false
var _equip_weight := 0.0
var _sway_time := 0.0


func reset() -> void:
	_recoil_weight = 0.0
	_reload_total = 0.0
	_reload_remaining = 0.0
	_melee_total = 0.0
	_melee_remaining = 0.0
	_melee_impact_emitted = false
	_equip_weight = 0.0
	_sway_time = 0.0


func trigger_fire(strength: float = 1.0) -> void:
	_recoil_strength = clampf(strength, 0.65, 1.35)
	_recoil_weight = 1.0


func trigger_reload(duration: float) -> void:
	_reload_total = maxf(duration, 0.01)
	_reload_remaining = _reload_total
	_recoil_weight = 0.0


func cancel_reload() -> void:
	_reload_total = 0.0
	_reload_remaining = 0.0


func trigger_melee(duration: float) -> void:
	_melee_total = maxf(duration, 0.01)
	_melee_remaining = _melee_total
	_melee_impact_emitted = false


func trigger_equip() -> void:
	_equip_weight = 1.0
	_recoil_weight = 0.0
	cancel_reload()


func advance(delta: float, movement_ratio: float) -> Dictionary:
	var safe_delta := maxf(delta, 0.0)
	_sway_time += safe_delta
	_recoil_weight = move_toward(_recoil_weight, 0.0, safe_delta * 8.5)
	_equip_weight = move_toward(_equip_weight, 0.0, safe_delta * 4.8)
	_reload_remaining = maxf(_reload_remaining - safe_delta, 0.0)

	var melee_impact := false
	if _melee_remaining > 0.0:
		var previous_progress := 1.0 - (_melee_remaining / _melee_total)
		_melee_remaining = maxf(_melee_remaining - safe_delta, 0.0)
		var current_progress := 1.0 - (_melee_remaining / _melee_total)
		if not _melee_impact_emitted and previous_progress < MELEE_IMPACT_POINT and current_progress >= MELEE_IMPACT_POINT:
			_melee_impact_emitted = true
			melee_impact = true

	var reload_curve := 0.0
	if _reload_total > 0.0 and _reload_remaining > 0.0:
		var reload_progress := 1.0 - (_reload_remaining / _reload_total)
		reload_curve = sin(reload_progress * PI)
	elif _reload_remaining <= 0.0:
		_reload_total = 0.0

	var melee_curve := 0.0
	if _melee_total > 0.0 and _melee_remaining > 0.0:
		var melee_progress := 1.0 - (_melee_remaining / _melee_total)
		melee_curve = sin(melee_progress * PI)
	elif _melee_remaining <= 0.0:
		_melee_total = 0.0

	var bounded_movement := clampf(movement_ratio, 0.0, 1.0)
	var sway := sin(_sway_time * 9.5) * 0.012 * bounded_movement
	return {
		"firearm_position_offset": Vector3(0.0, sway - reload_curve * 0.06, _recoil_weight * 0.19 * _recoil_strength),
		"firearm_rotation_offset": Vector3(-_recoil_weight * 7.5 * _recoil_strength + reload_curve * 24.0, -_equip_weight * 16.0, _recoil_weight * 3.5 + reload_curve * 12.0),
		"melee_rotation_offset": Vector3(-82.0 * melee_curve, 0.0, 10.0 * melee_curve),
		"melee_impact": melee_impact,
	}


func is_melee_active() -> bool:
	return _melee_remaining > 0.0


func is_reload_active() -> bool:
	return _reload_remaining > 0.0
