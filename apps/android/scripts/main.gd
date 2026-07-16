extends Node3D

const DATA_PATH := "res://data/game_foundation.json"
const SAVE_PATH := "user://save_v1.json"
const SAVE_SCHEMA_VERSION := 1

var game_data: Dictionary = {}
var player: CharacterBody3D
var infected: CharacterBody3D
var camera: Camera3D
var health := 100
var damage_timer := 0.0
var save_timer := 0.0
var camera_yaw := 0.0
var held_actions: Dictionary = {}
var status_label: Label
var health_label: Label


func _ready() -> void:
	_load_game_data()
	_build_world()
	_load_save()
	_build_touch_controls()
	_update_hud()


func _physics_process(delta: float) -> void:
	if player == null or infected == null:
		return

	var movement := _movement_input()
	var direction := Vector3(movement.x, 0.0, movement.y).rotated(Vector3.UP, camera_yaw)
	player.velocity = direction * 3.0
	player.move_and_slide()

	_move_infected(delta)
	_update_camera()
	damage_timer = maxf(damage_timer - delta, 0.0)
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


func _build_actor(actor_name: String, position: Vector3, color: Color, is_infected: bool) -> CharacterBody3D:
	var actor := CharacterBody3D.new()
	actor.name = actor_name
	actor.position = position
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
		infected.velocity = to_player.normalized() * 1.15
		infected.move_and_slide()
	else:
		infected.velocity = Vector3.ZERO
		if damage_timer <= 0.0:
			health = maxi(health - 10, 0)
			damage_timer = 1.0
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
	var instructions := Label.new()
	instructions.text = "WASD / touch to move   |   hold camera arrows to look"
	instructions.position = Vector2(24.0, 670.0)
	instructions.add_theme_font_size_override("font_size", 18)
	canvas.add_child(instructions)

	_add_touch_button(canvas, "▲", "up", Vector2(112.0, 500.0))
	_add_touch_button(canvas, "◀", "left", Vector2(24.0, 560.0))
	_add_touch_button(canvas, "▼", "down", Vector2(112.0, 560.0))
	_add_touch_button(canvas, "▶", "right", Vector2(200.0, 560.0))
	_add_touch_button(canvas, "⟲", "camera_left", Vector2(1020.0, 560.0))
	_add_touch_button(canvas, "⟳", "camera_right", Vector2(1120.0, 560.0))


func _add_touch_button(canvas: CanvasLayer, label: String, action: String, position: Vector2) -> void:
	var button := Button.new()
	button.text = label
	button.position = position
	button.size = Vector2(72.0, 56.0)
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
	status_label.text = "The Infected prototype\n%s\nData: %s" % [renderer_note, game_data.get("content_version", "unknown")]
	health_label.text = "Health: %d   |   Save schema: %d" % [health, SAVE_SCHEMA_VERSION]


func _load_save() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return
	var parsed = JSON.parse_string(FileAccess.get_file_as_string(SAVE_PATH))
	if typeof(parsed) != TYPE_DICTIONARY or int(parsed.get("schema_version", 0)) != SAVE_SCHEMA_VERSION:
		return
	health = clampi(int(parsed.get("health", 100)), 0, 100)
	var saved_position = parsed.get("position", [])
	if saved_position is Array and saved_position.size() == 3 and player != null:
		player.position = Vector3(float(saved_position[0]), float(saved_position[1]), float(saved_position[2]))


func _save_game() -> void:
	if player == null:
		return
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		return
	file.store_string(JSON.stringify({
		"schema_version": SAVE_SCHEMA_VERSION,
		"health": health,
		"position": [player.position.x, player.position.y, player.position.z],
	}))
