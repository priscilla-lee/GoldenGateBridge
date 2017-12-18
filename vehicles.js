 /**
 * Written by: Priscilla Lee
 * Course: CS 307, Fall 2017
 * Assignment: Final Project, Golden Gate Bridge
 * 
 * Creates different types of vehicles.
 *
 * TO DO: add more vehicles (bus, truck)
 */

function createCar(color) {
	var carGeom = new THREE.BoxGeometry(20, 10, 10);
	var carMat = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide});
	var carMesh = new THREE.Mesh(carGeom, carMat);
	return carMesh;
}

function createVehicles() {
	var cars = [];
    cars.push(createCar("mediumorchid"));
    cars.push(createCar("yellow"));
    cars.push(createCar("orange"));
    cars.push(createCar("turquoise"));
    cars.push(createCar("chartreuse"));
    return cars;
}