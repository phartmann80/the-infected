class_name PrototypeLoadout
extends RefCounted

const SCHEMA_VERSION := 1
const DEFAULT_WEAPON_ID := "weapon.warden9"
const DEFAULT_GEAR_ID := "gear.fieldpack45"

var _equipped: Dictionary = {}


func initialize(catalog) -> void:
	_equipped = {
		"weapon": DEFAULT_WEAPON_ID if catalog.has_item(DEFAULT_WEAPON_ID) else "",
		"gear": DEFAULT_GEAR_ID if catalog.has_item(DEFAULT_GEAR_ID) else "",
	}


func equip(item_id: String, catalog) -> bool:
	var item: Dictionary = catalog.item_by_id(item_id)
	if item.is_empty():
		return false
	var category := String(item.get("category", ""))
	if category != "weapon" and category != "gear":
		return false
	if String(item.get("status", "")) != "prototype" or bool(item.get("canonical", true)):
		return false
	_equipped[category] = item_id
	return true


func restore(saved: Variant, catalog) -> void:
	initialize(catalog)
	if typeof(saved) != TYPE_DICTIONARY:
		return
	var saved_state: Dictionary = saved
	if int(saved_state.get("schema_version", 0)) != SCHEMA_VERSION:
		return
	var saved_equipped: Variant = saved_state.get("equipped", {})
	if typeof(saved_equipped) != TYPE_DICTIONARY:
		return
	for category: String in ["weapon", "gear"]:
		var item_id := String(saved_equipped.get(category, ""))
		if not item_id.is_empty():
			equip(item_id, catalog)


func equipped_item_id(category: String) -> String:
	return String(_equipped.get(category, ""))


func equipped_item_name(category: String, catalog) -> String:
	var item: Dictionary = catalog.item_by_id(equipped_item_id(category))
	return String(item.get("name", "None"))


func is_equipped(item_id: String) -> bool:
	return _equipped.values().has(item_id)


func to_save_data() -> Dictionary:
	return {
		"schema_version": SCHEMA_VERSION,
		"equipped": _equipped.duplicate(true),
	}
