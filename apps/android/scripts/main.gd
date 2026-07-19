extends Node3D

const ItemCatalogScript := preload("res://scripts/item_catalog.gd")
const PrototypeLoadoutScript := preload("res://scripts/prototype_loadout.gd")
const WeaponPresentationScript := preload("res://scripts/prototype_weapon_presentation.gd")
const PrototypeWeaponStateScript := preload("res://scripts/prototype_weapon_state.gd")
const PrototypeInfectedBrainScript := preload("res://scripts/prototype_infected_brain.gd")
const PrototypeCombatMotionScript := preload("res://scripts/prototype_combat_motion.gd")
const PrototypeCombatFeedbackScript := preload("res://scripts/prototype_combat_feedback.gd")
const PrototypeTouchInputScript := preload("res://scripts/prototype_touch_input.gd")
const PrototypeActorAnimationScript := preload("res://scripts/prototype_actor_animation.gd")
const DATA_PATH := "res://data/game_foundation.json"
const ITEM_CATALOG_PATH := "res://data/item_catalog.v1.json"
const SAVE_PATH := "user://save_v1.json"
const SAVE_SCHEMA_VERSION := 6
const MIN_SUPPORTED_SAVE_SCHEMA := 1
const PLAYER_SPEED := 3.0
const PLAYER_ACCELERATION := 26.0
const PLAYER_DECELERATION := 34.0
const PLAYER_TURN_RESPONSE := 14.0
const INFECTED_SPEED := 1.15
const INFECTED_ATTACK_DAMAGE := 10
const ATTACK_RANGE := 2.4
const ATTACK_DAMAGE := 25
const ATTACK_SWING_DURATION := 0.22
const HIT_FLASH_DURATION := 0.16
const INFECTED_KNOCKBACK_SPEED := 4.0
const INFECTED_KNOCKBACK_DURATION := 0.2
const INFECTED_KNOCKBACK_DECELERATION := 18.0
const STARTING_HEALTH := 100
const MEDKIT_HEAL := 40
const CAMERA_SMOOTHING := 9.0
const CAMERA_LOOK_AHEAD := 0.16
const CAMERA_TURN_SPEED := 1.45
const FIRE_BUFFER_WINDOW := 0.12
const TOUCH_LOOK_YAW_SCALE := 2.2
const MOUSE_TOUCH_POINTER_ID := 10000
const SIGNAL_BEACON_REACH := 2.2
const INFECTED_COLOR := Color("8b9b73")

var game_data: Dictionary = {}
var item_catalog = ItemCatalogScript.new()
var prototype_loadout = PrototypeLoadoutScript.new()
var prototype_weapon_state = PrototypeWeaponStateScript.new()
var prototype_infected_brain = PrototypeInfectedBrainScript.new()
var prototype_combat_motion = PrototypeCombatMotionScript.new()
var prototype_combat_feedback = PrototypeCombatFeedbackScript.new()
var prototype_touch_input = PrototypeTouchInputScript.new()
var prototype_player_animation = PrototypeActorAnimationScript.new(PrototypeActorAnimationScript.ROLE_SURVIVOR)
var prototype_infected_animation = PrototypeActorAnimationScript.new(PrototypeActorAnimationScript.ROLE_INFECTED)
var player: CharacterBody3D
var infected: CharacterBody3D
var camera: Camera3D
var health := STARTING_HEALTH
var infected_health := 100
var attack_cooldown := 0.0
var fire_buffer_timer := 0.0
var save_timer := 0.0
var camera_yaw := 0.0
var attack_was_down := false
var fire_was_down := false
var switch_was_down := false
var reload_was_down := false
var medkit_was_down := false
var restart_was_down := false
var save_was_down := false
var load_was_down := false
var pause_was_down := false
var inventory_was_down := false
var beacon_reached := false
var run_complete := false
var run_failed := false
var is_paused := false
var inventory_screen_open := false
var infected_knockback_timer := 0.0
var infected_knockback_velocity := Vector3.ZERO
var held_actions: Dictionary = {}
var inventory: Dictionary = {"scrap": 0, "medkits": 1, "ammo": 6}
var pickups: Array[Node3D] = []
var status_label: Label
var health_label: Label
var inventory_label: Label
var threat_label: Label
var feedback_label: Label
var combat_status_label: Label
var hit_marker_label: Label
var damage_overlay: ColorRect
var movement_pad: Control
var movement_thumb: Control
var look_pad: Control
var health_bar: ProgressBar
var infected_bar: ProgressBar
var player_weapon: MeshInstance3D
var player_sidearm: MeshInstance3D
var muzzle_flash: MeshInstance3D
var muzzle_light: OmniLight3D
var prototype_audio_player: AudioStreamPlayer
var prototype_feedback_audio_player: AudioStreamPlayer
var prototype_foley_audio_player: AudioStreamPlayer
var prototype_infected_foley_audio_player: AudioStreamPlayer
var infected_material: StandardMaterial3D
var infected_telegraph: MeshInstance3D
var hit_flash_timer := 0.0
var muzzle_flash_timer := 0.0
var camera_kick := 0.0
var infected_reaction_timer := 0.0
var infected_reaction_duration := HIT_FLASH_DURATION
var player_sidearm_rest_position := Vector3.ZERO
var player_sidearm_rest_rotation := Vector3.ZERO
var player_melee_rest_rotation := Vector3(0.0, -25.0, 35.0)
var signal_beacon: Node3D
var signal_light: OmniLight3D
var environment_root: Node3D
var salvage_drop: Node3D
var salvage_drop_collected := false
var salvage_drop_position := Vector3.ZERO
var environment_time := 0.0
var pause_panel: PanelContainer
var pause_resume_button: Button
var defeat_panel: PanelContainer
var inventory_panel: PanelContainer
var inventory_item_list: ItemList
var inventory_detail_label: Label
var inventory_equip_button: Button
var inventory_category_label: Label
var inventory_category := "weapon"
var inventory_selected_item_id := ""
var player_rig: Dictionary = {}
var infected_rig: Dictionary = {}


func _ready() -> void:
	_load_game_data()
	_load_item_catalog()
	prototype_loadout.initialize(item_catalog)
	prototype_weapon_state.initialize(_equipped_weapon_item(), int(inventory.get("ammo", 0)))
	_build_world()
	_load_save()
	_apply_equipped_weapon_presentation()
	_build_touch_controls()
	_update_hud()


func _input(event: InputEvent) -> void:
	if movement_pad == null or look_pad == null:
		return
	var handled := false
	if event is InputEventScreenTouch:
		if not event.pressed:
			handled = prototype_touch_input.end_pointer(event.index)
		else:
			handled = _begin_touch_pointer(event.index, event.position)
	elif event is InputEventScreenDrag:
		if event.index == prototype_touch_input.movement_pointer_id():
			handled = prototype_touch_input.update_movement(
				event.index,
				_to_control_position(movement_pad, event.position),
				movement_pad.size * 0.5,
				_movement_pad_radius(),
			)
		elif event.index == prototype_touch_input.look_pointer_id():
			handled = prototype_touch_input.update_look(event.index, event.relative, look_pad.size.x)
	elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if event.pressed:
			handled = _begin_touch_pointer(MOUSE_TOUCH_POINTER_ID, event.position)
		else:
			handled = prototype_touch_input.end_pointer(MOUSE_TOUCH_POINTER_ID)
	elif event is InputEventMouseMotion and event.button_mask & MOUSE_BUTTON_MASK_LEFT:
		if prototype_touch_input.movement_pointer_id() == MOUSE_TOUCH_POINTER_ID:
			handled = prototype_touch_input.update_movement(
				MOUSE_TOUCH_POINTER_ID,
				_to_control_position(movement_pad, event.position),
				movement_pad.size * 0.5,
				_movement_pad_radius(),
			)
		elif prototype_touch_input.look_pointer_id() == MOUSE_TOUCH_POINTER_ID:
			handled = prototype_touch_input.update_look(MOUSE_TOUCH_POINTER_ID, event.relative, look_pad.size.x)
	if handled:
		_update_touch_pad_visuals()
		get_viewport().set_input_as_handled()


func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_FOCUS_OUT or what == NOTIFICATION_WM_WINDOW_FOCUS_OUT:
		held_actions.clear()
		_reset_touch_controls()


func _begin_touch_pointer(pointer_id: int, screen_position: Vector2) -> bool:
	if is_paused or inventory_screen_open or run_failed or run_complete:
		return false
	if movement_pad.get_global_rect().has_point(screen_position):
		return prototype_touch_input.begin_movement(
			pointer_id,
			_to_control_position(movement_pad, screen_position),
			movement_pad.size * 0.5,
			_movement_pad_radius(),
		)
	if look_pad.get_global_rect().has_point(screen_position):
		return prototype_touch_input.begin_look(pointer_id)
	return false


func _to_control_position(control: Control, screen_position: Vector2) -> Vector2:
	return control.get_global_transform_with_canvas().affine_inverse() * screen_position


func _movement_pad_radius() -> float:
	return maxf(minf(movement_pad.size.x, movement_pad.size.y) * 0.34, 1.0)


func _update_touch_pad_visuals() -> void:
	if movement_pad == null or movement_thumb == null:
		return
	var thumb_center := movement_pad.size * 0.5 + prototype_touch_input.movement_vector() * _movement_pad_radius()
	movement_thumb.position = thumb_center - movement_thumb.size * 0.5


func _reset_touch_controls() -> void:
	prototype_touch_input.reset()
	_update_touch_pad_visuals()


func _physics_process(delta: float) -> void:
	if player == null:
		return
	_handle_inventory_input()
	if inventory_screen_open:
		_update_hud()
		return
	if not run_failed:
		_handle_pause_input()
	if is_paused:
		_update_hud()
		return
	if run_failed:
		_handle_save_load_input()
		_handle_restart_input()
		_update_hud()
		return
	if run_complete:
		_handle_save_load_input()
		_handle_restart_input()
		_update_hud()
		return

	var movement := _movement_input()
	var direction := Vector3(movement.x, 0.0, movement.y).rotated(Vector3.UP, camera_yaw)
	var target_velocity := direction * PLAYER_SPEED
	var movement_response := PLAYER_ACCELERATION if direction.length_squared() > 0.001 else PLAYER_DECELERATION
	player.velocity = player.velocity.move_toward(target_velocity, movement_response * delta)
	player.move_and_slide()
	if direction.length_squared() > 0.001:
		var target_yaw := atan2(-direction.x, -direction.z)
		var turn_weight := 1.0 - exp(-PLAYER_TURN_RESPONSE * delta)
		player.rotation.y = lerp_angle(player.rotation.y, target_yaw, turn_weight)

	if infected != null:
		_move_infected(delta)
	_collect_pickups()
	_update_weapon_state(delta)
	_handle_weapon_switch_input()
	_handle_attack_input()
	_handle_fire_input()
	_handle_reload_input()
	_handle_medkit_input()
	_handle_save_load_input()
	_handle_restart_input()
	_update_camera(delta)
	_update_combat_feedback(delta)
	_update_actor_animation(delta)
	_update_environment(delta)
	_update_objective()

	attack_cooldown = maxf(attack_cooldown - delta, 0.0)
	save_timer += delta
	if save_timer >= 2.0:
		_save_game()
		save_timer = 0.0
	_update_hud()


func _load_game_data() -> void:
	if not FileAccess.file_exists(DATA_PATH):
		push_error("Missing shared game data: %s" % DATA_PATH)
		return
	var parsed = JSON.parse_string(FileAccess.get_file_as_string(DATA_PATH))
	if typeof(parsed) != TYPE_DICTIONARY:
		push_error("Shared game data is not a JSON object.")
		return
	game_data = parsed


func _load_item_catalog() -> void:
	if not item_catalog.load_from_path(ITEM_CATALOG_PATH):
		push_error("Prototype item catalog unavailable: %s" % item_catalog.error_message)


