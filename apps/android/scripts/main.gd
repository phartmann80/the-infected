extends Node3D

const DATA_PATH := "res://data/game_foundation.json"
const SAVE_PATH := "user://save_v1.json"
const SAVE_SCHEMA_VERSION := 1
const PLAYER_SPEED := 3.0
const INFECTED_SPEED := 1.15
const ATTACK_RANGE := 2.4
const ATTACK_DAMAGE := 25
const STARTING_HEALTH := 100

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
var held_actions: Dictionary = {}
var inventory: Dictionary = {"scrap": 0, "medkits": 1, "ammo": 6}
var pickups: Array[Node3D] = []
var status_label: Label
var health_label: Label
var inventory_label: Label
var feedback_label: Label


func _ready() -> void:
	_load_game_data()
	_build_world()
	_load_save()
	_build_touch_controls()
	_update_hud()


func _physics_process(delta: float) -> void:
	if player == null:
		return

	var movement := _movement_input()
	var direction := Vector3(movement.x, 0.0, movement.y).rotated(Vector3.UP, camera_yaw)
	player.velocity = direction * PLAYER_SPEED
	player.move_and_slide()

	if infected != null:
		_move_infected(delta)
	_collect_pickups()
	_handle_attack_input()
	_update_camera()

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
	mesh_instance.material_override = _material(color)
	actor.add_child(mesh_instance)

	var collision := CollisionShape3D.new()
	var shape := CapsuleShape3D.new()
	shape.height = 1.8
	shape.radius = 0.45
	collision.shape = shape
	actor.add_child(collision)

	if is_infected:
		mesh_instance.scale = Vector3(1.0, 1.15, 1.0)
	return actor


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
			_save_game()
			if health <= 0:
				health = STARTING_HEALTH
				player.position = Vector3(0.0, 1.0, 4.0)
				_set_feedback("You collapsed. The route resets.", 2.0)


func _handle_attack_input() -> void:
	var attack_down := Input.is_key_pressed(KEY_SPACE) or Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT) or bool(held_actions.get("attack", false))
	if attack_down and not attack_was_down:
		_try_attack()
	attack_was_down = attack_down


func _try_attack() -> void:
	if infected == null or attack_cooldown > 0.0:
		return
	attack_cooldown = 0.55
	var distance := player.global_position.distance_to(infected.global_position)
	if distance > ATTACK_RANGE:
		_set_feedback("Too far away.", 0.75)
		return
	infected_health = maxi(infected_health - ATTACK_DAMAGE, 0)
	_set_feedback("Hit confirmed. Infected health: %d" % infected_health, 0.9)
	if infected_health <= 0:
		_defeat_infected()


func _defeat_infected(award_salvage: bool = true) -> void:
	if infected == null:
		return
	var defeated := infected
	infected = null
	defeated.queue_free()
	if award_salvage:
		inventory["scrap"] = int(inventory.get("scrap", 0)) + 3
		_set_feedback("Threat neutralized. Salvage recovered: +3 scrap.", 3.0)
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


func _update_camera() -> void:
	if camera == null or player == null:
		return
	if held_actions.get("camera_left", false):
		camera_yaw -= 0.025
	if held_actions.get("camera_right", false):
		camera_yaw += 0.025
	var offset := Vector3(0.0, 3.4, 6.5).rotated(Vector3.UP, camera_yaw)
	camera.global_position = player.global_position + offset
	camera.look_at(player.global_position + Vector3(0.0, 0.9, 0.0), Vector3.UP)


