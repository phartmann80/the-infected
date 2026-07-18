class_name PrototypeWeaponState
extends RefCounted

const SCHEMA_VERSION := 1
const MODE_MELEE := "melee"
const MODE_FIREARM := "firearm"

var _weapon_id := ""
var _weapon_name := "Prototype weapon"
var _ammo_type := "unknown"
var _active_mode := MODE_FIREARM
var _damage := 1
var _range_meters := 8.0
var _magazine_capacity := 1
var _magazine_ammo := 0
var _reserve_ammo := 0
var _fire_interval := 0.5
var _fire_cooldown := 0.0
var _reload_duration := 1.0
var _reload_remaining := 0.0


func initialize(item: Dictionary, reserve_ammo: int, saved: Variant = {}) -> bool:
	if not _configure(item):
		return false
	_active_mode = MODE_FIREARM
	_magazine_ammo = _magazine_capacity
	_reserve_ammo = maxi(reserve_ammo, 0)
	_fire_cooldown = 0.0
	_reload_remaining = 0.0
	_restore(saved)
	return true


func equip(item: Dictionary, reserve_ammo: int) -> bool:
	var carried_rounds := _magazine_ammo
	if not _configure(item):
		return false
	_active_mode = MODE_FIREARM
	_magazine_ammo = mini(carried_rounds, _magazine_capacity)
	_reserve_ammo = maxi(reserve_ammo, 0) + maxi(carried_rounds - _magazine_capacity, 0)
	_fire_cooldown = 0.0
	_reload_remaining = 0.0
	return true


func switch_mode() -> String:
	_active_mode = MODE_MELEE if _active_mode == MODE_FIREARM else MODE_FIREARM
	_reload_remaining = 0.0
	return _active_mode


func try_fire() -> Dictionary:
	if _active_mode != MODE_FIREARM:
		return {"fired": false, "reason": "inactive"}
	if is_reloading():
		return {"fired": false, "reason": "reloading"}
	if _fire_cooldown > 0.0:
		return {"fired": false, "reason": "cooldown"}
	if _magazine_ammo <= 0:
		return {"fired": false, "reason": "empty"}
	_magazine_ammo -= 1
	_fire_cooldown = _fire_interval
	return {
		"fired": true,
		"damage": _damage,
		"range_meters": _range_meters,
		"weapon_id": _weapon_id,
		"weapon_name": _weapon_name,
		"magazine_ammo": _magazine_ammo,
	}


func begin_reload() -> Dictionary:
	if _active_mode != MODE_FIREARM:
		return {"started": false, "reason": "inactive"}
	if is_reloading():
		return {"started": false, "reason": "reloading"}
	if _magazine_ammo >= _magazine_capacity:
		return {"started": false, "reason": "full"}
	if _reserve_ammo <= 0:
		return {"started": false, "reason": "no_reserve"}
	_reload_remaining = _reload_duration
	return {
		"started": true,
		"duration": _reload_duration,
		"weapon_name": _weapon_name,
	}


func advance(delta: float) -> Dictionary:
	_fire_cooldown = maxf(_fire_cooldown - delta, 0.0)
	if not is_reloading():
		return {"reload_completed": false}
	_reload_remaining = maxf(_reload_remaining - delta, 0.0)
	if _reload_remaining > 0.0:
		return {"reload_completed": false}
	var needed := _magazine_capacity - _magazine_ammo
	var loaded := mini(needed, _reserve_ammo)
	_magazine_ammo += loaded
	_reserve_ammo -= loaded
	return {
		"reload_completed": true,
		"loaded": loaded,
		"magazine_ammo": _magazine_ammo,
		"reserve_ammo": _reserve_ammo,
	}


func add_reserve(amount: int) -> void:
	_reserve_ammo = maxi(_reserve_ammo + amount, 0)


func active_mode() -> String:
	return _active_mode


func weapon_id() -> String:
	return _weapon_id


func weapon_name() -> String:
	return _weapon_name


func ammo_type() -> String:
	return _ammo_type


func magazine_ammo() -> int:
	return _magazine_ammo


func magazine_capacity() -> int:
	return _magazine_capacity


func reserve_ammo() -> int:
	return _reserve_ammo


func reload_duration() -> float:
	return _reload_duration


func reload_remaining() -> float:
	return _reload_remaining


func is_reloading() -> bool:
	return _reload_remaining > 0.0


func to_save_data() -> Dictionary:
	return {
		"schema_version": SCHEMA_VERSION,
		"weapon_id": _weapon_id,
		"active_mode": _active_mode,
		"magazine_ammo": _magazine_ammo,
		"reserve_ammo": _reserve_ammo,
	}


func _configure(item: Dictionary) -> bool:
	if item.is_empty() or String(item.get("category", "")) != "weapon":
		return false
	if String(item.get("status", "")) != "prototype" or bool(item.get("canonical", true)):
		return false
	var stats: Dictionary = item.get("stats", {})
	var ammo: Dictionary = item.get("ammo", {})
	var reload: Dictionary = item.get("reload", {})
	_weapon_id = String(item.get("id", ""))
	_weapon_name = String(item.get("name", "Prototype weapon"))
	_ammo_type = String(ammo.get("type", "unknown"))
	_damage = clampi(int(stats.get("damage", 1)), 1, 100)
	_range_meters = clampf(float(stats.get("rangeMeters", 8.0)), 8.0, 60.0)
	_magazine_capacity = clampi(int(ammo.get("capacity", stats.get("magazineCapacity", 1))), 1, 40)
	var fire_rate_rpm := clampf(float(stats.get("fireRateRpm", 120.0)), 45.0, 900.0)
	_fire_interval = 60.0 / fire_rate_rpm
	_reload_duration = clampf(float(reload.get("durationSeconds", 1.0)), 0.75, 4.0)
	return not _weapon_id.is_empty()


func _restore(saved: Variant) -> void:
	if typeof(saved) != TYPE_DICTIONARY:
		return
	var state: Dictionary = saved
	if int(state.get("schema_version", 0)) != SCHEMA_VERSION:
		return
	if String(state.get("weapon_id", "")) != _weapon_id:
		return
	var saved_mode := String(state.get("active_mode", MODE_FIREARM))
	if saved_mode == MODE_MELEE or saved_mode == MODE_FIREARM:
		_active_mode = saved_mode
	_magazine_ammo = clampi(int(state.get("magazine_ammo", _magazine_ammo)), 0, _magazine_capacity)
	_reserve_ammo = maxi(int(state.get("reserve_ammo", _reserve_ammo)), 0)
	_fire_cooldown = 0.0
	_reload_remaining = 0.0
