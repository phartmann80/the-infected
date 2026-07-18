extends SceneTree

const ITEM_CATALOG_PATH := "res://data/item_catalog.v1.json"
const ItemCatalogScript := preload("res://scripts/item_catalog.gd")
const PrototypeWeaponStateScript := preload("res://scripts/prototype_weapon_state.gd")


func _initialize() -> void:
	var catalog := ItemCatalogScript.new()
	if not catalog.load_from_path(ITEM_CATALOG_PATH):
		_fail("Catalog failed to load: %s" % catalog.error_message)
		return
	var warden := catalog.item_by_id("weapon.warden9")
	var weapon_state := PrototypeWeaponStateScript.new()
	if not weapon_state.initialize(warden, 6):
		_fail("Warden-9 prototype state failed to initialize.")
		return
	if weapon_state.magazine_capacity() != 15 or weapon_state.magazine_ammo() != 15 or weapon_state.reserve_ammo() != 6:
		_fail("Initial magazine and reserve ammunition do not match the catalog-backed prototype contract.")
		return
	if weapon_state.switch_mode() != PrototypeWeaponStateScript.MODE_MELEE:
		_fail("Weapon switching did not activate melee mode.")
		return
	if String(weapon_state.try_fire().get("reason", "")) != "inactive":
		_fail("Fire was not blocked while melee mode was active.")
		return
	if weapon_state.switch_mode() != PrototypeWeaponStateScript.MODE_FIREARM:
		_fail("Weapon switching did not restore firearm mode.")
		return
	var first_shot := weapon_state.try_fire()
	if not bool(first_shot.get("fired", false)) or int(first_shot.get("damage", 0)) != 38:
		_fail("Catalog-backed firing did not produce the reviewed Warden-9 prototype damage.")
		return
	if weapon_state.magazine_ammo() != 14 or weapon_state.reserve_ammo() != 6:
		_fail("Firing did not consume exactly one magazine round.")
		return
	weapon_state.advance(1.0)
	for shot_index in range(14):
		if not bool(weapon_state.try_fire().get("fired", false)):
			_fail("Magazine could not fire round %d." % (shot_index + 2))
			return
		weapon_state.advance(1.0)
	if String(weapon_state.try_fire().get("reason", "")) != "empty":
		_fail("An empty magazine did not block firing.")
		return
	var reload := weapon_state.begin_reload()
	if not bool(reload.get("started", false)):
		_fail("Reload did not start with reserve ammunition available.")
		return
	if bool(weapon_state.advance(weapon_state.reload_duration() - 0.01).get("reload_completed", false)):
		_fail("Reload completed before its catalog-backed duration elapsed.")
		return
	var completed_reload := weapon_state.advance(0.02)
	if not bool(completed_reload.get("reload_completed", false)) or weapon_state.magazine_ammo() != 6 or weapon_state.reserve_ammo() != 0:
		_fail("Reload did not transfer reserve ammunition into the magazine.")
		return
	weapon_state.add_reserve(4)
	if not bool(weapon_state.try_fire().get("fired", false)):
		_fail("Weapon did not fire after reload.")
		return
	weapon_state.advance(1.0)
	if not bool(weapon_state.begin_reload().get("started", false)):
		_fail("Second reload did not start.")
		return
	weapon_state.advance(weapon_state.reload_duration() + 0.01)
	if weapon_state.magazine_ammo() != 9 or weapon_state.reserve_ammo() != 0:
		_fail("Partial reserve reload produced the wrong ammunition totals.")
		return
	weapon_state.switch_mode()
	var saved_state := weapon_state.to_save_data()
	var restored := PrototypeWeaponStateScript.new()
	if not restored.initialize(warden, 99, saved_state):
		_fail("Saved weapon state failed to restore.")
		return
	if restored.active_mode() != PrototypeWeaponStateScript.MODE_MELEE or restored.magazine_ammo() != 9 or restored.reserve_ammo() != 0:
		_fail("Saved weapon mode or ammunition did not restore exactly.")
		return
	var raven := catalog.item_by_id("weapon.raven12")
	if not restored.equip(raven, 3) or restored.weapon_id() != "weapon.raven12" or restored.magazine_capacity() != 6:
		_fail("Equipping an existing catalog weapon did not refresh local weapon state.")
		return
	if restored.magazine_ammo() != 6 or restored.reserve_ammo() != 6:
		_fail("Equipping a catalog weapon duplicated or discarded carried prototype ammunition.")
		return
	var rejected_item := raven.duplicate(true)
	rejected_item["canonical"] = true
	if PrototypeWeaponStateScript.new().initialize(rejected_item, 3):
		_fail("Weapon state accepted an item outside the approved prototype boundary.")
		return
	var local_state_text := JSON.stringify(saved_state).to_lower()
	for forbidden_term: String in ["ownership", "purchase", "entitlement", "price", "provider"]:
		if local_state_text.contains(forbidden_term):
			_fail("Local weapon state leaked commerce data: %s" % forbidden_term)
			return
	print("Android weapon interaction test passed: switch, fire, cooldown, magazine, reserve, reload, equip, save, and restore.")
	quit(0)


func _fail(message: String) -> void:
	push_error(message)
	quit(1)
