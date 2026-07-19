class_name PrototypeTouchInput
extends RefCounted

const MOVEMENT_DEAD_ZONE := 0.14
const MAX_LOOK_FRACTION_PER_TICK := 0.12

var _movement_pointer_id := -1
var _look_pointer_id := -1
var _movement_vector := Vector2.ZERO
var _look_delta_fraction := 0.0


func reset() -> void:
	_movement_pointer_id = -1
	_look_pointer_id = -1
	_movement_vector = Vector2.ZERO
	_look_delta_fraction = 0.0


func begin_movement(pointer_id: int, local_position: Vector2, center: Vector2, radius: float) -> bool:
	if _movement_pointer_id != -1 or pointer_id == _look_pointer_id:
		return false
	_movement_pointer_id = pointer_id
	_update_movement(local_position, center, radius)
	return true


func begin_look(pointer_id: int) -> bool:
	if _look_pointer_id != -1 or pointer_id == _movement_pointer_id:
		return false
	_look_pointer_id = pointer_id
	return true


func update_movement(pointer_id: int, local_position: Vector2, center: Vector2, radius: float) -> bool:
	if pointer_id != _movement_pointer_id:
		return false
	_update_movement(local_position, center, radius)
	return true


func update_look(pointer_id: int, relative_pixels: Vector2, surface_width: float) -> bool:
	if pointer_id != _look_pointer_id:
		return false
	var normalized_delta := relative_pixels.x / maxf(surface_width, 1.0)
	_look_delta_fraction = clampf(
		_look_delta_fraction + normalized_delta,
		-MAX_LOOK_FRACTION_PER_TICK,
		MAX_LOOK_FRACTION_PER_TICK,
	)
	return true


func end_pointer(pointer_id: int) -> bool:
	var released := false
	if pointer_id == _movement_pointer_id:
		_movement_pointer_id = -1
		_movement_vector = Vector2.ZERO
		released = true
	if pointer_id == _look_pointer_id:
		_look_pointer_id = -1
		released = true
	return released


func movement_vector() -> Vector2:
	return _movement_vector


func consume_look_delta() -> float:
	var value := _look_delta_fraction
	_look_delta_fraction = 0.0
	return value


func movement_pointer_id() -> int:
	return _movement_pointer_id


func look_pointer_id() -> int:
	return _look_pointer_id


func _update_movement(local_position: Vector2, center: Vector2, radius: float) -> void:
	var normalized := (local_position - center) / maxf(radius, 1.0)
	var magnitude := minf(normalized.length(), 1.0)
	if magnitude <= MOVEMENT_DEAD_ZONE:
		_movement_vector = Vector2.ZERO
		return
	var remapped_magnitude := (magnitude - MOVEMENT_DEAD_ZONE) / (1.0 - MOVEMENT_DEAD_ZONE)
	_movement_vector = normalized.normalized() * remapped_magnitude