func _build_world() -> void:
	environment_root = Node3D.new()
	environment_root.name = String(game_data.get("environment_id", "environment-001-review"))
	add_child(environment_root)
	_build_box(environment_root, Vector3(0.0, -0.15, 0.0), Vector3(24.0, 0.3, 24.0), Color("24313a"))
	_build_box(environment_root, Vector3(-5.0, 1.0, -3.0), Vector3(2.0, 2.0, 2.0), Color("45515a"))
	_build_box(environment_root, Vector3(5.0, 0.75, 1.0), Vector3(3.0, 1.5, 1.5), Color("5b4740"))
	_build_checkpoint(environment_root)
	_build_vehicle(environment_root, Vector3(-6.5, 0.0, -2.0), 0.28)
	_build_signal_beacon(environment_root)
	_build_pickup(environment_root, "scrap", 2, Vector3(-3.0, 0.35, 1.0), Color("c08a4b"))
	_build_pickup(environment_root, "ammo", 2, Vector3(3.5, 0.35, -1.5), Color("8ea6b7"))

	var light := DirectionalLight3D.new()
	light.rotation_degrees = Vector3(-55.0, -25.0, 0.0)
	light.light_energy = 1.4
	add_child(light)

	var world_environment := WorldEnvironment.new()
	var environment := Environment.new()
	environment.background_mode = Environment.BG_COLOR
	environment.background_color = Color("071017")
	environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	environment.ambient_light_color = Color("78909c")
	environment.ambient_light_energy = 0.45
	environment.fog_enabled = true
	environment.fog_light_color = Color("172028")
	environment.fog_density = 0.012
	world_environment.environment = environment
	add_child(world_environment)

	player = _build_actor(
		String(game_data.get("player_id", "survivor-001-review")),
		Vector3(0.0, 1.0, 4.0),
		Color("d79a67"),
		false,
	)
	infected = _build_actor(
		String(game_data.get("infected_id", "infected-001-review")),
		Vector3(0.0, 1.0, -4.0),
		Color("8b9b73"),
		true,
	)

	camera = Camera3D.new()
	camera.name = "FollowCamera"
	camera.current = true
	add_child(camera)
	_build_prototype_audio()
	_update_camera()


func _build_box(parent: Node3D, position: Vector3, size: Vector3, color: Color) -> StaticBody3D:
	var body := StaticBody3D.new()
	body.position = position
	parent.add_child(body)

	var mesh_instance := MeshInstance3D.new()
	var mesh := BoxMesh.new()
	mesh.size = size
	mesh_instance.mesh = mesh
	mesh_instance.material_override = _material(color)
	body.add_child(mesh_instance)

	var collision := CollisionShape3D.new()
	var shape := BoxShape3D.new()
	shape.size = size
	collision.shape = shape
	body.add_child(collision)
	return body


func _build_checkpoint(parent: Node3D) -> void:
	var checkpoint := Node3D.new()
	checkpoint.name = "Checkpoint_001_Review"
	checkpoint.position = Vector3(0.0, 0.0, -7.0)
	parent.add_child(checkpoint)
	_build_box(checkpoint, Vector3(-3.0, 1.3, 0.0), Vector3(0.35, 2.6, 0.35), Color("47545a"))
	_build_box(checkpoint, Vector3(3.0, 1.3, 0.0), Vector3(0.35, 2.6, 0.35), Color("47545a"))
	_build_box(checkpoint, Vector3(0.0, 2.45, 0.0), Vector3(6.35, 0.3, 0.35), Color("293238"))
	_build_box(checkpoint, Vector3(0.0, 0.85, 0.0), Vector3(5.8, 0.18, 0.22), Color("c65c3c"))
	_build_box(checkpoint, Vector3(-1.9, 1.45, 0.0), Vector3(0.12, 1.0, 0.12), Color("d6a056"))
	_build_box(checkpoint, Vector3(1.9, 1.45, 0.0), Vector3(0.12, 1.0, 0.12), Color("d6a056"))

	var warning_light := OmniLight3D.new()
	warning_light.position = Vector3(0.0, 2.0, 0.35)
	warning_light.light_color = Color("f26742")
	warning_light.light_energy = 1.4
	warning_light.omni_range = 5.0
	warning_light.shadow_enabled = false
	checkpoint.add_child(warning_light)


func _build_vehicle(parent: Node3D, position: Vector3, yaw: float) -> void:
	var vehicle := Node3D.new()
	vehicle.name = "AbandonedVehicle_001_Review"
	vehicle.position = position
	vehicle.rotation.y = yaw
	parent.add_child(vehicle)
	_build_box(vehicle, Vector3(0.0, 0.75, 0.0), Vector3(3.2, 0.9, 1.5), Color("343c42"))
	_build_box(vehicle, Vector3(-0.25, 1.4, 0.0), Vector3(1.7, 0.55, 1.25), Color("2a3238"))
	for wheel_position in [Vector3(-1.05, 0.42, -0.82), Vector3(1.05, 0.42, -0.82), Vector3(-1.05, 0.42, 0.82), Vector3(1.05, 0.42, 0.82)]:
		var wheel := MeshInstance3D.new()
		var wheel_mesh := CylinderMesh.new()
		wheel_mesh.height = 0.22
		wheel_mesh.top_radius = 0.38
		wheel_mesh.bottom_radius = 0.38
		wheel_mesh.radial_segments = 12
		wheel.mesh = wheel_mesh
		wheel.material_override = _material(Color("111518"))
		wheel.position = wheel_position
		wheel.rotation_degrees = Vector3(90.0, 0.0, 0.0)
		vehicle.add_child(wheel)


func _build_signal_beacon(parent: Node3D) -> void:
	signal_beacon = Node3D.new()
	signal_beacon.name = "SignalBeacon_001_Review"
	signal_beacon.position = Vector3(0.0, 0.0, -9.0)
	parent.add_child(signal_beacon)
	_build_box(signal_beacon, Vector3(0.0, 0.35, 0.0), Vector3(0.85, 0.7, 0.85), Color("3a4144"))
	_build_box(signal_beacon, Vector3(0.0, 1.35, 0.0), Vector3(0.18, 1.4, 0.18), Color("59656a"))

	var beacon_mesh := MeshInstance3D.new()
	var cylinder := CylinderMesh.new()
	cylinder.height = 0.65
	cylinder.top_radius = 0.28
	cylinder.bottom_radius = 0.18
	cylinder.radial_segments = 12
	beacon_mesh.mesh = cylinder
	beacon_mesh.material_override = _material(Color("d66a46"))
	beacon_mesh.position = Vector3(0.0, 2.25, 0.0)
	signal_beacon.add_child(beacon_mesh)

	signal_light = OmniLight3D.new()
	signal_light.position = Vector3(0.0, 2.25, 0.0)
	signal_light.light_color = Color("f26742")
	signal_light.light_energy = 1.2
	signal_light.omni_range = 6.0
	signal_light.shadow_enabled = false
	signal_beacon.add_child(signal_light)


func _build_pickup(parent: Node3D, kind: String, amount: int, position: Vector3, color: Color, display_name: String = "") -> Node3D:
	var pickup := Node3D.new()
	pickup.name = display_name if display_name != "" else "Pickup_%s" % kind
	pickup.position = position
	pickup.set_meta("kind", kind)
	pickup.set_meta("amount", amount)
	pickup.set_meta("is_salvage_drop", display_name != "")
	parent.add_child(pickup)

	var mesh_instance := MeshInstance3D.new()
	var mesh := BoxMesh.new()
	mesh.size = Vector3(0.45, 0.45, 0.45)
	mesh_instance.mesh = mesh
	mesh_instance.material_override = _material(color)
	pickup.add_child(mesh_instance)
	pickups.append(pickup)
	return pickup


func _build_actor(actor_name: String, position: Vector3, color: Color, is_infected: bool) -> CharacterBody3D:
	var actor := CharacterBody3D.new()
	actor.name = actor_name
	actor.position = position
	actor.set_meta("is_infected", is_infected)
	add_child(actor)

	var rig := _build_actor_rig(actor, color, is_infected)

	var collision := CollisionShape3D.new()
	var shape := CapsuleShape3D.new()
	shape.height = 1.8
	shape.radius = 0.45
	collision.shape = shape
	actor.add_child(collision)

	if is_infected:
		infected_rig = rig
		infected_material = rig.get("material") as StandardMaterial3D
		_build_infected_telegraph(actor.global_position)
	else:
		player_rig = rig
		player_weapon = _build_weapon(actor)
		player_sidearm = _build_sidearm(actor)
	return actor


func _build_actor_rig(parent: Node3D, color: Color, is_infected: bool) -> Dictionary:
	var rig_root := Node3D.new()
	rig_root.name = "InfectedArticulatedRig" if is_infected else "SurvivorArticulatedRig"
	parent.add_child(rig_root)
	var material := _material(color)
	var torso := _build_rig_part(rig_root, "Torso", Vector3(0.0, 0.24, 0.0), Vector3(0.66, 0.78, 0.38), Vector3.ZERO, material)
	_build_rig_part(rig_root, "Pelvis", Vector3(0.0, -0.24, 0.0), Vector3(0.52, 0.28, 0.34), Vector3.ZERO, material)
	var head := _build_rig_part(rig_root, "Head", Vector3(0.0, 0.72, 0.0), Vector3(0.38, 0.42, 0.36), Vector3(0.0, 0.18, 0.0), material)
	var left_arm := _build_rig_part(rig_root, "LeftArm", Vector3(-0.43, 0.54, 0.0), Vector3(0.20, 0.72, 0.22), Vector3(0.0, -0.34, 0.0), material)
	var right_arm := _build_rig_part(rig_root, "RightArm", Vector3(0.43, 0.54, 0.0), Vector3(0.20, 0.72, 0.22), Vector3(0.0, -0.34, 0.0), material)
	var left_leg := _build_rig_part(rig_root, "LeftLeg", Vector3(-0.19, -0.28, 0.0), Vector3(0.24, 0.76, 0.28), Vector3(0.0, -0.37, 0.0), material)
	var right_leg := _build_rig_part(rig_root, "RightLeg", Vector3(0.19, -0.28, 0.0), Vector3(0.24, 0.76, 0.28), Vector3(0.0, -0.37, 0.0), material)
	if is_infected:
		rig_root.scale = Vector3(1.04, 1.06, 1.0)
		head.rotation_degrees = Vector3(5.0, -12.0, 4.0)
	return {
		"root": rig_root,
		"torso": torso,
		"head": head,
		"left_arm": left_arm,
		"right_arm": right_arm,
		"left_leg": left_leg,
		"right_leg": right_leg,
		"material": material,
	}


func _build_rig_part(parent: Node3D, part_name: String, pivot_position: Vector3, size: Vector3, mesh_offset: Vector3, material: StandardMaterial3D) -> Node3D:
	var pivot := Node3D.new()
	pivot.name = part_name
	pivot.position = pivot_position
	parent.add_child(pivot)
	var mesh_instance := MeshInstance3D.new()
	var mesh := BoxMesh.new()
	mesh.size = size
	mesh_instance.mesh = mesh
	mesh_instance.position = mesh_offset
	mesh_instance.material_override = material
	pivot.add_child(mesh_instance)
	return pivot


func _build_weapon(parent: Node3D) -> MeshInstance3D:
	var weapon := MeshInstance3D.new()
	var mesh := BoxMesh.new()
	mesh.size = Vector3(0.12, 0.12, 1.15)
	weapon.mesh = mesh
	weapon.material_override = _material(Color("c7b8a1"))
	weapon.position = Vector3(0.5, 0.2, -0.35)
	weapon.rotation_degrees = Vector3(0.0, -25.0, 35.0)
	player_melee_rest_rotation = weapon.rotation_degrees
	parent.add_child(weapon)
	return weapon


