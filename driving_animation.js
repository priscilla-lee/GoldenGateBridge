 /**
 * Written by: Priscilla Lee
 * Course: CS 307, Fall 2017
 * Assignment: Final Project, Golden Gate Bridge
 * 
 * Animates the different vehicles, driving across the bridge.
 */
function animateDriving(scene, vehicles, path) {
	function _animateCars(vehicles) {
		for (var i = 0; i < vehicles.length; i++) {
			var vehicle = vehicles[i];
			vehicle.onRoad = false;
			vehicle.position.y = 50; // + 5; // Clearance + half vehicle height
			vehicle.position.x = -500;
		}

		scene.add(vehicles[0]);
		vehicles[0].onRoad = true;

		setInterval(function() {updateVehicles(vehicles);}, 50);
	}

	var spacing = 40;
	var timestep = 0;
	var dx = 2;

	function updateVehicles(vehicles) {
		timestep++;

		// Move all the cars that are already on the road.
		for (var i = 0; i < vehicles.length; i++) {
			var vehicle = vehicles[i];
			if (vehicle.onRoad) {
				vehicle.translateX(dx);	

				// "Cycle" to the back if drives past the end of the bridge.
				if (vehicle.position.x > 500) {
					scene.remove(vehicle);
					vehicle.onRoad = false;
					vehicle.position.x = -500;
					vehicles.shift();
					vehicles.push(vehicle);
				}
			}
		}

		// Every 10 "updates", add a new vehicle (if there is one). 
		if (timestep >= spacing) {
			timestep = 0;

			for (var i = 0; i < vehicles.length; i++) {
				if (!vehicles[i].onRoad) {
					var next = vehicles[i];
					scene.add(next);
					next.onRoad = true;
					break;
				}
			}
		}
	}

	_animateCars(vehicles);
}