extends Node3D

const DATA_PATH := "res://data/game_foundation.json"
const SAVE_PATH := "user://save_v1.json"
const SAVE_SCHEMA_VERSION := 3
const MIN_SUPPORTED_SAVE_SCHEMA := 1
const PLAYER_SPEED := 3.0
const INFECTED_SPEED := 1.15
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
const SIGNAL_BEACON_REACH := 2.2
const INFECTED_COLOR := Color("8b9b73")

var game_data: Dictionary = {}
var player: CharacterBody3D
var infected: CharacterBody3D
var camera: Camera3D
var health := STARTING_HEALTH
var infected_health := 100
var damage_timer := 0.0
var attack_cooldown := 0.0
var save_timer := 0.0
var camera_yaw := 0.0
var attack_was_down := false
var medkit_was_down := false
var restart_was_down := false
var save_was_down := false
var load_was_down := false
var pause_was_down := false
var beacon_reached := false
var run_complete := false
var run_failed := false
var is_paused := false
var infected_knockback_timer := 0.0
var infected_knockback_velocity := Vector3.ZERO
var held_actions: Dictionary = {}
var inventory: Dictionary = {"scrap": 0, "medkits": 1, "ammo": 6}
var pickups: Array[Node3D] = []
var status_label: Label
var health_label: Label
var inventory_label: Label
var feedback_label: Label
var health_bar: ProgressBar
var infected_bar: ProgressBar
var player_weapon: MeshInstance3D
var infected_material: StandardMaterial3D
var hit_flash_timer := 0.0
var signal_beacon: Node3D
var signal_light: OmniLight3D
var environment_time := 0.0
var pause_panel: PanelContainer
var pause_resume_button: Button
var defeat_panel: PanelContainer


func _ready() -> void:
	_load_game_data()
	_build_world()
	_load_save()
	_build_touch_controls()
	_update_hud()


func _physics_process(delta: float) -> void:
	if player == null:
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
	player.velocity = direction * PLAYER_SPEED
	player.move_and_slide()
	if direction.length_squared() > 0.001:
		var target_yaw := atan2(-direction.x, -direction.z)
		player.rotation.y = lerp_angle(player.rotation.y, target_yaw, minf(delta * 10.0, 1.0))

	if infected != null:
		_move_infected(delta)
	_collect_pickups()
	_handle_attack_input()
	_handle_medkit_input()
	_handle_save_load_input()
	_handle_restart_input()
	_update_camera(delta)
	_update_combat_feedback(delta)
	_update_environment(delta)
	_update_objective()

	damage_timer = maxf(damage_timer - delta, 0.0)
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


func _build_world() -> void:
	var environment_root := Node3D.new()
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


func _build_pickup(parent: Node3D, kind: String, amount: int, position: Vector3, color: Color) -> void:
	var pickup := Node3D.new()
	pickup.name = "Pickup_%s" % kind
	pickup.position = position
	pickup.set_meta("kind", kind)
	pickup.set_meta("amount", amount)
	parent.add_child(pickup)

	var mesh_instance := MeshInstance3D.new()
	var mesh := BoxMesh.new()
	mesh.size = Vector3(0.45, 0.45, 0.45)
	mesh_instance.mesh = mesh
	mesh_instance.material_override = _material(color)
	pickup.add_child(mesh_instance)
	pickups.append(pickup)


func _build_actor(actor_name: String, position: Vector3, color: Color, is_infected: bool) -> CharacterBody3D:
	var actor := CharacterBody3D.new()
	actor.name = actor_name
	actor.position = position
	actor.set_meta("is_infected", is_infected)
	add_child(actor)

	var mesh_instance := MeshInstance3D.new()
	var mesh := CapsuleMesh.new()
	mesh.height = 1.8
	mesh.radius = 0.45
	mesh_instance.mesh = mesh
	var material := _material(color)
	mesh_instance.material_override = material
	actor.add_child(mesh_instance)

	var collision := CollisionShape3D.new()
	var shape := CapsuleShape3D.new()
	shape.height = 1.8
	shape.radius = 0.45
	collision.shape = shape
	actor.add_child(collision)

	if is_infected:
		mesh_instance.scale = Vector3(1.0, 1.15, 1.0)
		infected_material = material
	else:
		player_weapon = _build_weapon(actor)
	return actor


