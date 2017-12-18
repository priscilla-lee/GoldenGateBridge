 /**
 * Written by: Priscilla Lee
 * Course: CS 307, Fall 2017
 * Assignment: Final Project, Golden Gate Bridge
 * 
 * Animates the different cars, driving across the bridge.
 *
 * TO DO: clean up animation looping?
 */
function animateDriving(scene, cars) {
	function _animateCars(cars) {
		for (var i = 0; i < cars.length; i++) {
			var car = cars[i];
			car.onRoad = false;
			car.position.y = 50 + 5; // Clearance + half car height
			car.position.x = -500;
		}

		scene.add(cars[0]);
		cars[0].onRoad = true;

		setInterval(function() {updateCars(cars);}, 50);
	}

	var carSpacing = 40;
	var timestep = 0;
	var dx = 2;

	function updateCars(cars) {
		timestep++;

		// Move all the cars that are already on the road.
		for (var i = 0; i < cars.length; i++) {
			var car = cars[i];
			if (car.onRoad) {
				car.translateX(dx);	

				// "Cycle" to the back if drives past the end of the bridge.
				if (car.position.x > 500) {
					scene.remove(car);
					car.onRoad = false;
					car.position.x = -500;
					cars.shift();
					cars.push(car);
				}
			}
		}

		// Every 10 "updates", add a new car (if there is one). 
		if (timestep >= carSpacing) {
			timestep = 0;

			for (var i = 0; i < cars.length; i++) {
				if (!cars[i].onRoad) {
					var nextCar = cars[i];
					scene.add(nextCar);
					nextCar.onRoad = true;
					break;
				}
			}
		}
	}

	_animateCars(cars);
}