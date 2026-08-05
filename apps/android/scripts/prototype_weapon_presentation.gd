class_name PrototypeWeaponPresentation
extends RefCounted


static func from_item(item: Dictionary) -> Dictionary:
	if item.is_empty() or String(item.get("category", "")) != "weapon":
		return {}

	var sub_category := String(item.get("subCategory", "unknown"))
	var profile := "carbine"
	var size := Vector3(0.18, 0.20, 0.92)
	match sub_category:
		"pistol", "revolver":
			profile = "sidearm"
			size = Vector3(0.18, 0.20, 0.56)
		"shotgun", "bolt-action-rifle", "marksman-rifle":
			profile = "long-gun"
			size = Vector3(0.18, 0.19, 1.18)
		"submachine-gun":
			profile = "compact"
			size = Vector3(0.20, 0.22, 0.72)
		"compact-carbine":
			profile = "compact-carbine"
			size = Vector3(0.18, 0.20, 0.82)

	return {
		"item_id": String(item.get("id", "")),
		"name": String(item.get("name", "Prototype weapon")),
		"profile": profile,
		"size": size,
		"position": Vector3(-0.42, 0.18, -0.38 if profile == "sidearm" else -0.48),
		"rotation_degrees": Vector3(0.0, 18.0, -18.0),
		"color": _rarity_color(String(item.get("rarity", "common"))),
	}


static func _rarity_color(rarity: String) -> Color:
	match rarity:
		"uncommon":
			return Color("718a71")
		"rare":
			return Color("647f9c")
		"epic":
			return Color("806c91")
		_:
			return Color("78858b")