func _build_touch_controls() -> void:
	var canvas := CanvasLayer.new()
	add_child(canvas)

	status_label = Label.new()
	status_label.position = Vector2(24.0, 20.0)
	status_label.add_theme_font_size_override("font_size", 20)
	canvas.add_child(status_label)

	health_label = Label.new()
	health_label.position = Vector2(24.0, 106.0)
	health_label.add_theme_font_size_override("font_size", 18)
	canvas.add_child(health_label)

	inventory_label = Label.new()
	inventory_label.position = Vector2(24.0, 138.0)
	inventory_label.add_theme_font_size_override("font_size", 18)
	canvas.add_child(inventory_label)

	feedback_label = Label.new()
	feedback_label.position = Vector2(24.0, 180.0)
	feedback_label.add_theme_color_override("font_color", Color("ffd2ae"))
	feedback_label.add_theme_font_size_override("font_size", 18)
	canvas.add_child(feedback_label)

	_add_touch_button(canvas, "▲", "up", Vector2(112.0, 500.0))
	_add_touch_button(canvas, "◀", "left", Vector2(24.0, 560.0))
	_add_touch_button(canvas, "▼", "down", Vector2(112.0, 560.0))
	_add_touch_button(canvas, "▶", "right", Vector2(200.0, 560.0))
	_add_touch_button(canvas, "⟲", "camera_left", Vector2(1020.0, 560.0))
	_add_touch_button(canvas, "⟳", "camera_right", Vector2(1120.0, 560.0))
	_add_touch_button(canvas, "ATTACK", "attack", Vector2(1000.0, 450.0))

	var instructions := Label.new()
	instructions.text = "WASD / touch to move   |   Space / ATTACK to strike   |   camera arrows to look"
	instructions.position = Vector2(24.0, 670.0)
	instructions.add_theme_font_size_override("font_size", 18)
	canvas.add_child(instructions)


func _add_touch_button(canvas: CanvasLayer, label: String, action: String, position: Vector2) -> void:
	var button := Button.new()
	button.text = label
	button.position = position
	button.size = Vector2(96.0 if action == "attack" else 72.0, 56.0)
	button.focus_mode = Control.FOCUS_NONE
	button.button_down.connect(func() -> void: held_actions[action] = true)
	button.button_up.connect(func() -> void: held_actions[action] = false)
	canvas.add_child(button)


func _update_hud() -> void:
	if status_label == null:
		return
	var renderer: String = String(ProjectSettings.get_setting("rendering/renderer/rendering_method", "unknown"))
	var renderer_note := "Renderer: %s" % renderer
	if renderer != "mobile":
		renderer_note += " | compatibility gate active"
	var threat_note := "Threat: defeated" if infected == null else "Threat: %d / 100" % infected_health
	status_label.text = "The Infected prototype\n%s\nData: %s\n%s" % [renderer_note, game_data.get("content_version", "unknown"), threat_note]
	health_label.text = "Health: %d / %d   |   Save schema: %d" % [health, STARTING_HEALTH, SAVE_SCHEMA_VERSION]
	inventory_label.text = "Inventory   Scrap: %d   Medkits: %d   Ammo: %d" % [inventory.get("scrap", 0), inventory.get("medkits", 0), inventory.get("ammo", 0)]


func _set_feedback(message: String, duration: float) -> void:
	if feedback_label == null:
		return
	feedback_label.text = message
	get_tree().create_timer(duration).timeout.connect(func() -> void:
		if feedback_label != null and feedback_label.text == message:
			feedback_label.text = ""
	)


func _load_save() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return
	var parsed = JSON.parse_string(FileAccess.get_file_as_string(SAVE_PATH))
	if typeof(parsed) != TYPE_DICTIONARY or int(parsed.get("schema_version", 0)) != SAVE_SCHEMA_VERSION:
		return
	health = clampi(int(parsed.get("health", STARTING_HEALTH)), 0, STARTING_HEALTH)
	infected_health = clampi(int(parsed.get("infected_health", 100)), 0, 100)
	var saved_position = parsed.get("position", [])
	if saved_position is Array and saved_position.size() == 3 and player != null:
		player.position = Vector3(float(saved_position[0]), float(saved_position[1]), float(saved_position[2]))
	var saved_inventory = parsed.get("inventory", {})
	if saved_inventory is Dictionary:
		for item in inventory.keys():
			inventory[item] = maxi(int(saved_inventory.get(item, inventory[item])), 0)
	if bool(parsed.get("infected_defeated", false)):
		_defeat_infected(false)


func _save_game() -> void:
	if player == null:
		return
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		return
	file.store_string(JSON.stringify({
		"schema_version": SAVE_SCHEMA_VERSION,
		"content_version": game_data.get("content_version", "unknown"),
		"health": health,
		"infected_health": infected_health,
		"infected_defeated": infected == null,
		"inventory": inventory,
		"position": [player.position.x, player.position.y, player.position.z],
	}))
