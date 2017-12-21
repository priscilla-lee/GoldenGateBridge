 /**
 * Written by: Priscilla Lee
 * Course: CS 307, Fall 2017
 * Assignment: Final Project, Golden Gate Bridge
 * 
 * Animates the vehicles driving across the bridge.
 */

/**
 * Animate vehicles in a scene driving along a path. Vehicles drive forward
 * along the path (rotating as necessary), giving enough space in between 
 * each other. When a vehicle reaches the end of the road, it "cycles" through
 * and waits in a queue to re-enter the road.
 */
function animateDriving(scene, vehicles, path) {
	// Set up animation parameters.
	var front = 0.03; // front of the road
	var end = 0.91; // end of the road
	var spacing = 0.02; // distance in between vehicles
	var count = 0.00; // global counter to trigger new vehicle when >= spacing
	var delta_t = 0.0005; // how much to move each vehicle with every update
	var interval = 50; // how often the vehicles get updated

	/**
	 * Given a parameter t (range [0,1]), place the given vehicle at the corresponding
	 * position on the curve. Also rotate it along the tangent of the curve. 
	 */
	function moveVehicleTo(vehicle, t) {
		var point = path.getPoint(t);
		var tangent = path.getTangent(t);
		vehicle.position.set(point.x, 50 + 2, point.y); // clearance + road thickness
		vehicle.rotation.y = -Math.atan(tangent.y/tangent.x);
	}
		
	/* Drive a vehicle forward along the road or remove it once it reaches the end). */
	function driveVehicleForward(vehicle) {
		vehicle.t += delta_t;

		// Move the vehicle forward (or remove it).
		if (vehicle.t <= end) { 
			moveVehicleTo(vehicle, vehicle.t);
		} else { // Reached end of the road.
			scene.remove(vehicle);
			vehicles.push(vehicles.shift()); // Cycle vehicle to the "back" of the queue.
			vehicle.t = -1; 
		}
	}

	/* Grab the next off-road vehicle to add to the road. Return null if none. */
	function getNextVehicle() {
		for (var i = 0; i < vehicles.length; i++) {
			var vehicle = vehicles[i];
			if (vehicle.t == -1) {
				return vehicle;
			}
		}
		return null;
	}

	// All vehicles are off the road. Indicate this with a negative "t".
	for (var i = 0; i < vehicles.length; i++) {
		var vehicle = vehicles[i];
		vehicle.t = -1; // t indicates the vehicle's position on the curve.
		moveVehicleTo(vehicle, 0);
	}

	// Add very first vehicle.
	var first = vehicles[0];
	scene.add(first);
	first.t = front;

	// Update the vehicles every interval.
	setInterval(function() {
		count += delta_t;

		// Animate all the vehicles that are on the road.
		for (var i = 0; i < vehicles.length; i++) {
			var vehicle = vehicles[i];
			if (vehicle.t != -1) {
				driveVehicleForward(vehicle);
			}
		}

		// Add another vehicle if enough "space" on the road (using count & spacing).
		if (count > spacing) {
			count = 0.00; // reset
			var next = getNextVehicle();
			if (next != null) {
				next.t = front;
				scene.add(next);
			}
		} 
	}, interval); 
}