func _build_sidearm(parent: Node3D) -> MeshInstance3D:
	var sidearm := MeshInstance3D.new()
	sidearm.name = "EquippedWeaponPrototype"
	var mesh := BoxMesh.new()
	mesh.size = Vector3(0.18, 0.18, 0.58)
	sidearm.mesh = mesh
	sidearm.material_override = _material(Color("78858b"))
	sidearm.position = Vector3(-0.42, 0.18, -0.35)
	sidearm.rotation_degrees = Vector3(0.0, 18.0, -18.0)
	player_sidearm_rest_position = sidearm.position
	player_sidearm_rest_rotation = sidearm.rotation_degrees
	parent.add_child(sidearm)

	muzzle_flash = MeshInstance3D.new()
	muzzle_flash.name = "PrototypeMuzzleFlash"
	var flash_mesh := SphereMesh.new()
	flash_mesh.height = 0.18
	flash_mesh.radius = 0.09
	flash_mesh.radial_segments = 8
	flash_mesh.rings = 4
	muzzle_flash.mesh = flash_mesh
	muzzle_flash.material_override = _emissive_material(Color("ffb55f"))
	muzzle_flash.position = Vector3(0.0, 0.0, -0.42)
	muzzle_flash.visible = false
	sidearm.add_child(muzzle_flash)

	muzzle_light = OmniLight3D.new()
	muzzle_light.name = "PrototypeMuzzleLight"
	muzzle_light.position = muzzle_flash.position
	muzzle_light.light_color = Color("ff9b4a")
	muzzle_light.light_energy = 2.4
	muzzle_light.omni_range = 3.2
	muzzle_light.shadow_enabled = false
	muzzle_light.visible = false
	sidearm.add_child(muzzle_light)
	return sidearm


func _build_infected_telegraph(spawn_position: Vector3) -> void:
	if infected_telegraph != null and is_instance_valid(infected_telegraph):
		infected_telegraph.queue_free()
	infected_telegraph = MeshInstance3D.new()
	infected_telegraph.name = "InfectedAttackTelegraph"
	var disc := CylinderMesh.new()
	disc.height = 0.025
	disc.top_radius = PrototypeInfectedBrainScript.ATTACK_RESOLVE_RANGE
	disc.bottom_radius = PrototypeInfectedBrainScript.ATTACK_RESOLVE_RANGE
	disc.radial_segments = 24
	infected_telegraph.mesh = disc
	infected_telegraph.material_override = _transparent_emissive_material(Color(1.0, 0.25, 0.12, 0.24))
	infected_telegraph.position = Vector3(spawn_position.x, 0.025, spawn_position.z)
	infected_telegraph.visible = false
	add_child(infected_telegraph)


func _apply_equipped_weapon_presentation() -> void:
	if player_sidearm == null:
		return
	var item_id := prototype_loadout.equipped_item_id("weapon")
	var item := item_catalog.item_by_id(item_id)
	var presentation := WeaponPresentationScript.from_item(item)
	if presentation.is_empty():
		player_sidearm.visible = false
		return
	var mesh := BoxMesh.new()
	mesh.size = presentation.get("size", Vector3(0.18, 0.20, 0.56))
	player_sidearm.mesh = mesh
	player_sidearm_rest_position = presentation.get("position", Vector3(-0.42, 0.18, -0.38))
	player_sidearm_rest_rotation = presentation.get("rotation_degrees", Vector3(0.0, 18.0, -18.0))
	player_sidearm.position = player_sidearm_rest_position
	player_sidearm.rotation_degrees = player_sidearm_rest_rotation
	player_sidearm.material_override = _material(presentation.get("color", Color("78858b")))
	player_sidearm.set_meta("prototype_item_id", item_id)
	player_sidearm.set_meta("prototype_profile", presentation.get("profile", "unknown"))
	if muzzle_flash != null:
		muzzle_flash.position = Vector3(0.0, 0.0, -float(mesh.size.z) * 0.62)
	if muzzle_light != null:
		muzzle_light.position = muzzle_flash.position
	_apply_weapon_mode_presentation()


func _equipped_weapon_item() -> Dictionary:
	return item_catalog.item_by_id(prototype_loadout.equipped_item_id("weapon"))


func _apply_weapon_mode_presentation() -> void:
	var firearm_active := prototype_weapon_state.active_mode() == PrototypeWeaponStateScript.MODE_FIREARM
	if player_sidearm != null:
		player_sidearm.visible = firearm_active and not _equipped_weapon_item().is_empty()
	if player_weapon != null:
		player_weapon.visible = not firearm_active
	if not firearm_active:
		_set_muzzle_flash_visible(false)


func _sync_ammo_inventory() -> void:
	inventory["ammo"] = prototype_weapon_state.reserve_ammo()


func _build_prototype_audio() -> void:
	prototype_audio_player = _create_prototype_audio_player("PrototypeWeaponAudio", -9.0)
	prototype_feedback_audio_player = _create_prototype_audio_player("PrototypeCombatFeedbackAudio", -11.0)
	prototype_foley_audio_player = _create_prototype_audio_player("PrototypeSurvivorFoleyAudio", -14.0)
	prototype_infected_foley_audio_player = _create_prototype_audio_player("PrototypeInfectedFoleyAudio", -13.0)


func _create_prototype_audio_player(player_name: String, volume_db: float) -> AudioStreamPlayer:
	var player_node := AudioStreamPlayer.new()
	player_node.name = player_name
	var stream := AudioStreamGenerator.new()
	stream.mix_rate = 22050.0
	stream.buffer_length = 0.3
	player_node.stream = stream
	player_node.volume_db = volume_db
	add_child(player_node)
	return player_node


func _play_prototype_audio(action: String, layered: bool = false, foley: bool = false) -> void:
	var player_node := prototype_feedback_audio_player if layered else prototype_audio_player
	if foley:
		player_node = prototype_infected_foley_audio_player if action == "footstep_infected" else prototype_foley_audio_player
	if player_node == null:
		return
	var item := _equipped_weapon_item()
	var audio: Dictionary = item.get("audio", {})
	var audio_id := String(audio.get(action, "prototype.%s" % action))
	if foley:
		audio_id = (
			"audio.foley.infected.footstep.concrete"
			if action == "footstep_infected"
			else "audio.foley.survivor.footstep.concrete"
		)
	player_node.set_meta("catalog_audio_id", audio_id)
	player_node.stop()
	player_node.play()
	var playback := player_node.get_stream_playback() as AudioStreamGeneratorPlayback
	if playback == null:
		return
	var duration := 0.12
	match action:
		"reload":
			duration = 0.18
		"select":
			duration = 0.045
		"player_hit", "enemy_attack":
			duration = 0.16
		"enemy_alert":
			duration = 0.20
		"death":
			duration = 0.22
		"empty", "hit":
			duration = 0.08
		"footstep_survivor", "footstep_infected":
			duration = 0.075
	var frame_count := int(22050.0 * duration)
	var frames := PackedVector2Array()
	frames.resize(frame_count)
	var stats: Dictionary = item.get("stats", {})
	var damage_ratio := clampf(float(stats.get("damage", 38)) / 100.0, 0.0, 1.0)
	for index in range(frame_count):
		var time := float(index) / 22050.0
		var progress := time / duration
		var envelope := pow(1.0 - progress, 2.4)
		var sample := 0.0
		match action:
			"fire":
				var fire_base := lerpf(118.0, 72.0, damage_ratio)
				sample = (sin(TAU * fire_base * time) * 0.66 + sin(TAU * 760.0 * time) * 0.20) * envelope
			"reload":
				var click_one := maxf(0.0, 1.0 - absf(time - 0.025) * 42.0)
				var click_two := maxf(0.0, 1.0 - absf(time - 0.125) * 42.0)
				sample = sin(TAU * 420.0 * time) * (click_one + click_two) * 0.32
			"empty":
				sample = sin(TAU * 240.0 * time) * envelope * 0.24
			"select":
				sample = (sin(TAU * 920.0 * time) * 0.16 + sin(TAU * 1380.0 * time) * 0.08) * envelope
			"hit":
				sample = (sin(TAU * 1450.0 * time) * 0.25 + sin(TAU * 210.0 * time) * 0.18) * envelope
			"player_hit":
				sample = (sin(TAU * 64.0 * time) * 0.45 + sin(TAU * 118.0 * time) * 0.20) * envelope
			"enemy_attack":
				sample = sin(TAU * (78.0 + progress * 34.0) * time) * envelope * 0.38
			"enemy_alert":
				sample = (sin(TAU * (62.0 + progress * 58.0) * time) * 0.34 + sin(TAU * 188.0 * time) * 0.10) * envelope
			"death":
				sample = (sin(TAU * (105.0 - progress * 48.0) * time) * 0.45) * envelope
			"melee":
				sample = (sin(TAU * 170.0 * time) * 0.34 + sin(TAU * 520.0 * time) * 0.12) * envelope
			"footstep_survivor":
				sample = (sin(TAU * 92.0 * time) * 0.24 + sin(TAU * 176.0 * time) * 0.08) * envelope
			"footstep_infected":
				sample = (sin(TAU * 66.0 * time) * 0.30 + sin(TAU * 123.0 * time) * 0.10) * envelope
			_:
				sample = sin(TAU * 360.0 * time) * envelope * 0.20
		frames[index] = Vector2(sample, sample)
	playback.push_buffer(frames)


func _set_muzzle_flash_visible(visible: bool) -> void:
	if muzzle_flash != null:
		muzzle_flash.visible = visible
	if muzzle_light != null:
		muzzle_light.visible = visible


func _material(color: Color) -> StandardMaterial3D:
	var material := StandardMaterial3D.new()
	material.albedo_color = color
	material.roughness = 0.9
	return material


func _emissive_material(color: Color) -> StandardMaterial3D:
	var material := _material(color)
	material.emission_enabled = true
	material.emission = color
	material.emission_energy_multiplier = 3.2
	return material


func _transparent_emissive_material(color: Color) -> StandardMaterial3D:
	var material := _emissive_material(color)
	material.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	material.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	return material


func _movement_input() -> Vector2:
	var keyboard := Vector2.ZERO
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		keyboard.x -= 1.0
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		keyboard.x += 1.0
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		keyboard.y -= 1.0
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		keyboard.y += 1.0

	var touch := prototype_touch_input.movement_vector()
	return (keyboard + touch).limit_length(1.0)


func _move_infected(delta: float) -> void:
	if infected_knockback_timer > 0.0:
		infected.velocity = infected_knockback_velocity
		infected.move_and_slide()
		infected_knockback_velocity = infected_knockback_velocity.move_toward(Vector3.ZERO, INFECTED_KNOCKBACK_DECELERATION * delta)
		infected_knockback_timer = maxf(infected_knockback_timer - delta, 0.0)
		return
	var to_player := player.global_position - infected.global_position
	to_player.y = 0.0
	var distance := to_player.length()
	var decision := prototype_infected_brain.advance(delta, distance, beacon_reached)
	_handle_infected_state_change(decision)
	if bool(decision.get("attack_requested", false)):
		_resolve_infected_attack()
	var speed_scale := float(decision.get("speed_scale", 0.0))
	if speed_scale <= 0.0 or to_player.length_squared() <= 0.001:
		infected.velocity = Vector3.ZERO
		_face_infected_toward(to_player, delta, 7.0)
		return
	var pursuit_direction := to_player.normalized()
	var lateral_direction := Vector3(-pursuit_direction.z, 0.0, pursuit_direction.x)
	var steering := (pursuit_direction + lateral_direction * float(decision.get("strafe_weight", 0.0))).normalized()
	infected.velocity = steering * INFECTED_SPEED * speed_scale
	infected.move_and_slide()
	_face_infected_toward(to_player, delta, 9.0)


func _handle_infected_state_change(decision: Dictionary) -> void:
	if not bool(decision.get("state_changed", false)):
		return
	match String(decision.get("state", "")):
		PrototypeInfectedBrainScript.STATE_ALERT:
			_play_prototype_audio("enemy_alert", true)
			_set_feedback("Movement ahead. The infected has noticed you.", 1.2)
		PrototypeInfectedBrainScript.STATE_WINDUP:
			_play_prototype_audio("enemy_attack", true)
			_set_feedback("The infected is winding up. Move.", 0.9)


func _face_infected_toward(to_player: Vector3, delta: float, turn_speed: float) -> void:
	if infected == null or to_player.length_squared() <= 0.001:
		return
	var target_yaw := atan2(-to_player.x, -to_player.z)
	infected.rotation.y = lerp_angle(infected.rotation.y, target_yaw, clampf(delta * turn_speed, 0.0, 1.0))


