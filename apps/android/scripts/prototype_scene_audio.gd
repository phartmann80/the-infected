class_name PrototypeSceneAudio
extends RefCounted

const ROLE_SURVIVOR := "survivor"
const ROLE_INFECTED := "infected"

const AMBIENCE_ROUTE := "route"
const AMBIENCE_THREAT := "threat"
const AMBIENCE_SECURED := "secured"

var error_message := ""
var _default_surface_id := ""
var _beacon_cue_id := ""
var _surfaces: Dictionary = {}
var _zones: Array = []
var _ambience_states: Dictionary = {}
var _narration_cues: Dictionary = {}
var _ambience_values: Dictionary = {}


func load_from_path(path: String) -> bool:
	_clear()
	error_message = ""
	if not FileAccess.file_exists(path):
		error_message = "Scene audio catalog not found: %s" % path
		return false
	var parsed = JSON.parse_string(FileAccess.get_file_as_string(path))
	if typeof(parsed) != TYPE_DICTIONARY:
		error_message = "Scene audio catalog is not a JSON object."
		return false
	if int(parsed.get("schemaVersion", 0)) != 1 or String(parsed.get("status", "")) != "prototype":
		error_message = "Scene audio catalog schema or status is unsupported."
		return false

	_default_surface_id = String(parsed.get("defaultSurfaceId", ""))
	_beacon_cue_id = String(parsed.get("beaconCueId", ""))
	for surface_value in parsed.get("surfaces", []):
		if surface_value is Dictionary:
			var surface: Dictionary = surface_value
			var surface_id := String(surface.get("id", ""))
			if not surface_id.is_empty():
				_surfaces[surface_id] = surface.duplicate(true)
	for zone_value in parsed.get("zones", []):
		if zone_value is Dictionary:
			_zones.append((zone_value as Dictionary).duplicate(true))
	for state_value in parsed.get("ambienceStates", []):
		if state_value is Dictionary:
			var state: Dictionary = state_value
			var state_id := String(state.get("id", ""))
			if not state_id.is_empty():
				_ambience_states[state_id] = state.duplicate(true)
	for cue_value in parsed.get("narrationCues", []):
		if cue_value is Dictionary:
			var cue: Dictionary = cue_value
			var event_id := String(cue.get("event", ""))
			if not event_id.is_empty():
				_narration_cues[event_id] = cue.duplicate(true)

	if not _surfaces.has(_default_surface_id) or _beacon_cue_id.is_empty():
		error_message = "Scene audio default surface is unavailable."
		_clear()
		return false
	if not _ambience_states.has(AMBIENCE_ROUTE):
		error_message = "Scene audio route ambience is unavailable."
		_clear()
		return false
	reset_ambience(AMBIENCE_ROUTE)
	return true


func is_loaded() -> bool:
	return not _surfaces.is_empty() and not _ambience_states.is_empty()


func surface_zones() -> Array:
	return _zones.duplicate(true)


func beacon_cue_id() -> String:
	return _beacon_cue_id


func surface_definition(surface_id: String) -> Dictionary:
	return (_surfaces.get(surface_id, {}) as Dictionary).duplicate(true)


func surface_id_at(world_position: Vector3) -> String:
	for zone_value in _zones:
		var zone := zone_value as Dictionary
		var center := zone.get("center", []) as Array
		var size := zone.get("size", []) as Array
		if center.size() != 2 or size.size() != 2:
			continue
		var inside_x := absf(world_position.x - float(center[0])) <= float(size[0]) * 0.5
		var inside_z := absf(world_position.z - float(center[1])) <= float(size[1]) * 0.5
		if inside_x and inside_z:
			return String(zone.get("surfaceId", _default_surface_id))
	return _default_surface_id


func footstep_profile(role: String, world_position: Vector3, foot_side: String) -> Dictionary:
	var surface_id := surface_id_at(world_position)
	var surface := _surfaces.get(surface_id, {}) as Dictionary
	if surface.is_empty():
		return {}
	var synthesis := (surface.get("synthesis", {}) as Dictionary).duplicate(true)
	var role_scale := 0.78 if role == ROLE_INFECTED else 1.0
	var side_scale := 0.97 if foot_side == "left" else 1.03
	for key: String in ["baseFrequencyHz", "secondaryFrequencyHz", "textureFrequencyHz"]:
		synthesis[key] = float(synthesis.get(key, 100.0)) * role_scale * side_scale
	if role == ROLE_INFECTED:
		synthesis["gain"] = float(synthesis.get("gain", 0.2)) * 1.16
	return {
		"cueId": String(surface.get("infectedCueId" if role == ROLE_INFECTED else "survivorCueId", "")),
		"surfaceId": surface_id,
		"role": role,
		"footSide": foot_side,
		"synthesis": synthesis,
	}


func ambience_profile(state_id: String) -> Dictionary:
	var resolved_state := state_id if _ambience_states.has(state_id) else AMBIENCE_ROUTE
	return (_ambience_states.get(resolved_state, {}) as Dictionary).duplicate(true)


func reset_ambience(state_id: String = AMBIENCE_ROUTE) -> Dictionary:
	var profile := ambience_profile(state_id)
	_ambience_values = (profile.get("synthesis", {}) as Dictionary).duplicate(true)
	return _compose_ambience_result(profile)


func advance_ambience(delta: float, state_id: String) -> Dictionary:
	var profile := ambience_profile(state_id)
	var target := profile.get("synthesis", {}) as Dictionary
	if _ambience_values.is_empty():
		_ambience_values = target.duplicate(true)
	var blend := 1.0 - exp(-maxf(delta, 0.0) * 1.35)
	for key: String in ["lowFrequencyHz", "highFrequencyHz", "pulseFrequencyHz", "gain"]:
		_ambience_values[key] = lerpf(
			float(_ambience_values.get(key, target.get(key, 0.0))),
			float(target.get(key, 0.0)),
			blend,
		)
	return _compose_ambience_result(profile)


func narration_for_event(event_id: String) -> Dictionary:
	return (_narration_cues.get(event_id, {}) as Dictionary).duplicate(true)


func _compose_ambience_result(profile: Dictionary) -> Dictionary:
	var result := _ambience_values.duplicate(true)
	result["state"] = String(profile.get("id", AMBIENCE_ROUTE))
	result["cueId"] = String(profile.get("cueId", ""))
	return result


func _clear() -> void:
	_default_surface_id = ""
	_beacon_cue_id = ""
	_surfaces.clear()
	_zones.clear()
	_ambience_states.clear()
	_narration_cues.clear()
	_ambience_values.clear()