func _build_weapon(parent: Node3D) -> MeshInstance3D:
	var weapon := MeshInstance3D.new()
	var mesh := BoxMesh.new()
	mesh.size = Vector3(0.12, 0.12, 1.15)
	weapon.mesh = mesh
	weapon.material_override = _material(Color("c7b8a1"))
	weapon.position = Vector3(0.5, 0.2, -0.35)
	weapon.rotation_degrees = Vector3(0.0, -25.0, 35.0)
	parent.add_child(weapon)
	return weapon


func _material(color: Color) -> StandardMaterial3D:
	var material := StandardMaterial3D.new()
	material.albedo_color = color
	material.roughness = 0.9
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

	var touch := Vector2(
		float(held_actions.get("right", false)) - float(held_actions.get("left", false)),
		float(held_actions.get("down", false)) - float(held_actions.get("up", false)),
	)
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
	if distance > 1.8:
		infected.velocity = to_player.normalized() * INFECTED_SPEED
		infected.move_and_slide()
	else:
		infected.velocity = Vector3.ZERO
		if damage_timer <= 0.0:
			health = maxi(health - 10, 0)
			damage_timer = 1.0
			_set_feedback("The infected hit you.", 1.0)
			if health <= 0:
				run_failed = true
				player.velocity = Vector3.ZERO
				infected.velocity = Vector3.ZERO
				_set_feedback("You collapsed. Retry the route or load the last checkpoint.", 4.0)
			else:
				_save_game()


func _update_combat_feedback(delta: float) -> void:
	hit_flash_timer = maxf(hit_flash_timer - delta, 0.0)
	if infected_material == null:
		return
	infected_material.albedo_color = Color("ffbd86") if hit_flash_timer > 0.0 else INFECTED_COLOR


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
	if beacon_reached and infected == null:
		run_complete = true
		_set_feedback("Route secured. Run complete. Press R or RESET RUN to replay.", 4.0)
		_save_game()


func _handle_attack_input() -> void:
	var attack_down := Input.is_key_pressed(KEY_SPACE) or Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT) or bool(held_actions.get("attack", false))
	if attack_down and not attack_was_down:
		_try_attack()
	attack_was_down = attack_down


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


func _handle_pause_input() -> void:
	var pause_down := Input.is_key_pressed(KEY_P) or Input.is_key_pressed(KEY_ESCAPE)
	if pause_down and not pause_was_down:
		_toggle_pause()
	pause_was_down = pause_down


func _toggle_pause() -> void:
	is_paused = not is_paused
	held_actions.clear()
	pause_was_down = false
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
	damage_timer = 0.0
	attack_cooldown = 0.0
	save_timer = 0.0
	beacon_reached = false
	run_complete = false
	infected_knockback_timer = 0.0
	infected_knockback_velocity = Vector3.ZERO
	save_was_down = false
	load_was_down = false
	pause_was_down = false
	is_paused = false
	run_failed = false
	held_actions.clear()
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
	attack_cooldown = 0.55
	_play_attack_feedback()
	var distance := player.global_position.distance_to(infected.global_position)
	if distance > ATTACK_RANGE:
		_set_feedback("Too far away.", 0.75)
		return
	infected_health = maxi(infected_health - ATTACK_DAMAGE, 0)
	var knockback_direction := infected.global_position - player.global_position
	knockback_direction.y = 0.0
	if knockback_direction.length_squared() > 0.001:
		infected_knockback_velocity = knockback_direction.normalized() * INFECTED_KNOCKBACK_SPEED
		infected_knockback_timer = INFECTED_KNOCKBACK_DURATION
	hit_flash_timer = HIT_FLASH_DURATION
	_set_feedback("Hit confirmed. Threat staggered. Infected health: %d" % infected_health, 0.9)
	if infected_health <= 0:
		_defeat_infected()


func _play_attack_feedback() -> void:
	if player_weapon == null:
		return
	var tween := create_tween()
	tween.set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(player_weapon, "rotation_degrees", Vector3(-80.0, -25.0, 35.0), ATTACK_SWING_DURATION * 0.45)
	tween.tween_property(player_weapon, "rotation_degrees", Vector3(0.0, -25.0, 35.0), ATTACK_SWING_DURATION * 0.55)