func _resolve_infected_attack() -> void:
	if infected == null or player == null or run_failed:
		return
	var distance := player.global_position.distance_to(infected.global_position)
	if distance > PrototypeInfectedBrainScript.ATTACK_RESOLVE_RANGE:
		_set_feedback("You escaped the strike.", 0.8)
		return
	health = maxi(health - INFECTED_ATTACK_DAMAGE, 0)
	prototype_combat_feedback.register_player_damage(INFECTED_ATTACK_DAMAGE)
	_play_prototype_audio("player_hit", true)
	_set_feedback("The infected hit you.", 1.0)
	if health <= 0:
		run_failed = true
		player.velocity = Vector3.ZERO
		infected.velocity = Vector3.ZERO
		_set_feedback("You collapsed. Retry the route or load the last checkpoint.", 4.0)
	else:
		_save_game()


func _reset_infected_behavior(start_engaged: bool = false) -> void:
	prototype_infected_brain.reset(start_engaged)


func _update_combat_feedback(delta: float) -> void:
	prototype_combat_feedback.advance(delta)
	_update_combat_motion(delta)
	_update_infected_telegraph()
	_update_combat_ui()
	hit_flash_timer = maxf(hit_flash_timer - delta, 0.0)
	muzzle_flash_timer = maxf(muzzle_flash_timer - delta, 0.0)
	camera_kick = move_toward(camera_kick, 0.0, delta * 7.5)
	_set_muzzle_flash_visible(muzzle_flash_timer > 0.0 and prototype_weapon_state.active_mode() == PrototypeWeaponStateScript.MODE_FIREARM)
	infected_reaction_timer = maxf(infected_reaction_timer - delta, 0.0)
	if infected != null:
		var reaction_weight := infected_reaction_timer / infected_reaction_duration if infected_reaction_timer > 0.0 else 0.0
		if reaction_weight > 0.0:
			var reaction_strength := prototype_combat_feedback.hit_strength()
			infected.rotation_degrees.z = -12.0 * reaction_weight * reaction_strength
			infected.scale = Vector3(1.0 + reaction_weight * 0.08 * reaction_strength, 1.0 - reaction_weight * 0.08 * reaction_strength, 1.0 + reaction_weight * 0.08 * reaction_strength)
		else:
			_apply_infected_state_pose()
	if infected_material == null:
		return
	var combat_color := INFECTED_COLOR
	var infected_state := prototype_infected_brain.state()
	if hit_flash_timer > 0.0:
		combat_color = Color("ffbd86")
	elif infected_state == PrototypeInfectedBrainScript.STATE_ALERT:
		combat_color = Color("b9a36f")
	elif infected_state == PrototypeInfectedBrainScript.STATE_WINDUP:
		combat_color = Color("ed9d63")
	elif infected_state == PrototypeInfectedBrainScript.STATE_RECOVERY:
		combat_color = Color("c87c5b")
	elif infected_state == PrototypeInfectedBrainScript.STATE_STAGGERED:
		combat_color = Color("d9b08a")
	infected_material.albedo_color = combat_color


func _apply_infected_state_pose() -> void:
	if infected == null:
		return
	var state := prototype_infected_brain.state()
	infected.rotation_degrees.z = 0.0
	infected.scale = Vector3.ONE
	match state:
		PrototypeInfectedBrainScript.STATE_DORMANT:
			infected.rotation_degrees.z = sin(environment_time * 1.4) * 1.4
		PrototypeInfectedBrainScript.STATE_ALERT:
			var pulse := 1.0 + sin(environment_time * 12.0) * 0.025
			infected.scale = Vector3(pulse, 0.94, pulse)
		PrototypeInfectedBrainScript.STATE_PURSUIT:
			infected.scale.y = 1.0 + sin(environment_time * 9.0) * 0.025
		PrototypeInfectedBrainScript.STATE_WINDUP:
			infected.rotation_degrees.z = -7.0
			infected.scale = Vector3(1.08, 0.88, 1.08)
		PrototypeInfectedBrainScript.STATE_RECOVERY:
			infected.rotation_degrees.z = 6.0
			infected.scale = Vector3(0.96, 1.04, 0.96)


func _update_combat_motion(delta: float) -> void:
	var movement_ratio := 0.0
	if player != null:
		movement_ratio = clampf(Vector2(player.velocity.x, player.velocity.z).length() / PLAYER_SPEED, 0.0, 1.0)
	var motion := prototype_combat_motion.advance(delta, movement_ratio)
	var blend_weight := 1.0 - exp(-24.0 * delta)
	if player_sidearm != null:
		var firearm_position_offset: Vector3 = motion.get("firearm_position_offset", Vector3.ZERO)
		var firearm_rotation_offset: Vector3 = motion.get("firearm_rotation_offset", Vector3.ZERO)
		var sidearm_position := player_sidearm_rest_position + firearm_position_offset
		var sidearm_rotation := player_sidearm_rest_rotation + firearm_rotation_offset
		player_sidearm.position = player_sidearm.position.lerp(sidearm_position, blend_weight)
		player_sidearm.rotation_degrees = player_sidearm.rotation_degrees.lerp(sidearm_rotation, blend_weight)
	if player_weapon != null:
		var melee_rotation_offset: Vector3 = motion.get("melee_rotation_offset", Vector3.ZERO)
		var melee_rotation := player_melee_rest_rotation + melee_rotation_offset
		player_weapon.rotation_degrees = player_weapon.rotation_degrees.lerp(melee_rotation, blend_weight)
	if bool(motion.get("melee_impact", false)):
		_resolve_melee_attack()


func _update_actor_animation(delta: float) -> void:
	if player != null and not player_rig.is_empty():
		var movement_ratio := clampf(Vector2(player.velocity.x, player.velocity.z).length() / PLAYER_SPEED, 0.0, 1.0)
		var action := PrototypeActorAnimationScript.ACTION_NONE
		var action_progress := 0.0
		if prototype_combat_motion.is_melee_active():
			action = PrototypeActorAnimationScript.ACTION_MELEE
			action_progress = prototype_combat_motion.melee_progress()
		elif prototype_combat_motion.is_reload_active():
			action = PrototypeActorAnimationScript.ACTION_RELOAD
			action_progress = prototype_combat_motion.reload_progress()
		elif prototype_combat_motion.recoil_weight() > 0.01:
			action = PrototypeActorAnimationScript.ACTION_FIRE
			action_progress = prototype_combat_motion.recoil_weight()
		var player_pose := prototype_player_animation.advance(delta, movement_ratio, "locomotion", 0.0, action, action_progress)
		_apply_actor_pose(player_rig, player_pose)
		if bool(player_pose.get("footstep", false)):
			_play_prototype_audio("footstep_survivor", false, true)

	if infected != null and not infected_rig.is_empty():
		var infected_movement_ratio := clampf(Vector2(infected.velocity.x, infected.velocity.z).length() / INFECTED_SPEED, 0.0, 1.0)
		var infected_pose := prototype_infected_animation.advance(
			delta,
			infected_movement_ratio,
			prototype_infected_brain.state(),
			prototype_infected_brain.state_progress(),
		)
		_apply_actor_pose(infected_rig, infected_pose)
		if bool(infected_pose.get("footstep", false)):
			_play_prototype_audio("footstep_infected", false, true)


func _apply_actor_pose(rig: Dictionary, pose: Dictionary) -> void:
	var root := rig.get("root") as Node3D
	if root == null:
		return
	root.position = Vector3(0.0, float(pose.get("root_position_y", 0.0)), 0.0)
	root.rotation_degrees = pose.get("root_rotation", Vector3.ZERO)
	for part_name: String in ["torso", "head", "left_arm", "right_arm", "left_leg", "right_leg"]:
		var part := rig.get(part_name) as Node3D
		if part != null:
			part.rotation_degrees = pose.get("%s_rotation" % part_name, Vector3.ZERO)


func _update_infected_telegraph() -> void:
	if infected_telegraph == null:
		return
	var windup_active := infected != null and prototype_infected_brain.state() == PrototypeInfectedBrainScript.STATE_WINDUP
	infected_telegraph.visible = windup_active
	if not windup_active:
		return
	infected_telegraph.global_position = Vector3(infected.global_position.x, 0.025, infected.global_position.z)
	var progress := prototype_infected_brain.state_progress()
	var pulse_scale := 0.72 + progress * 0.28 + sin(environment_time * 22.0) * 0.025
	infected_telegraph.scale = Vector3(pulse_scale, 1.0, pulse_scale)
	infected_telegraph.rotation.y += 0.025


func _update_combat_ui() -> void:
	if hit_marker_label != null:
		var marker_alpha := prototype_combat_feedback.hit_marker_alpha()
		hit_marker_label.visible = marker_alpha > 0.0
		hit_marker_label.text = prototype_combat_feedback.marker_text()
		hit_marker_label.modulate = Color(1.0, 0.84, 0.64, marker_alpha)
	if damage_overlay != null:
		damage_overlay.color = Color(0.62, 0.05, 0.03, prototype_combat_feedback.damage_overlay_alpha())
	if combat_status_label == null:
		return
	combat_status_label.text = ""
	combat_status_label.visible = false
	if infected != null and prototype_infected_brain.state() == PrototypeInfectedBrainScript.STATE_WINDUP:
		combat_status_label.text = "MOVE - STRIKE IN %.1fs" % prototype_infected_brain.state_timer()
		combat_status_label.add_theme_color_override("font_color", Color("ffb27d"))
		combat_status_label.visible = true
	elif prototype_weapon_state.is_reloading():
		combat_status_label.text = "RELOADING %.1fs" % prototype_weapon_state.reload_remaining()
		combat_status_label.add_theme_color_override("font_color", Color("d8e4e8"))
		combat_status_label.visible = true
	elif prototype_weapon_state.active_mode() == PrototypeWeaponStateScript.MODE_FIREARM and prototype_weapon_state.magazine_ammo() <= 0:
		combat_status_label.text = "MAGAZINE EMPTY - RELOAD"
		combat_status_label.add_theme_color_override("font_color", Color("ffb27d"))
		combat_status_label.visible = true


func _update_weapon_state(delta: float) -> void:
	var had_buffered_fire := fire_buffer_timer > 0.0
	var result := prototype_weapon_state.advance(delta)
	fire_buffer_timer = maxf(fire_buffer_timer - delta, 0.0)
	if bool(result.get("reload_completed", false)):
		_sync_ammo_inventory()
		_set_feedback("Reload complete. %d / %d." % [prototype_weapon_state.magazine_ammo(), prototype_weapon_state.reserve_ammo()], 1.2)
		_save_game()
	# Consume a queued input on the frame cooldown reaches zero, even when a
	# low frame rate advances both timers past their boundary together.
	if had_buffered_fire and prototype_weapon_state.fire_cooldown_remaining() <= 0.0:
		_try_fire(false)


func _update_environment(delta: float) -> void:
	if signal_beacon == null or signal_light == null:
		return
	environment_time = fmod(environment_time + delta, TAU)
	signal_beacon.rotation.y += delta * 0.55
	signal_light.light_energy = 1.05 + sin(environment_time * 2.4) * 0.25


func _update_objective() -> void:
	if player == null or run_complete:
		return
	if not beacon_reached and signal_beacon != null and player.global_position.distance_to(signal_beacon.global_position) <= SIGNAL_BEACON_REACH:
		beacon_reached = true
		_set_feedback("Signal acquired. Neutralize the infected.", 2.5)
		_save_game()
	if beacon_reached and infected == null and salvage_drop == null:
		run_complete = true
		_set_feedback("Route secured. Run complete. Press R or RESET RUN to replay.", 4.0)
		_save_game()


func _handle_attack_input() -> void:
	var mouse_surface_active := prototype_touch_input.movement_pointer_id() == MOUSE_TOUCH_POINTER_ID or prototype_touch_input.look_pointer_id() == MOUSE_TOUCH_POINTER_ID
	var mouse_attack_down := Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT) and not mouse_surface_active
	var attack_down := Input.is_key_pressed(KEY_SPACE) or mouse_attack_down or bool(held_actions.get("attack", false))
	if attack_down and not attack_was_down:
		_try_attack()
	attack_was_down = attack_down


