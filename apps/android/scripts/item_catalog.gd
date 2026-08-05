class_name PrototypeItemCatalog
extends RefCounted

const SCHEMA_VERSION := 1
const EXPECTED_WEAPON_COUNT := 10
const EXPECTED_GEAR_COUNT := 20

var _catalog: Dictionary = {}
var _items_by_id: Dictionary = {}
var _items_by_category: Dictionary = {"weapon": [], "gear": []}
var error_message := ""


func load_from_path(path: String) -> bool:
	_catalog.clear()
	_items_by_id.clear()
	_items_by_category = {"weapon": [], "gear": []}
	error_message = ""

	if not FileAccess.file_exists(path):
		return _fail("Missing item catalog: %s" % path)

	var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(path))
	if typeof(parsed) != TYPE_DICTIONARY:
		return _fail("Item catalog is not a JSON object.")

	var source: Dictionary = parsed
	if int(source.get("schemaVersion", 0)) != SCHEMA_VERSION:
		return _fail("Unsupported item catalog schema version.")
	if String(source.get("status", "")) != "prototype" or bool(source.get("canonical", true)):
		return _fail("Android prototype accepts only non-canonical prototype item catalogs.")

	var raw_items: Variant = source.get("items", [])
	if typeof(raw_items) != TYPE_ARRAY:
		return _fail("Item catalog items must be an array.")

	for raw_item: Variant in raw_items:
		if typeof(raw_item) != TYPE_DICTIONARY:
			return _fail("Item catalog contains a non-object item.")
		var item: Dictionary = raw_item
		var item_id := String(item.get("id", ""))
		var category := String(item.get("category", ""))
		if item_id.is_empty() or _items_by_id.has(item_id):
			return _fail("Item catalog contains a missing or duplicate item ID.")
		if not _items_by_category.has(category):
			return _fail("Unsupported Android prototype item category: %s" % category)
		if String(item.get("status", "")) != "prototype" or bool(item.get("canonical", true)):
			return _fail("Android prototype item %s is not marked as a prototype." % item_id)

		var frozen_item := item.duplicate(true)
		_items_by_id[item_id] = frozen_item
		_items_by_category[category].append(frozen_item)

	if _items_by_category["weapon"].size() != EXPECTED_WEAPON_COUNT:
		return _fail("Android prototype requires exactly %d weapon concepts." % EXPECTED_WEAPON_COUNT)
	if _items_by_category["gear"].size() != EXPECTED_GEAR_COUNT:
		return _fail("Android prototype requires exactly %d gear concepts." % EXPECTED_GEAR_COUNT)

	_catalog = source.duplicate(true)
	return true


func is_loaded() -> bool:
	return not _catalog.is_empty()


func content_version() -> String:
	return String(_catalog.get("contentVersion", "unknown"))


func item_count() -> int:
	return _items_by_id.size()


func items_for_category(category: String) -> Array:
	var result: Array = []
	for item: Dictionary in _items_by_category.get(category, []):
		result.append(item.duplicate(true))
	return result


func item_by_id(item_id: String) -> Dictionary:
	var item: Variant = _items_by_id.get(item_id, {})
	if typeof(item) != TYPE_DICTIONARY:
		return {}
	return (item as Dictionary).duplicate(true)


func has_item(item_id: String) -> bool:
	return _items_by_id.has(item_id)


func _fail(message: String) -> bool:
	error_message = message
	push_error(message)
	return false
