extends SceneTree

const InfectedBrainScript := preload("res://scripts/prototype_infected_brain.gd")


func _initialize() -> void:
	var brain := InfectedBrainScript.new()
	brain.reset(false)
	var dormant := brain.advance(0.1, 8.0, false)
	if brain.state() != InfectedBrainScript.STATE_DORMANT or float(dormant.get("speed_scale", -1.0)) != 0.0:
		_fail("Infected did not remain dormant outside proximity before objective activation.")
		return
	var alert := brain.advance(0.1, 5.5, false)
	if brain.state() != InfectedBrainScript.STATE_ALERT or not bool(alert.get("state_changed", false)):
		_fail("Proximity detection did not enter the readable alert state.")
		return
	brain.advance(InfectedBrainScript.ALERT_DURATION + 0.01, 5.0, false)
	if brain.state() != InfectedBrainScript.STATE_PURSUIT:
		_fail("Alert state did not advance into pursuit.")
		return
	var pursuit := brain.advance(0.1, 4.0, false)
	if float(pursuit.get("speed_scale", 0.0)) <= 0.0 or absf(float(pursuit.get("strafe_weight", 1.0))) > 0.221:
		_fail("Pursuit steering was not bounded and mobile-safe.")
		return
	var windup := brain.advance(0.1, 1.6, false)
	if brain.state() != InfectedBrainScript.STATE_WINDUP or not bool(windup.get("state_changed", false)):
		_fail("Attack range did not enter wind-up.")
		return
	brain.advance(InfectedBrainScript.WINDUP_DURATION * 0.25, 1.6, false)
	if brain.state_progress() < 0.24 or brain.state_progress() > 0.26:
		_fail("Wind-up did not expose deterministic progress for the attack telegraph.")
		return
	if brain.apply_stagger() != true or brain.state() != InfectedBrainScript.STATE_STAGGERED:
		_fail("Hit stagger did not interrupt the wind-up.")
		return
	var stagger_result := brain.advance(InfectedBrainScript.STAGGER_DURATION + 0.01, 1.6, false)
	if bool(stagger_result.get("attack_requested", false)) or brain.state() != InfectedBrainScript.STATE_PURSUIT:
		_fail("Interrupted wind-up incorrectly resolved damage after stagger.")
		return
	brain.advance(InfectedBrainScript.POST_STAGGER_GRACE + 0.01, 1.6, false)
	if brain.state() != InfectedBrainScript.STATE_WINDUP:
		_fail("Infected did not re-enter wind-up after the post-stagger grace window.")
		return
	var attack := brain.advance(InfectedBrainScript.WINDUP_DURATION + 0.01, 1.6, false)
	if not bool(attack.get("attack_requested", false)) or brain.state() != InfectedBrainScript.STATE_RECOVERY:
		_fail("Completed wind-up did not request one attack and enter recovery.")
		return
	var recovery := brain.advance(InfectedBrainScript.RECOVERY_DURATION + 0.01, 1.6, false)
	if bool(recovery.get("attack_requested", false)) or brain.state() != InfectedBrainScript.STATE_PURSUIT:
		_fail("Recovery did not return to pursuit without duplicate damage.")
		return
	brain.reset(false)
	var objective_alert := brain.advance(0.1, 12.0, true)
	if brain.state() != InfectedBrainScript.STATE_ALERT or not bool(objective_alert.get("state_changed", false)) or not brain.is_engaged():
		_fail("Objective activation did not wake the infected at distance.")
		return
	print("Android infected brain test passed: dormant, alert, pursuit, steering, wind-up, stagger interruption, recovery, and objective activation.")
	quit(0)


func _fail(message: String) -> void:
	push_error(message)
	quit(1)