func _handle_fire_input() -> void:
	var fire_down := Input.is_key_pressed(KEY_E) or Input.is_mouse_button_pressed(MOUSE_BUTTON_RIGHT) or bool(held_actions.get("fire", false))
	if fire_down and not fire_was_down:
		_try_fire()
	fire_was_down = fire_down


func _handle_weapon_switch_input() -> void:
	var switch_down := Input.is_key_pressed(KEY_Q) or bool(held_actions.get("switch_weapon", false))
	if switch_down and not switch_was_down:
		var active_mode := prototype_weapon_state.switch_mode()
		fire_buffer_timer = 0.0
		prototype_combat_motion.trigger_equip()
		_apply_weapon_mode_presentation()
		_play_prototype_audio("equip")
		_set_feedback("Active weapon: %s." % active_mode.capitalize(), 1.0)
		_save_game()
	switch_was_down = switch_down


func _handle_reload_input() -> void:
	var reload_down := Input.is_key_pressed(KEY_F) or bool(held_actions.get("reload", false))
	if reload_down and not reload_was_down:
		_try_reload()
	reload_was_down = reload_down


func _handle_medkit_input() -> void:
	var medkit_down := Input.is_key_pressed(KEY_H) or bool(held_actions.get("medkit", false))
	if medkit_down and not medkit_was_down:
		_use_medkit()
	medkit_was_down = medkit_down


func _handle_restart_input() -> void:
	var restart_down := Input.is_key_pressed(KEY_R) or bool(held_actions.get("restart", false))
	if restart_down and not restart_was_down:
		_restart_run()
	restart_was_down = restart_down


func _handle_save_load_input() -> void:
	var save_down := Input.is_key_pressed(KEY_F5) or bool(held_actions.get("save", false))
	if save_down and not save_was_down and not run_failed:
		if _save_game():
			_set_feedback("Checkpoint saved.", 1.5)
		else:
			_set_feedback("Checkpoint could not be saved.", 1.5)
	save_was_down = save_down

	var load_down := Input.is_key_pressed(KEY_F9) or bool(held_actions.get("load", false))
	if load_down and not load_was_down:
		if _load_save():
			_set_feedback("Checkpoint loaded.", 1.5)
		else:
			_set_feedback("No compatible checkpoint found.", 1.5)
	load_was_down = load_down


func _handle_inventory_input() -> void:
	var close_with_escape := inventory_screen_open and Input.is_key_pressed(KEY_ESCAPE)
	var inventory_down := Input.is_key_pressed(KEY_I) or close_with_escape
	if inventory_down and not inventory_was_down:
		_toggle_inventory()
		if close_with_escape:
			pause_was_down = true
	inventory_was_down = inventory_down


func _toggle_inventory() -> void:
	if not inventory_screen_open and (is_paused or run_failed):
		return
	inventory_screen_open = not inventory_screen_open
	held_actions.clear()
	_reset_touch_controls()
	if inventory_panel != null:
		inventory_panel.visible = inventory_screen_open
	if inventory_screen_open:
		_refresh_inventory_items()
		if inventory_item_list != null:
			inventory_item_list.grab_focus()
	else:
		inventory_selected_item_id = ""
	_update_hud()


func _handle_pause_input() -> void:
	var pause_down := Input.is_key_pressed(KEY_P) or Input.is_key_pressed(KEY_ESCAPE)
	if pause_down and not pause_was_down:
		_toggle_pause()
	pause_was_down = pause_down


func _toggle_pause() -> void:
	if inventory_screen_open:
		_toggle_inventory()
		return
	is_paused = not is_paused
	held_actions.clear()
	_reset_touch_controls()
	pause_was_down = false
	inventory_was_down = false
	inventory_screen_open = false
	if inventory_panel != null:
		inventory_panel.visible = false
	if player != null:
		player.velocity = Vector3.ZERO
	if infected != null:
		infected.velocity = Vector3.ZERO
	if is_paused and pause_resume_button != null:
		pause_resume_button.grab_focus()
	_set_feedback("Run paused." if is_paused else "Run resumed.", 1.0)
	_update_hud()


func _load_checkpoint_from_defeat() -> void:
	if _load_save():
		_set_feedback("Last checkpoint loaded.", 1.5)
	else:
		_set_feedback("No compatible checkpoint found.", 1.5)


func _restart_run() -> void:
	health = STARTING_HEALTH
	infected_health = 100
	inventory = {"scrap": 0, "medkits": 1, "ammo": 6}
	attack_cooldown = 0.0
	fire_buffer_timer = 0.0
	prototype_weapon_state.initialize(_equipped_weapon_item(), int(inventory.get("ammo", 0)))
	prototype_combat_motion.reset()
	prototype_combat_feedback.reset()
	prototype_player_animation.reset()
	prototype_infected_animation.reset()
	_reset_infected_behavior(false)
	save_timer = 0.0
	beacon_reached = false
	run_complete = false
	infected_knockback_timer = 0.0
	infected_knockback_velocity = Vector3.ZERO
	attack_was_down = false
	fire_was_down = false
	switch_was_down = false
	reload_was_down = false
	save_was_down = false
	load_was_down = false
	pause_was_down = false
	is_paused = false
	run_failed = false
	held_actions.clear()
	_reset_touch_controls()
	_apply_equipped_weapon_presentation()
	_remove_salvage_drop()
	player.position = Vector3(0.0, 1.0, 4.0)
	player.velocity = Vector3.ZERO
	for pickup in pickups:
		if is_instance_valid(pickup):
			pickup.visible = true

	_ensure_infected()
	infected.position = Vector3(0.0, 1.0, -4.0)
	infected.velocity = Vector3.ZERO
	infected_health = 100
	if infected_material != null:
		infected_material.albedo_color = INFECTED_COLOR

	camera_yaw = 0.0
	_update_camera(1.0)
	_set_feedback("Run reset. Reach the signal beacon.", 2.0)
	_save_game()


func _ensure_infected() -> void:
	if infected != null and is_instance_valid(infected) and not infected.is_queued_for_deletion():
		infected.visible = true
		return
	infected = _build_actor(
		String(game_data.get("infected_id", "infected-001-review")),
		Vector3(0.0, 1.0, -4.0),
		INFECTED_COLOR,
		true,
	)


func _use_medkit() -> void:
	var available := int(inventory.get("medkits", 0))
	if health >= STARTING_HEALTH:
		_set_feedback("Health is already full.", 1.0)
		return
	if available <= 0:
		_set_feedback("No medkits available.", 1.0)
		return
	var previous_health := health
	health = mini(STARTING_HEALTH, health + MEDKIT_HEAL)
	inventory["medkits"] = available - 1
	_set_feedback("Medkit used. Health restored: +%d." % (health - previous_health), 1.5)
	_save_game()


func _try_attack() -> void:
	if infected == null or attack_cooldown > 0.0:
		return
	if prototype_weapon_state.active_mode() != PrototypeWeaponStateScript.MODE_MELEE:
		_set_feedback("Switch to melee before attacking.", 1.0)
		return
	attack_cooldown = 0.55
	_play_attack_feedback()


func _resolve_melee_attack() -> void:
	if infected == null:
		return
	var distance := player.global_position.distance_to(infected.global_position)
	if distance > ATTACK_RANGE:
		_set_feedback("Too far away.", 0.75)
		return
	_play_prototype_audio("melee")
	_damage_infected(ATTACK_DAMAGE, "Hit confirmed. Threat staggered.")


func _try_fire(allow_buffer: bool = true) -> bool:
	var result := prototype_weapon_state.try_fire()
	if not bool(result.get("fired", false)):
		if not allow_buffer:
			fire_buffer_timer = 0.0
		match String(result.get("reason", "blocked")):
			"inactive":
				_set_feedback("Switch to the equipped firearm before firing.", 1.0)
			"reloading":
				_set_feedback("Reload in progress.", 0.8)
			"empty":
				_play_prototype_audio("empty", true)
				_set_feedback("Magazine empty. Press F or RELOAD.", 1.2)
			"cooldown":
				if allow_buffer and float(result.get("cooldown_remaining", 1.0)) <= FIRE_BUFFER_WINDOW:
					fire_buffer_timer = FIRE_BUFFER_WINDOW
		return false
	fire_buffer_timer = 0.0
	_resolve_fire_result(result)
	return true


func _resolve_fire_result(result: Dictionary) -> void:
	_play_fire_feedback(int(result.get("damage", 1)))
	_sync_ammo_inventory()
	var magazine := prototype_weapon_state.magazine_ammo()
	if infected == null:
		_set_feedback("Shot fired. Magazine: %d." % magazine, 0.8)
		_save_game()
		return
	var distance := player.global_position.distance_to(infected.global_position)
	if distance > float(result.get("range_meters", 8.0)):
		_set_feedback("Shot missed. Target out of range. Magazine: %d." % magazine, 1.0)
		_save_game()
		return
	_damage_infected(int(result.get("damage", 1)), "%s hit. Magazine: %d." % [result.get("weapon_name", "Weapon"), magazine])
	_save_game()


func _try_reload() -> void:
	var result := prototype_weapon_state.begin_reload()
	if not bool(result.get("started", false)):
		match String(result.get("reason", "blocked")):
			"inactive":
				_set_feedback("Switch to the equipped firearm before reloading.", 1.0)
			"reloading":
				_set_feedback("Reload already in progress.", 0.8)
			"full":
				_set_feedback("Magazine already full.", 0.8)
			"no_reserve":
				_set_feedback("No reserve ammunition.", 1.0)
		return
	_play_reload_feedback(float(result.get("duration", 1.0)))
	_play_prototype_audio("reload")
	_set_feedback("Reloading %s..." % result.get("weapon_name", "weapon"), minf(float(result.get("duration", 1.0)), 2.0))


func _damage_infected(damage: int, feedback: String) -> void:
	if infected == null:
		return
	infected_health = maxi(infected_health - damage, 0)
	var knockback_direction := infected.global_position - player.global_position
	knockback_direction.y = 0.0
	if knockback_direction.length_squared() > 0.001:
		infected_knockback_velocity = knockback_direction.normalized() * INFECTED_KNOCKBACK_SPEED
		infected_knockback_timer = INFECTED_KNOCKBACK_DURATION
	hit_flash_timer = HIT_FLASH_DURATION
	var interrupted_attack := prototype_infected_brain.apply_stagger()
	var defeated := infected_health <= 0
	prototype_combat_feedback.register_infected_hit(damage, interrupted_attack, defeated)
	infected_reaction_duration = lerpf(0.12, 0.24, clampf(prototype_combat_feedback.hit_strength() / 1.25, 0.0, 1.0))
	infected_reaction_timer = infected_reaction_duration
	_play_prototype_audio("death" if defeated else "hit", true)
	var reaction_note := " Attack interrupted." if interrupted_attack else ""
	_set_feedback("%s%s Infected health: %d" % [feedback, reaction_note, infected_health], 0.9)
	if infected_health <= 0:
		_defeat_infected()


func _play_fire_feedback(damage: int) -> void:
	if player_sidearm == null:
		return
	muzzle_flash_timer = 0.075
	camera_kick = 1.0
	_set_muzzle_flash_visible(true)
	_play_prototype_audio("fire")
	_eject_prototype_shell()
	prototype_combat_motion.trigger_fire(clampf(float(damage) / 60.0, 0.65, 1.35))


func _play_reload_feedback(duration: float) -> void:
	if player_sidearm == null:
		return
	prototype_combat_motion.trigger_reload(duration)


func _eject_prototype_shell() -> void:
	if player == null or player_sidearm == null:
		return
	var shell := MeshInstance3D.new()
	shell.name = "PrototypeShell"
	var mesh := BoxMesh.new()
	mesh.size = Vector3(0.035, 0.035, 0.11)
	shell.mesh = mesh
	shell.material_override = _material(Color("b88b4d"))
	shell.position = player_sidearm.position + Vector3(-0.18, 0.10, 0.04)
	player.add_child(shell)
	var tween := create_tween()
	tween.set_parallel(true)
	tween.tween_property(shell, "position", shell.position + Vector3(-0.42, 0.32, 0.22), 0.28)
	tween.tween_property(shell, "rotation_degrees", Vector3(260.0, 140.0, 90.0), 0.28)
	tween.chain().tween_callback(shell.queue_free)


