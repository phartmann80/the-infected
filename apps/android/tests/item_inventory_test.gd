extends SceneTree

const ITEM_CATALOG_PATH := "res://data/item_catalog.v1.json"
const TEST_SAVE_PATH := "user://item_inventory_contract_test.json"
const ItemCatalogScript := preload("res://scripts/item_catalog.gd")
const PrototypeLoadoutScript := preload("res://scripts/prototype_loadout.gd")
const WeaponPresentationScript := preload("res://scripts/prototype_weapon_presentation.gd")


func _initialize() -> void:
	var catalog := ItemCatalogScript.new()
	if not catalog.load_from_path(ITEM_CATALOG_PATH):
		_fail("Catalog failed to load: %s" % catalog.error_message)
		return
	if catalog.item_count() != 30:
		_fail("Catalog did not expose exactly 30 prototype items.")
		return
	if catalog.items_for_category("weapon").size() != 10 or catalog.items_for_category("gear").size() != 20:
		_fail("Catalog category counts do not match the approved milestone.")
		return
	var detached_item := catalog.item_by_id("weapon.raven12")
	detached_item["name"] = "mutated test copy"
	if String(catalog.item_by_id("weapon.raven12").get("name", "")) != "Raven-12 Tactical Shotgun":
		_fail("Catalog callers can mutate the read-only source data.")
		return
	var presentation_profiles: Dictionary = {}
	for weapon: Dictionary in catalog.items_for_category("weapon"):
		var presentation := WeaponPresentationScript.from_item(weapon)
		if String(presentation.get("item_id", "")) != String(weapon.get("id", "")):
			_fail("Weapon presentation did not preserve the catalog item ID.")
			return
		var size: Vector3 = presentation.get("size", Vector3.ZERO)
		if size.x <= 0.0 or size.y <= 0.0 or size.z <= 0.0:
			_fail("Weapon presentation produced invalid primitive dimensions.")
			return
		presentation_profiles[String(presentation.get("profile", ""))] = true
	if presentation_profiles.size() < 4:
		_fail("Weapon presentation does not distinguish enough catalog sub-category profiles.")
		return

	var loadout := PrototypeLoadoutScript.new()
	loadout.initialize(catalog)
	if not loadout.equip("weapon.raven12", catalog):
		_fail("Prototype weapon equip failed.")
		return
	if not loadout.equip("gear.bastion-vest", catalog):
		_fail("Prototype gear equip failed.")
		return

	var file := FileAccess.open(TEST_SAVE_PATH, FileAccess.WRITE)
	if file == null:
		_fail("Could not create local inventory test save.")
		return
	file.store_string(JSON.stringify(loadout.to_save_data()))
	file.close()

	var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(TEST_SAVE_PATH))
	var restored := PrototypeLoadoutScript.new()
	restored.restore(parsed, catalog)
	if restored.equipped_item_id("weapon") != "weapon.raven12":
		_fail("Saved weapon equip state did not restore.")
		return
	if restored.equipped_item_id("gear") != "gear.bastion-vest":
		_fail("Saved gear equip state did not restore.")
		return
	var rejected := PrototypeLoadoutScript.new()
	rejected.restore({"schema_version": 1, "equipped": {"weapon": "weapon.unknown", "gear": "gear.unknown"}}, catalog)
	if rejected.equipped_item_id("weapon") != "weapon.warden9" or rejected.equipped_item_id("gear") != "gear.fieldpack45":
		_fail("Invalid saved item IDs did not fall back to prototype defaults.")
		return
	var local_save_text := JSON.stringify(loadout.to_save_data()).to_lower()
	for forbidden_term: String in ["ownership", "purchase", "entitlement", "price", "provider"]:
		if local_save_text.contains(forbidden_term):
			_fail("Local loadout save leaked commerce state: %s" % forbidden_term)
			return

	DirAccess.remove_absolute(ProjectSettings.globalize_path(TEST_SAVE_PATH))
	print("Android item inventory test passed: 10 weapons, 20 gear items, local equip, save, restore, and in-hand presentation mapping.")
	quit(0)


func _fail(message: String) -> void:
	push_error(message)
	DirAccess.remove_absolute(ProjectSettings.globalize_path(TEST_SAVE_PATH))
	quit(1)