func _defeat_infected(award_salvage: bool = true, persist_state: bool = true) -> void:
	if infected == null:
		return
	var defeated := infected
	infected = null
	defeated.queue_free()
	if award_salvage:
		inventory["scrap"] = int(inventory.get("scrap", 0)) + 3
		_set_feedback("Threat neutralized. Salvage recovered: +3 scrap.", 3.0)
	if persist_state:
		_save_game()


func _collect_pickups() -> void:
	for pickup in pickups:
		if not is_instance_valid(pickup) or not pickup.visible:
			continue
		if player.global_position.distance_to(pickup.global_position) > 1.35:
			continue
		var kind := String(pickup.get_meta("kind", "scrap"))
		var amount := int(pickup.get_meta("amount", 1))
		inventory[kind] = int(inventory.get(kind, 0)) + amount
		pickup.visible = false
		_set_feedback("Collected %s +%d." % [kind, amount], 1.5)
		_save_game()


func _update_camera(delta: float = 1.0) -> void:
	if camera == null or player == null:
		return
	if held_actions.get("camera_left", false):
		camera_yaw -= 0.025
	if held_actions.get("camera_right", false):
		camera_yaw += 0.025
	var offset := Vector3(0.0, 3.4, 6.5).rotated(Vector3.UP, camera_yaw)
	var target_position := player.global_position + offset
	var smoothing_weight := clampf(delta * CAMERA_SMOOTHING, 0.0, 1.0)
	camera.global_position = camera.global_position.lerp(target_position, smoothing_weight)
	camera.look_at(player.global_position + Vector3(0.0, 0.9, 0.0), Vector3.UP)


func _build_touch_controls() -> void:
	var canvas := CanvasLayer.new()
	add_child(canvas)
	var hud_root := Control.new()
	hud_root.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	hud_root.mouse_filter = Control.MOUSE_FILTER_PASS
	canvas.add_child(hud_root)

	status_label = Label.new()
	status_label.position = Vector2(24.0, 20.0)
	status_label.size = Vector2(560.0, 68.0)
	status_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	status_label.add_theme_font_size_override("font_size", 20)
	hud_root.add_child(status_label)

	health_label = Label.new()
	health_label.position = Vector2(24.0, 94.0)
	health_label.add_theme_font_size_override("font_size", 18)
	hud_root.add_child(health_label)
	health_bar = _build_progress_bar(hud_root, Vector2(24.0, 124.0), Color("d98263"))

	inventory_label = Label.new()
	inventory_label.position = Vector2(24.0, 154.0)
	inventory_label.add_theme_font_size_override("font_size", 18)
	hud_root.add_child(inventory_label)
	infected_bar = _build_progress_bar(hud_root, Vector2(24.0, 184.0), Color("9eb27e"))

	feedback_label = Label.new()
	feedback_label.position = Vector2(24.0, 214.0)
	feedback_label.size = Vector2(620.0, 46.0)
	feedback_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	feedback_label.add_theme_color_override("font_color", Color("ffd2ae"))
	feedback_label.add_theme_font_size_override("font_size", 18)
	hud_root.add_child(feedback_label)

	var dpad := GridContainer.new()
	dpad.columns = 3
	dpad.add_theme_constant_override("h_separation", 4)
	dpad.add_theme_constant_override("v_separation", 4)
	_set_bottom_left(dpad, 24.0, 26.0, 224.0, 176.0)
	hud_root.add_child(dpad)
	_add_touch_spacer(dpad)
	_add_touch_button(dpad, "▲", "up")
	_add_touch_spacer(dpad)
	_add_touch_button(dpad, "◀", "left")
	_add_touch_button(dpad, "▼", "down")
	_add_touch_button(dpad, "▶", "right")

	var action_panel := VBoxContainer.new()
	action_panel.add_theme_constant_override("separation", 8)
	_set_bottom_right(action_panel, 24.0, 26.0, 224.0, 300.0)
	hud_root.add_child(action_panel)
	_add_touch_button(action_panel, "MEDKIT", "medkit", Vector2(224.0, 48.0))
	_add_touch_button(action_panel, "ATTACK", "attack", Vector2(224.0, 58.0))
	var camera_row := HBoxContainer.new()
	camera_row.add_theme_constant_override("separation", 8)
	action_panel.add_child(camera_row)
	_add_touch_button(camera_row, "LOOK ◀", "camera_left", Vector2(108.0, 56.0))
	_add_touch_button(camera_row, "LOOK ▶", "camera_right", Vector2(108.0, 56.0))
	var save_load_row := HBoxContainer.new()
	save_load_row.add_theme_constant_override("separation", 8)
	action_panel.add_child(save_load_row)
	_add_touch_button(save_load_row, "SAVE", "save", Vector2(108.0, 48.0))
	_add_touch_button(save_load_row, "LOAD", "load", Vector2(108.0, 48.0))
	_add_touch_button(action_panel, "RESET RUN", "restart", Vector2(224.0, 48.0))

	var instructions := Label.new()
	instructions.text = "WASD / touch to move   |   Space / ATTACK to strike   |   H / MEDKIT   |   F5 / SAVE   |   F9 / LOAD   |   R / RESET RUN"
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
	_build_defeat_panel(hud_root)


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