func _play_attack_feedback() -> void:
	if player_weapon == null:
		return
	prototype_combat_motion.trigger_melee(ATTACK_SWING_DURATION)


func _defeat_infected(award_salvage: bool = true, persist_state: bool = true) -> void:
	if infected == null:
		return
	var defeated := infected
	var defeated_position := defeated.global_position
	infected = null
	_reset_infected_behavior(false)
	if infected_telegraph != null:
		infected_telegraph.visible = false
	if award_salvage:
		var death_tween := create_tween()
		death_tween.set_parallel(true)
		death_tween.tween_property(defeated, "rotation_degrees", Vector3(0.0, 0.0, 82.0), 0.32)
		death_tween.tween_property(defeated, "scale", Vector3(1.15, 0.18, 1.15), 0.32)
		death_tween.chain().tween_callback(defeated.queue_free)
	else:
		defeated.queue_free()
	if award_salvage:
		_spawn_salvage_drop(defeated_position)
		_set_feedback("Threat neutralized. Salvage dropped nearby.", 3.0)
	if persist_state:
		_save_game()


func _spawn_salvage_drop(position: Vector3) -> void:
	if environment_root == null or salvage_drop != null:
		return
	salvage_drop_position = Vector3(position.x, 0.35, position.z)
	salvage_drop_collected = false
	salvage_drop = _build_pickup(
		environment_root,
		"scrap",
		3,
		salvage_drop_position,
		Color("e8b160"),
		"LootDrop_Salvage_001",
	)


func _remove_salvage_drop() -> void:
	for pickup in pickups.duplicate():
		if is_instance_valid(pickup) and bool(pickup.get_meta("is_salvage_drop", false)):
			pickups.erase(pickup)
			pickup.queue_free()
	salvage_drop = null
	salvage_drop_collected = false
	salvage_drop_position = Vector3.ZERO


func _collect_pickups() -> void:
	for pickup in pickups:
		if not is_instance_valid(pickup) or not pickup.visible:
			continue
		if player.global_position.distance_to(pickup.global_position) > 1.35:
			continue
		var kind := String(pickup.get_meta("kind", "scrap"))
		var amount := int(pickup.get_meta("amount", 1))
		var is_salvage_drop := bool(pickup.get_meta("is_salvage_drop", false))
		if kind == "ammo":
			prototype_weapon_state.add_reserve(amount)
			_sync_ammo_inventory()
		else:
			inventory[kind] = int(inventory.get(kind, 0)) + amount
		pickup.visible = false
		if is_salvage_drop:
			salvage_drop_collected = true
			salvage_drop = null
			_set_feedback("Salvage secured: +%d scrap." % amount, 2.0)
		else:
			_set_feedback("Collected %s +%d." % [kind, amount], 1.5)
		_save_game()


func _update_camera(delta: float = 1.0) -> void:
	if camera == null or player == null:
		return
	camera_yaw -= prototype_touch_input.consume_look_delta() * TOUCH_LOOK_YAW_SCALE
	if held_actions.get("camera_left", false):
		camera_yaw -= CAMERA_TURN_SPEED * delta
	if held_actions.get("camera_right", false):
		camera_yaw += CAMERA_TURN_SPEED * delta
	var offset := Vector3(0.0, 3.4, 6.5).rotated(Vector3.UP, camera_yaw)
	var look_ahead := Vector3(player.velocity.x, 0.0, player.velocity.z) * CAMERA_LOOK_AHEAD
	var impact := prototype_combat_feedback.camera_impact()
	var recoil_offset := Vector3(sin(environment_time * 37.0) * impact * 0.035, camera_kick * 0.08 + impact * 0.05, camera_kick * 0.16 + impact * 0.11).rotated(Vector3.UP, camera_yaw)
	var target_position := player.global_position + offset + look_ahead + recoil_offset
	var smoothing_weight := 1.0 - exp(-CAMERA_SMOOTHING * delta)
	camera.global_position = camera.global_position.lerp(target_position, smoothing_weight)
	camera.look_at(player.global_position + look_ahead * 0.45 + Vector3(0.0, 0.9, 0.0), Vector3.UP)


func _build_touch_controls() -> void:
	var canvas := CanvasLayer.new()
	add_child(canvas)
	var hud_root := Control.new()
	hud_root.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	hud_root.mouse_filter = Control.MOUSE_FILTER_PASS
	canvas.add_child(hud_root)

	damage_overlay = ColorRect.new()
	damage_overlay.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	damage_overlay.mouse_filter = Control.MOUSE_FILTER_IGNORE
	damage_overlay.color = Color(0.62, 0.05, 0.03, 0.0)
	hud_root.add_child(damage_overlay)

	status_label = Label.new()
	status_label.position = Vector2(24.0, 20.0)
	status_label.size = Vector2(620.0, 64.0)
	status_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	status_label.add_theme_font_size_override("font_size", 20)
	status_label.add_theme_color_override("font_color", Color("f0e7d8"))
	hud_root.add_child(status_label)

	health_label = Label.new()
	health_label.position = Vector2(24.0, 94.0)
	health_label.add_theme_font_size_override("font_size", 18)
	hud_root.add_child(health_label)
	health_bar = _build_progress_bar(hud_root, Vector2(24.0, 124.0), Color("d98263"))

	threat_label = Label.new()
	threat_label.position = Vector2(24.0, 154.0)
	threat_label.add_theme_font_size_override("font_size", 18)
	threat_label.add_theme_color_override("font_color", Color("c4d4ad"))
	hud_root.add_child(threat_label)
	infected_bar = _build_progress_bar(hud_root, Vector2(24.0, 184.0), Color("9eb27e"))

	inventory_label = Label.new()
	inventory_label.position = Vector2(24.0, 214.0)
	inventory_label.size = Vector2(860.0, 68.0)
	inventory_label.add_theme_font_size_override("font_size", 18)
	hud_root.add_child(inventory_label)

	feedback_label = Label.new()
	feedback_label.position = Vector2(24.0, 278.0)
	feedback_label.size = Vector2(620.0, 46.0)
	feedback_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	feedback_label.add_theme_color_override("font_color", Color("ffd2ae"))
	feedback_label.add_theme_font_size_override("font_size", 18)
	hud_root.add_child(feedback_label)

	combat_status_label = Label.new()
	combat_status_label.set_anchors_preset(Control.PRESET_CENTER_TOP)
	combat_status_label.offset_left = -260.0
	combat_status_label.offset_top = 34.0
	combat_status_label.offset_right = 260.0
	combat_status_label.offset_bottom = 82.0
	combat_status_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	combat_status_label.add_theme_font_size_override("font_size", 23)
	combat_status_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	combat_status_label.visible = false
	hud_root.add_child(combat_status_label)

	hit_marker_label = Label.new()
	hit_marker_label.set_anchors_preset(Control.PRESET_CENTER)
	hit_marker_label.offset_left = -90.0
	hit_marker_label.offset_top = -28.0
	hit_marker_label.offset_right = 90.0
	hit_marker_label.offset_bottom = 28.0
	hit_marker_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	hit_marker_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	hit_marker_label.add_theme_font_size_override("font_size", 28)
	hit_marker_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	hit_marker_label.visible = false
	hud_root.add_child(hit_marker_label)

	_build_movement_pad(hud_root)

	var action_panel := VBoxContainer.new()
	action_panel.add_theme_constant_override("separation", 8)
	_set_bottom_right(action_panel, 24.0, 26.0, 224.0, 430.0)
	hud_root.add_child(action_panel)
	_add_touch_button(action_panel, "MEDKIT", "medkit", Vector2(224.0, 48.0))
	var weapon_row := HBoxContainer.new()
	weapon_row.add_theme_constant_override("separation", 8)
	action_panel.add_child(weapon_row)
	_add_touch_button(weapon_row, "SWITCH", "switch_weapon", Vector2(108.0, 52.0))
	_add_touch_button(weapon_row, "RELOAD", "reload", Vector2(108.0, 52.0))
	_add_touch_button(action_panel, "ATTACK", "attack", Vector2(224.0, 58.0))
	_add_touch_button(action_panel, "FIRE", "fire", Vector2(224.0, 58.0), true)
	_build_look_pad(action_panel)
	var save_load_row := HBoxContainer.new()
	save_load_row.add_theme_constant_override("separation", 8)
	action_panel.add_child(save_load_row)
	_add_touch_button(save_load_row, "SAVE", "save", Vector2(108.0, 48.0))
	_add_touch_button(save_load_row, "LOAD", "load", Vector2(108.0, 48.0))
	_add_touch_button(action_panel, "RESET RUN", "restart", Vector2(224.0, 48.0))

	var instructions := Label.new()
	instructions.text = "LEFT PAD: MOVE   |   DRAG: TURN   |   ATTACK / FIRE / RELOAD"
	instructions.set_anchors_preset(Control.PRESET_BOTTOM_WIDE)
	instructions.offset_left = 24.0
	instructions.offset_top = -34.0
	instructions.offset_right = -24.0
	instructions.offset_bottom = -8.0
	instructions.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	instructions.add_theme_font_size_override("font_size", 18)
	hud_root.add_child(instructions)

	var pause_button := Button.new()
	pause_button.text = "PAUSE"
	pause_button.custom_minimum_size = Vector2(132.0, 52.0)
	pause_button.set_anchors_preset(Control.PRESET_TOP_RIGHT)
	pause_button.offset_left = -156.0
	pause_button.offset_top = 20.0
	pause_button.offset_right = -24.0
	pause_button.offset_bottom = 72.0
	pause_button.add_theme_font_size_override("font_size", 18)
	pause_button.pressed.connect(_toggle_pause)
	hud_root.add_child(pause_button)

	var inventory_button := Button.new()
	inventory_button.text = "INVENTORY"
	inventory_button.custom_minimum_size = Vector2(156.0, 52.0)
	inventory_button.set_anchors_preset(Control.PRESET_TOP_RIGHT)
	inventory_button.offset_left = -324.0
	inventory_button.offset_top = 20.0
	inventory_button.offset_right = -168.0
	inventory_button.offset_bottom = 72.0
	inventory_button.add_theme_font_size_override("font_size", 18)
	inventory_button.pressed.connect(_toggle_inventory)
	hud_root.add_child(inventory_button)

	pause_panel = PanelContainer.new()
	pause_panel.set_anchors_preset(Control.PRESET_CENTER)
	pause_panel.offset_left = -240.0
	pause_panel.offset_top = -132.0
	pause_panel.offset_right = 240.0
	pause_panel.offset_bottom = 132.0
	pause_panel.mouse_filter = Control.MOUSE_FILTER_STOP
	pause_panel.visible = false
	var pause_content := VBoxContainer.new()
	pause_content.add_theme_constant_override("separation", 14)
	var pause_title := Label.new()
	pause_title.text = "RUN PAUSED"
	pause_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	pause_title.add_theme_font_size_override("font_size", 28)
	pause_content.add_child(pause_title)
	var pause_description := Label.new()
	pause_description.text = "The route is held. Resume when you are ready."
	pause_description.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	pause_description.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	pause_description.add_theme_font_size_override("font_size", 18)
	pause_content.add_child(pause_description)
	pause_resume_button = Button.new()
	pause_resume_button.text = "RESUME"
	pause_resume_button.custom_minimum_size = Vector2(220.0, 56.0)
	pause_resume_button.add_theme_font_size_override("font_size", 20)
	pause_resume_button.pressed.connect(_toggle_pause)
	pause_content.add_child(pause_resume_button)
	var pause_margin := MarginContainer.new()
	pause_margin.add_theme_constant_override("margin_left", 28)
	pause_margin.add_theme_constant_override("margin_top", 24)
	pause_margin.add_theme_constant_override("margin_right", 28)
	pause_margin.add_theme_constant_override("margin_bottom", 24)
	pause_margin.add_child(pause_content)
	pause_panel.add_child(pause_margin)
	hud_root.add_child(pause_panel)
	_build_inventory_panel(hud_root)
	_build_defeat_panel(hud_root)


