class_name PrototypeFieldInventory
extends RefCounted

const SCHEMA_VERSION := 1
const STARTER_ITEM_IDS := ["weapon.warden9", "gear.fieldpack45"]

var _carried_item_ids: Dictionary = {}


func initialize(catalog) -> void:
	_carried_item_ids.clear()
	for item_id: String in STARTER_ITEM_IDS:
		collect(item_id, catalog)


func collect(item_id: String, catalog) -> bool:
	if _carried_item_ids.has(item_id):
		return false
	var item: Dictionary = catalog.item_by_id(item_id)
	if item.is_empty():
		return false
	var category := String(item.get("category", ""))
	if category != "weapon" and category != "gear":
		return false
	if String(item.get("status", "")) != "prototype" or bool(item.get("canonical", true)):
		return false
	_carried_item_ids[item_id] = true
	return true


func restore(saved: Variant, catalog) -> void:
	initialize(catalog)
	if typeof(saved) != TYPE_DICTIONARY:
		return
	var saved_state: Dictionary = saved
	if int(saved_state.get("schema_version", 0)) != SCHEMA_VERSION:
		return
	var saved_ids: Variant = saved_state.get("carried_item_ids", [])
	if typeof(saved_ids) != TYPE_ARRAY:
		return
	for item_id: Variant in saved_ids:
		collect(String(item_id), catalog)


func has_item(item_id: String) -> bool:
	return _carried_item_ids.has(item_id)


func item_ids() -> Array[String]:
	var result: Array[String] = []
	for item_id: Variant in _carried_item_ids.keys():
		result.append(String(item_id))
	result.sort()
	return result


func count_for_category(category: String, catalog) -> int:
	var count := 0
	for item_id: String in item_ids():
		if String(catalog.item_by_id(item_id).get("category", "")) == category:
			count += 1
	return count


func to_save_data() -> Dictionary:
	return {
		"schema_version": SCHEMA_VERSION,
		"carried_item_ids": item_ids(),
	}