func _add_touch_button(parent: Control, label: String, action: String, button_size: Vector2 = Vector2(72.0, 56.0)) -> void:
	var button := Button.new()
	button.text = label
	button.custom_minimum_size = button_size
	button.size = button_size
	button.focus_mode = Control.FOCUS_NONE
	button.button_down.connect(func() -> void: held_actions[action] = true)
	button.button_up.connect(func() -> void: held_actions[action] = false)
	parent.add_child(button)


func _update_hud() -> void:
	if status_label == null:
		return
	if pause_panel != null:
		pause_panel.visible = is_paused
	if defeat_panel != null:
		defeat_panel.visible = run_failed
	var renderer: String = String(ProjectSettings.get_setting("rendering/renderer/rendering_method", "unknown"))
	var renderer_note := "Renderer: %s" % renderer
	if renderer != "mobile":
		renderer_note += " | compatibility gate active"
	var threat_note := "Threat: defeated" if infected == null else "Threat: %d / 100" % infected_health
	var objective_note := ""
	if run_failed:
		objective_note = "RUN LOST - RETRY ROUTE or LOAD CHECKPOINT"
	elif is_paused:
		objective_note = "RUN PAUSED - press P, ESC, or RESUME to continue"
	elif run_complete:
		objective_note = "RUN COMPLETE — press R or RESET RUN to replay"
	elif not beacon_reached and signal_beacon != null:
		var beacon_distance := maxi(int(player.global_position.distance_to(signal_beacon.global_position)), 0)
		objective_note = "Objective: reach the signal beacon (%dm)" % beacon_distance
	elif infected != null:
		var infected_distance := maxi(int(player.global_position.distance_to(infected.global_position)), 0)
		objective_note = "Objective: neutralize the infected (%dm)" % infected_distance
	else:
		objective_note = "Objective complete — securing route"
	status_label.text = "The Infected prototype\n%s\nData: %s\n%s\n%s" % [renderer_note, game_data.get("content_version", "unknown"), threat_note, objective_note]
	health_label.text = "Health: %d / %d   |   Save schema: %d" % [health, STARTING_HEALTH, SAVE_SCHEMA_VERSION]
	inventory_label.text = "Inventory   Scrap: %d   Medkits: %d   Ammo: %d" % [inventory.get("scrap", 0), inventory.get("medkits", 0), inventory.get("ammo", 0)]
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
	held_actions.clear()
	pause_was_down = false
	health = clampi(int(parsed.get("health", STARTING_HEALTH)), 0, STARTING_HEALTH)
	infected_health = clampi(int(parsed.get("infected_health", 100)), 0, 100)
	beacon_reached = bool(parsed.get("beacon_reached", false))
	run_complete = false
	var saved_position = parsed.get("position", [])
	if saved_position is Array and saved_position.size() == 3 and player != null:
		player.position = Vector3(float(saved_position[0]), float(saved_position[1]), float(saved_position[2]))
	camera_yaw = float(parsed.get("camera_yaw", camera_yaw))
	var saved_inventory = parsed.get("inventory", {})
	if saved_inventory is Dictionary:
		for item in inventory.keys():
			inventory[item] = maxi(int(saved_inventory.get(item, inventory[item])), 0)
	var saved_collected_pickups = parsed.get("collected_pickups", [])
	for pickup in pickups:
		pickup.visible = not (saved_collected_pickups is Array and saved_collected_pickups.has(pickup.name))
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
		"position": [player.position.x, player.position.y, player.position.z],
		"camera_yaw": camera_yaw,
		"infected_position": infected_position,
		"collected_pickups": collected_pickups,
	}))
	file.close()
	return true