func _build_movement_pad(parent: Control) -> void:
	movement_pad = Control.new()
	movement_pad.name = "MovementPad"
	movement_pad.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_set_bottom_left(movement_pad, 24.0, 34.0, 208.0, 208.0)
	parent.add_child(movement_pad)

	var pad_background := Panel.new()
	pad_background.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	pad_background.mouse_filter = Control.MOUSE_FILTER_IGNORE
	pad_background.add_theme_stylebox_override("panel", _touch_surface_style(Color(0.06, 0.09, 0.11, 0.68), Color(0.76, 0.82, 0.78, 0.34), 104))
	movement_pad.add_child(pad_background)

	var move_label := Label.new()
	move_label.text = "MOVE"
	move_label.set_anchors_preset(Control.PRESET_CENTER)
	move_label.offset_left = -48.0
	move_label.offset_top = -14.0
	move_label.offset_right = 48.0
	move_label.offset_bottom = 14.0
	move_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	move_label.add_theme_color_override("font_color", Color(0.84, 0.88, 0.84, 0.52))
	move_label.add_theme_font_size_override("font_size", 16)
	move_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	movement_pad.add_child(move_label)

	movement_thumb = Panel.new()
	movement_thumb.name = "MovementThumb"
	movement_thumb.size = Vector2(62.0, 62.0)
	movement_thumb.mouse_filter = Control.MOUSE_FILTER_IGNORE
	movement_thumb.add_theme_stylebox_override("panel", _touch_surface_style(Color(0.74, 0.80, 0.74, 0.82), Color(0.95, 0.90, 0.78, 0.80), 31))
	movement_pad.add_child(movement_thumb)
	_update_touch_pad_visuals()


func _build_look_pad(parent: Control) -> void:
	look_pad = PanelContainer.new()
	look_pad.name = "LookPad"
	look_pad.custom_minimum_size = Vector2(224.0, 72.0)
	look_pad.mouse_filter = Control.MOUSE_FILTER_IGNORE
	look_pad.add_theme_stylebox_override("panel", _touch_surface_style(Color(0.07, 0.10, 0.12, 0.76), Color(0.82, 0.72, 0.55, 0.44), 12))
	var look_label := Label.new()
	look_label.text = "DRAG TO TURN   ↔"
	look_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	look_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	look_label.add_theme_color_override("font_color", Color("eadcc7"))
	look_label.add_theme_font_size_override("font_size", 17)
	look_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	look_pad.add_child(look_label)
	parent.add_child(look_pad)


func _touch_surface_style(background: Color, border: Color, radius: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = background
	style.border_color = border
	style.set_border_width_all(2)
	style.corner_radius_top_left = radius
	style.corner_radius_top_right = radius
	style.corner_radius_bottom_left = radius
	style.corner_radius_bottom_right = radius
	return style


func _build_inventory_panel(parent: Control) -> void:
	inventory_panel = PanelContainer.new()
	inventory_panel.set_anchors_preset(Control.PRESET_CENTER)
	inventory_panel.offset_left = -560.0
	inventory_panel.offset_top = -320.0
	inventory_panel.offset_right = 560.0
	inventory_panel.offset_bottom = 320.0
	inventory_panel.mouse_filter = Control.MOUSE_FILTER_STOP
	inventory_panel.visible = false

	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 28)
	margin.add_theme_constant_override("margin_top", 24)
	margin.add_theme_constant_override("margin_right", 28)
	margin.add_theme_constant_override("margin_bottom", 24)
	var content := VBoxContainer.new()
	content.add_theme_constant_override("separation", 12)

	var title := Label.new()
	title.text = "PROTOTYPE INVENTORY"
	title.add_theme_font_size_override("font_size", 30)
	content.add_child(title)

	var disclaimer := Label.new()
	disclaimer.text = "Local evaluation loadout only. Concepts are non-canonical, unowned, and not for sale."
	disclaimer.add_theme_color_override("font_color", Color("d8b98a"))
	disclaimer.add_theme_font_size_override("font_size", 17)
	content.add_child(disclaimer)

	var category_row := HBoxContainer.new()
	category_row.add_theme_constant_override("separation", 10)
	var weapons_button := Button.new()
	weapons_button.text = "WEAPONS (10)"
	weapons_button.custom_minimum_size = Vector2(190.0, 50.0)
	weapons_button.add_theme_font_size_override("font_size", 18)
	weapons_button.pressed.connect(func() -> void: _set_inventory_category("weapon"))
	category_row.add_child(weapons_button)
	var gear_button := Button.new()
	gear_button.text = "GEAR (20)"
	gear_button.custom_minimum_size = Vector2(190.0, 50.0)
	gear_button.add_theme_font_size_override("font_size", 18)
	gear_button.pressed.connect(func() -> void: _set_inventory_category("gear"))
	category_row.add_child(gear_button)
	inventory_category_label = Label.new()
	inventory_category_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	inventory_category_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	inventory_category_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	inventory_category_label.add_theme_font_size_override("font_size", 16)
	category_row.add_child(inventory_category_label)
	content.add_child(category_row)

	var body := HBoxContainer.new()
	body.size_flags_vertical = Control.SIZE_EXPAND_FILL
	body.add_theme_constant_override("separation", 22)
	inventory_item_list = ItemList.new()
	inventory_item_list.custom_minimum_size = Vector2(430.0, 348.0)
	inventory_item_list.size_flags_vertical = Control.SIZE_EXPAND_FILL
	inventory_item_list.add_theme_font_size_override("font_size", 17)
	inventory_item_list.item_selected.connect(_on_inventory_item_selected)
	inventory_item_list.item_activated.connect(_on_inventory_item_activated)
	body.add_child(inventory_item_list)

	var detail_column := VBoxContainer.new()
	detail_column.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	detail_column.size_flags_vertical = Control.SIZE_EXPAND_FILL
	detail_column.add_theme_constant_override("separation", 12)
	inventory_detail_label = Label.new()
	inventory_detail_label.custom_minimum_size = Vector2(560.0, 282.0)
	inventory_detail_label.size_flags_vertical = Control.SIZE_EXPAND_FILL
	inventory_detail_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	inventory_detail_label.add_theme_font_size_override("font_size", 16)
	detail_column.add_child(inventory_detail_label)
	inventory_equip_button = Button.new()
	inventory_equip_button.text = "EQUIP LOCALLY"
	inventory_equip_button.custom_minimum_size = Vector2(250.0, 54.0)
	inventory_equip_button.add_theme_font_size_override("font_size", 18)
	inventory_equip_button.pressed.connect(_equip_selected_item)
	detail_column.add_child(inventory_equip_button)
	body.add_child(detail_column)
	content.add_child(body)

	var close_button := Button.new()
	close_button.text = "CLOSE INVENTORY"
	close_button.custom_minimum_size = Vector2(240.0, 50.0)
	close_button.add_theme_font_size_override("font_size", 18)
	close_button.pressed.connect(_toggle_inventory)
	content.add_child(close_button)

	margin.add_child(content)
	inventory_panel.add_child(margin)
	parent.add_child(inventory_panel)


func _set_inventory_category(category: String) -> void:
	if category != "weapon" and category != "gear":
		return
	inventory_category = category
	inventory_selected_item_id = ""
	_refresh_inventory_items()


func _refresh_inventory_items() -> void:
	if inventory_item_list == null:
		return
	inventory_item_list.clear()
	var items := item_catalog.items_for_category(inventory_category)
	if inventory_category_label != null:
		inventory_category_label.text = "%s / %d PROTOTYPE CONCEPTS" % [inventory_category.to_upper(), items.size()]
	if items.is_empty():
		inventory_detail_label.text = "Item catalog unavailable."
		inventory_equip_button.disabled = true
		return

	var selected_index := 0
	var equipped_id := prototype_loadout.equipped_item_id(inventory_category)
	for item: Dictionary in items:
		var item_id := String(item.get("id", ""))
		var label := String(item.get("name", item_id))
		if item_id == equipped_id:
			label += "   [EQUIPPED]"
		inventory_item_list.add_item(label)
		var index := inventory_item_list.get_item_count() - 1
		inventory_item_list.set_item_metadata(index, item_id)
		if item_id == inventory_selected_item_id or (inventory_selected_item_id.is_empty() and item_id == equipped_id):
			selected_index = index
	inventory_item_list.select(selected_index)
	_on_inventory_item_selected(selected_index)


func _on_inventory_item_selected(index: int) -> void:
	if inventory_item_list == null or index < 0 or index >= inventory_item_list.get_item_count():
		return
	inventory_selected_item_id = String(inventory_item_list.get_item_metadata(index))
	var item := item_catalog.item_by_id(inventory_selected_item_id)
	inventory_detail_label.text = _format_inventory_item(item)
	var equipped := prototype_loadout.is_equipped(inventory_selected_item_id)
	inventory_equip_button.disabled = equipped
	inventory_equip_button.text = "EQUIPPED LOCALLY" if equipped else "EQUIP LOCALLY"


func _on_inventory_item_activated(index: int) -> void:
	_on_inventory_item_selected(index)
	_equip_selected_item()


func _equip_selected_item() -> void:
	if inventory_selected_item_id.is_empty():
		return
	if not prototype_loadout.equip(inventory_selected_item_id, item_catalog):
		_set_feedback("Prototype item could not be equipped.", 1.5)
		return
	var equipped_item := item_catalog.item_by_id(inventory_selected_item_id)
	if String(equipped_item.get("category", "")) == "weapon":
		prototype_weapon_state.equip(equipped_item, prototype_weapon_state.reserve_ammo())
		fire_buffer_timer = 0.0
		prototype_combat_motion.trigger_equip()
		_sync_ammo_inventory()
	_apply_equipped_weapon_presentation()
	_save_game()
	_set_feedback("Local loadout updated: %s" % equipped_item.get("name", inventory_selected_item_id), 1.8)
	_refresh_inventory_items()


func _format_inventory_item(item: Dictionary) -> String:
	if item.is_empty():
		return "Select a prototype item to inspect its data."
	var required_level: Variant = item.get("requiredLevel", null)
	var level_text := "None" if required_level == null else str(required_level)
	var lines := PackedStringArray([
		String(item.get("name", "Unknown item")),
		"%s / %s / required level: %s" % [String(item.get("rarity", "unknown")).to_upper(), String(item.get("subCategory", "unknown")), level_text],
		"",
		String(item.get("description", "")),
		"",
		"Purpose: %s" % item.get("purpose", ""),
		"",
		"Prototype stats",
	])
	var stats: Dictionary = item.get("stats", {})
	for stat_name: String in stats.keys():
		lines.append("  %s: %s" % [stat_name.capitalize(), stats[stat_name]])
	if String(item.get("category", "")) == "weapon":
		var ammo: Dictionary = item.get("ammo", {})
		var reload: Dictionary = item.get("reload", {})
		lines.append("  Ammo: %s / %s" % [ammo.get("type", "unknown"), ammo.get("capacity", 0)])
		lines.append("  Reload: %s / %ss" % [reload.get("behavior", "unknown"), reload.get("durationSeconds", 0)])
	lines.append("")
	lines.append("Visual direction: %s" % item.get("visualIdentity", "Pending"))
	lines.append("Presentation: placeholder references only / no final model or audio")
	return "\n".join(lines)


func _build_defeat_panel(parent: Control) -> void:
	defeat_panel = PanelContainer.new()
	defeat_panel.set_anchors_preset(Control.PRESET_CENTER)
	defeat_panel.offset_left = -260.0
	defeat_panel.offset_top = -158.0
	defeat_panel.offset_right = 260.0
	defeat_panel.offset_bottom = 158.0
	defeat_panel.mouse_filter = Control.MOUSE_FILTER_STOP
	defeat_panel.visible = false
	var defeat_margin := MarginContainer.new()
	defeat_margin.add_theme_constant_override("margin_left", 28)
	defeat_margin.add_theme_constant_override("margin_top", 24)
	defeat_margin.add_theme_constant_override("margin_right", 28)
	defeat_margin.add_theme_constant_override("margin_bottom", 24)
	var defeat_content := VBoxContainer.new()
	defeat_content.add_theme_constant_override("separation", 14)
	var defeat_title := Label.new()
	defeat_title.text = "RUN LOST"
	defeat_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	defeat_title.add_theme_font_size_override("font_size", 30)
	defeat_content.add_child(defeat_title)
	var defeat_description := Label.new()
	defeat_description.text = "The route went dark. Retry from the beginning or return to your last saved checkpoint."
	defeat_description.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	defeat_description.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	defeat_description.add_theme_font_size_override("font_size", 18)
	defeat_content.add_child(defeat_description)
	var retry_button := Button.new()
	retry_button.text = "RETRY ROUTE"
	retry_button.custom_minimum_size = Vector2(240.0, 56.0)
	retry_button.add_theme_font_size_override("font_size", 20)
	retry_button.pressed.connect(_restart_run)
	defeat_content.add_child(retry_button)
	var load_button := Button.new()
	load_button.text = "LOAD CHECKPOINT"
	load_button.custom_minimum_size = Vector2(240.0, 56.0)
	load_button.add_theme_font_size_override("font_size", 20)
	load_button.pressed.connect(_load_checkpoint_from_defeat)
	defeat_content.add_child(load_button)
	defeat_margin.add_child(defeat_content)
	defeat_panel.add_child(defeat_margin)
	parent.add_child(defeat_panel)


func _build_progress_bar(parent: Control, position: Vector2, fill_color: Color) -> ProgressBar:
	var progress := ProgressBar.new()
	progress.position = position
	progress.size = Vector2(280.0, 18.0)
	progress.max_value = STARTING_HEALTH
	progress.show_percentage = false
	progress.add_theme_stylebox_override("background", _bar_style(Color("1c252c")))
	progress.add_theme_stylebox_override("fill", _bar_style(fill_color))
	parent.add_child(progress)
	return progress


func _bar_style(color: Color) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = color
	style.corner_radius_top_left = 5
	style.corner_radius_top_right = 5
	style.corner_radius_bottom_left = 5
	style.corner_radius_bottom_right = 5
	return style


func _set_bottom_left(control: Control, distance_left: float, distance_bottom: float, width: float, height: float) -> void:
	control.set_anchors_preset(Control.PRESET_BOTTOM_LEFT)
	control.offset_left = distance_left
	control.offset_top = -distance_bottom - height
	control.offset_right = distance_left + width
	control.offset_bottom = -distance_bottom


func _set_bottom_right(control: Control, distance_right: float, distance_bottom: float, width: float, height: float) -> void:
	control.set_anchors_preset(Control.PRESET_BOTTOM_RIGHT)
	control.offset_left = -distance_right - width
	control.offset_top = -distance_bottom - height
	control.offset_right = -distance_right
	control.offset_bottom = -distance_bottom


func _add_touch_spacer(parent: Control) -> void:
	var spacer := Control.new()
	spacer.custom_minimum_size = Vector2(72.0, 56.0)
	parent.add_child(spacer)


func _add_touch_button(parent: Control, label: String, action: String, button_size: Vector2 = Vector2(72.0, 56.0), emphasis: bool = false) -> void:
	var button := Button.new()
	button.text = label
	button.custom_minimum_size = button_size
	button.size = button_size
	button.focus_mode = Control.FOCUS_NONE
	var normal_color := Color(0.24, 0.12, 0.08, 0.94) if emphasis else Color(0.07, 0.10, 0.12, 0.92)
	var pressed_color := Color(0.48, 0.20, 0.10, 1.0) if emphasis else Color(0.19, 0.25, 0.27, 1.0)
	var border_color := Color(0.96, 0.60, 0.34, 0.82) if emphasis else Color(0.74, 0.78, 0.73, 0.46)
	button.add_theme_stylebox_override("normal", _touch_surface_style(normal_color, border_color, 8))
	button.add_theme_stylebox_override("hover", _touch_surface_style(normal_color.lightened(0.08), border_color, 8))
	button.add_theme_stylebox_override("pressed", _touch_surface_style(pressed_color, border_color.lightened(0.12), 8))
	button.add_theme_font_size_override("font_size", 17)
	button.button_down.connect(func() -> void:
		held_actions[action] = true
		_play_prototype_audio("select", true)
	)
	button.button_up.connect(func() -> void: held_actions[action] = false)
	parent.add_child(button)


func _update_hud() -> void:
	if status_label == null:
		return
	if pause_panel != null:
		pause_panel.visible = is_paused
	if defeat_panel != null:
		defeat_panel.visible = run_failed
	if inventory_panel != null:
		inventory_panel.visible = inventory_screen_open
	var objective_note := ""
	if run_failed:
		objective_note = "RUN LOST - RETRY ROUTE OR LOAD CHECKPOINT"
	elif is_paused:
		objective_note = "RUN PAUSED - RESUME WHEN READY"
	elif run_complete:
		objective_note = "RUN COMPLETE - RESET THE ROUTE TO REPLAY"
	elif not beacon_reached and signal_beacon != null:
		var beacon_distance := maxi(int(player.global_position.distance_to(signal_beacon.global_position)), 0)
		objective_note = "REACH THE SIGNAL BEACON   %dm" % beacon_distance
	elif infected != null:
		var infected_distance := maxi(int(player.global_position.distance_to(infected.global_position)), 0)
		objective_note = "NEUTRALIZE THE INFECTED   %dm" % infected_distance
	elif salvage_drop != null:
		var salvage_distance := maxi(int(player.global_position.distance_to(salvage_drop.global_position)), 0)
		objective_note = "COLLECT THE SALVAGE   %dm" % salvage_distance
	else:
		objective_note = "ROUTE SECURED"
	status_label.text = "OBJECTIVE\n%s" % objective_note
	health_label.text = "SURVIVOR   %d / %d" % [health, STARTING_HEALTH]
	if threat_label != null:
		threat_label.text = "THREAT CLEARED" if infected == null else "INFECTED   %d / 100   %s" % [infected_health, prototype_infected_brain.state().to_upper()]
	var weapon_status := "%s   MAG %d / %d   RES %d %s" % [prototype_weapon_state.active_mode().to_upper(), prototype_weapon_state.magazine_ammo(), prototype_weapon_state.magazine_capacity(), prototype_weapon_state.reserve_ammo(), prototype_weapon_state.ammo_type().to_upper()]
	if prototype_weapon_state.is_reloading():
		weapon_status += "   RELOADING %.1fs" % prototype_weapon_state.reload_remaining()
	inventory_label.text = "LOADOUT   %s   |   %s\n%s   |   SCRAP %d   MEDKITS %d" % [prototype_loadout.equipped_item_name("weapon", item_catalog), prototype_loadout.equipped_item_name("gear", item_catalog), weapon_status, inventory.get("scrap", 0), inventory.get("medkits", 0)]
	health_bar.value = health
	infected_bar.value = infected_health
	infected_bar.visible = infected != null


func _set_feedback(message: String, duration: float) -> void:
	if feedback_label == null:
		return
	feedback_label.text = message
	get_tree().create_timer(duration).timeout.connect(func() -> void:
		if feedback_label != null and feedback_label.text == message:
			feedback_label.text = ""
	)


func _load_save() -> bool:
	if not FileAccess.file_exists(SAVE_PATH):
		return false
	var parsed = JSON.parse_string(FileAccess.get_file_as_string(SAVE_PATH))
	if typeof(parsed) != TYPE_DICTIONARY:
		return false
	var schema_version := int(parsed.get("schema_version", 0))
	if schema_version < MIN_SUPPORTED_SAVE_SCHEMA or schema_version > SAVE_SCHEMA_VERSION:
		return false
	run_failed = false
	is_paused = false
	fire_buffer_timer = 0.0
	prototype_combat_motion.reset()
	prototype_combat_feedback.reset()
	prototype_player_animation.reset()
	prototype_infected_animation.reset()
	held_actions.clear()
	_reset_touch_controls()
	_remove_salvage_drop()
	pause_was_down = false
	fire_was_down = false
	switch_was_down = false
	reload_was_down = false
	health = clampi(int(parsed.get("health", STARTING_HEALTH)), 0, STARTING_HEALTH)
	infected_health = clampi(int(parsed.get("infected_health", 100)), 0, 100)
	beacon_reached = bool(parsed.get("beacon_reached", false))
	_reset_infected_behavior(beacon_reached)
	run_complete = false
	var saved_position = parsed.get("position", [])
	if saved_position is Array and saved_position.size() == 3 and player != null:
		player.position = Vector3(float(saved_position[0]), float(saved_position[1]), float(saved_position[2]))
	camera_yaw = float(parsed.get("camera_yaw", camera_yaw))
	var saved_inventory = parsed.get("inventory", {})
	if saved_inventory is Dictionary:
		for item in inventory.keys():
			inventory[item] = maxi(int(saved_inventory.get(item, inventory[item])), 0)
	prototype_loadout.restore(parsed.get("prototype_loadout", {}), item_catalog)
	prototype_weapon_state.initialize(_equipped_weapon_item(), int(inventory.get("ammo", 0)), parsed.get("prototype_weapon_state", {}))
	_sync_ammo_inventory()
	_apply_equipped_weapon_presentation()
	var saved_collected_pickups = parsed.get("collected_pickups", [])
	for pickup in pickups:
		pickup.visible = not (saved_collected_pickups is Array and saved_collected_pickups.has(pickup.name))
	salvage_drop_collected = bool(parsed.get("salvage_drop_collected", false))
	var saved_salvage_spawned := bool(parsed.get("salvage_drop_spawned", false))
	var saved_salvage_position = parsed.get("salvage_drop_position", [])
	if saved_salvage_spawned and not salvage_drop_collected and saved_salvage_position is Array and saved_salvage_position.size() == 3:
		_spawn_salvage_drop(Vector3(float(saved_salvage_position[0]), float(saved_salvage_position[1]), float(saved_salvage_position[2])))
	infected_knockback_timer = 0.0
	infected_knockback_velocity = Vector3.ZERO
	var infected_defeated := bool(parsed.get("infected_defeated", false))
	if infected_defeated:
		_defeat_infected(false, false)
		run_complete = bool(parsed.get("run_complete", false))
	else:
		_ensure_infected()
		var saved_infected_position = parsed.get("infected_position", [])
		if saved_infected_position is Array and saved_infected_position.size() == 3:
			infected.position = Vector3(float(saved_infected_position[0]), float(saved_infected_position[1]), float(saved_infected_position[2]))
		infected.velocity = Vector3.ZERO
	_update_camera(1.0)
	return true


func _save_game() -> bool:
	if player == null:
		return false
	_sync_ammo_inventory()
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		return false
	var collected_pickups: Array = []
	for pickup in pickups:
		if is_instance_valid(pickup) and not pickup.visible:
			collected_pickups.append(pickup.name)
	var infected_position: Array = []
	if infected != null and is_instance_valid(infected):
		infected_position = [infected.position.x, infected.position.y, infected.position.z]
	file.store_string(JSON.stringify({
		"schema_version": SAVE_SCHEMA_VERSION,
		"content_version": game_data.get("content_version", "unknown"),
		"health": health,
		"infected_health": infected_health,
		"infected_defeated": infected == null,
		"beacon_reached": beacon_reached,
		"run_complete": run_complete,
		"inventory": inventory,
		"prototype_loadout": prototype_loadout.to_save_data(),
		"prototype_weapon_state": prototype_weapon_state.to_save_data(),
		"position": [player.position.x, player.position.y, player.position.z],
		"camera_yaw": camera_yaw,
		"infected_position": infected_position,
		"collected_pickups": collected_pickups,
		"salvage_drop_spawned": salvage_drop != null and is_instance_valid(salvage_drop),
		"salvage_drop_collected": salvage_drop_collected,
		"salvage_drop_position": [salvage_drop_position.x, salvage_drop_position.y, salvage_drop_position.z],
	}))
	file.close()
	return true
