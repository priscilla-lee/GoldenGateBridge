 /**
 * Written by: Priscilla Lee
 * Course: CS 307, Fall 2017
 * Assignment: Final Project, Golden Gate Bridge
 * 
 * Creates different types of vehicles.
 */

function createCar(color) {
	var carGeom = new THREE.BoxGeometry(24, 12, 12);
	var carMat = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide});
	var carMesh = new THREE.Mesh(carGeom, carMat);
	return carMesh;
}

function createWheel(radius) {
    var geom = new THREE.CylinderGeometry(radius, radius, radius, 32 );
    var mat = new THREE.MeshPhongMaterial({color: "grey", side: THREE.DoubleSide});
    var wheel = new THREE.Mesh(geom, mat);
    wheel.rotateX(Math.PI/2);
    return wheel;
}

/* Hatchback: width 10, length 24, height 9. */
function createHatchback(color) {
    var hatchback = new THREE.Object3D();
    var width = 10;

    // Body of the car.
    var shape = new THREE.Shape();
    shape.moveTo(-12, 1);
    shape.lineTo(-12, 5);
    shape.lineTo(-9, 9);
    shape.lineTo(3, 9);
    shape.lineTo(7, 5);
    shape.lineTo(12, 5);
    shape.lineTo(12, 1);
    var bodyGeom = new THREE.ExtrudeGeometry(shape, {amount: width, bevelEnabled: false});
    var bodyMat = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide});
    var bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
    bodyMesh.position.z = -width/2;
    hatchback.add(bodyMesh);

    var windowMat = new THREE.MeshPhongMaterial({color: "white", side: THREE.DoubleSide});

    // Add window 0 (front window).
    var window0 = new THREE.Mesh(new THREE.PlaneGeometry(width*0.8, width*0.4), windowMat);
    window0.rotateY(Math.PI/2);
    window0.rotateX(-Math.PI/4);
    window0.position.x = 5.01; // to avoid glitching overlapping faces
    window0.position.y = 7.01;
    hatchback.add(window0);

    // For both sides of the car.
    for (side = -1; side <= 1; side += 2) {
        // Add window 1 (left).
        var shape1 = new THREE.Shape();
        shape1.moveTo(-10, 5);
        shape1.lineTo(-8, 8);
        shape1.lineTo(-6, 8);
        shape1.lineTo(-6, 5);
        var window1 = new THREE.Mesh(new THREE.ShapeGeometry(shape1), windowMat);
        window1.position.z = side * width/2 * 1.01; // to avoid glitching overlapping faces
        hatchback.add(window1);

        // Add window 2 (middle).
        var shape2 = new THREE.Shape();
        shape2.moveTo(-5, 5);
        shape2.lineTo(-5, 8);
        shape2.lineTo(-2, 8);
        shape2.lineTo(-2, 5);
        var window2 = new THREE.Mesh(new THREE.ShapeGeometry(shape2), windowMat);
        window2.position.z = side * width/2 * 1.01; // to avoid glitching overlapping faces
        hatchback.add(window2);

        // Add window 3 (right).
        var shape3 = new THREE.Shape();
        shape3.moveTo(-1, 5);
        shape3.lineTo(-1, 8);
        shape3.lineTo(2, 8);
        shape3.lineTo(5, 5);
        var window3 = new THREE.Mesh(new THREE.ShapeGeometry(shape3), windowMat);
        window3.position.z = side * width/2 * 1.01; // to avoid glitching overlapping faces
        hatchback.add(window3);

        // Add left and right wheels.
        for (s = -1; s <= 1; s += 2) {
            var wheel = createWheel(1.5);
            wheel.position.set(s*7.5, 1.5, side*width/2);
            hatchback.add(wheel);
        }
    }
    return hatchback;
}

/* Sedan: width 10, length 20, height 9. */
function createSedan(color) {
    var sedan = new THREE.Object3D();
    var width = 10;

    // Body of the car.
    var shape = new THREE.Shape();
    shape.moveTo(-10, 1);
    shape.lineTo(-10, 5);
    shape.lineTo(-8, 5);
    shape.lineTo(-5, 9);
    shape.lineTo(1, 9);
    shape.lineTo(5, 5);
    shape.lineTo(10, 5);
    shape.lineTo(10, 1);
    var bodyGeom = new THREE.ExtrudeGeometry(shape, {amount: width, bevelEnabled: false});
    var bodyMat = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide});
    var bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
    bodyMesh.position.z = -width/2;
    sedan.add(bodyMesh);

    var windowMat = new THREE.MeshPhongMaterial({color: "white", side: THREE.DoubleSide});

    // Add window 0 (front window).
    var window0 = new THREE.Mesh(new THREE.PlaneGeometry(width*0.8, width*0.4), windowMat);
    window0.rotateY(Math.PI/2);
    window0.rotateX(-Math.PI/4);
    window0.position.x = 3.01; // to avoid glitching overlapping faces
    window0.position.y = 7.01;
    sedan.add(window0);

    // For both sides of the car.
    for (side = -1; side <= 1; side += 2) {
        // Add window 1 (left).
        var shape1 = new THREE.Shape();
        shape1.moveTo(-6, 5);
        shape1.lineTo(-4, 8);
        shape1.lineTo(-4, 5);
        var window1 = new THREE.Mesh(new THREE.ShapeGeometry(shape1), windowMat);
        window1.position.z = side * width/2 * 1.01; // to avoid glitching overlapping faces
        sedan.add(window1);

        // Add window 2 (right).
        var shape2 = new THREE.Shape();
        shape2.moveTo(-3, 5);
        shape2.lineTo(-3, 8);
        shape2.lineTo(0, 8);
        shape2.lineTo(3, 5);
        var window2 = new THREE.Mesh(new THREE.ShapeGeometry(shape2), windowMat);
        window2.position.z = side * width/2 * 1.01; // to avoid glitching overlapping faces
        sedan.add(window2);

        // Add left and right wheels.
        for (s = -1; s <= 1; s += 2) {
            var wheel = createWheel(1.5);
            wheel.position.set(s*6.5, 1.5, side*width/2);
            sedan.add(wheel);
        }
    }
    return sedan;
}


/* Van: width 10, length 22, height 11. */
function createVan(color) {
    var van = new THREE.Object3D();
    var width = 10;

    // Body of the car.
    var shape = new THREE.Shape();
    shape.moveTo(-11, 1);
    shape.lineTo(-11, 11);
    shape.lineTo(3, 11);
    shape.lineTo(6, 6);
    shape.lineTo(11, 6);
    shape.lineTo(11, 1);
    var bodyGeom = new THREE.ExtrudeGeometry(shape, {amount: width, bevelEnabled: false});
    var bodyMat = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide});
    var bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
    bodyMesh.position.z = -width/2;
    van.add(bodyMesh);

    var windowMat = new THREE.MeshPhongMaterial({color: "white", side: THREE.DoubleSide});

    // Add window 0 (front window).
    var window0 = new THREE.Mesh(new THREE.PlaneGeometry(width*0.8, width*0.4), windowMat);
    window0.rotateY(Math.PI/2);
    window0.rotateX(-Math.PI/6);
    window0.position.x = 4.61; // to avoid glitching overlapping faces
    window0.position.y = 8.51;
    van.add(window0);

    // For both sides of the car.
    for (side = -1; side <= 1; side += 2) {
        // Add window 1 (side).
        var shape1 = new THREE.Shape();
        shape1.moveTo(-1, 6);
        shape1.lineTo(-1, 10);
        shape1.lineTo(2, 10);
        shape1.lineTo(4, 6);
        var window1 = new THREE.Mesh(new THREE.ShapeGeometry(shape1), windowMat);
        window1.position.z = side * width/2 * 1.01; // to avoid glitching overlapping faces
        van.add(window1);

        // Add left and right wheels.
        for (s = -1; s <= 1; s += 2) {
            var wheel = createWheel(2);
            wheel.position.set(s*7, 2, side*width/2);
            van.add(wheel);
        }
    }
    return van;
}


/* Truck: width 10, length 28, height 14. */
function createTruck(color) {
    var truck = new THREE.Object3D();
    var width = 10;

    // Body of the car.
    var shape = new THREE.Shape();
    shape.moveTo(-14, 2);
    shape.lineTo(-14, 3);
    shape.lineTo(6, 3);
    shape.lineTo(6, 12);
    shape.lineTo(10, 12);
    shape.lineTo(12, 7);
    shape.lineTo(14, 7);
    shape.lineTo(14, 2);
    var bodyGeom = new THREE.ExtrudeGeometry(shape, {amount: width, bevelEnabled: false});
    var bodyMat = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide});
    var bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
    bodyMesh.position.z = -width/2;
    truck.add(bodyMesh);

    // Cargo.
    var cargoGeom = new THREE.BoxGeometry(20, 11, width*0.9);
    var cargoMat = new THREE.MeshPhongMaterial({color: "white", side: THREE.DoubleSide});
    var cargoMesh = new THREE.Mesh(cargoGeom, cargoMat);
    cargoMesh.position.set(-4, 8.5, 0);
    truck.add(cargoMesh);

    var windowMat = new THREE.MeshPhongMaterial({color: "white", side: THREE.DoubleSide});

    // Add window 0 (front window).
    var window0 = new THREE.Mesh(new THREE.PlaneGeometry(width*0.8, width*0.4), windowMat);
    window0.rotateY(Math.PI/2);
    window0.rotateX(-Math.PI/8);
    window0.position.x = 11.11; // to avoid glitching overlapping faces
    window0.position.y = 9.51;
    truck.add(window0);

    // For both sides of the car.
    for (side = -1; side <= 1; side += 2) {
        // Add window 1 (side).
        var shape1 = new THREE.Shape();
        shape1.moveTo(7, 7);
        shape1.lineTo(7, 11);
        shape1.lineTo(9, 11);
        shape1.lineTo(11, 7);
        var window1 = new THREE.Mesh(new THREE.ShapeGeometry(shape1), windowMat);
        window1.position.z = side * width/2 * 1.01; // to avoid glitching overlapping faces
        truck.add(window1);

        // Add left and right wheels.
        for (s = -1; s <= 1; s += 2) {
            var wheel = createWheel(2);
            wheel.position.set(s*10, 2, side*width/2);
            truck.add(wheel);
        }
    }
    return truck;
}

/* Bus: width 10, length 26, height 13. */
function createBus(color) {
    var bus = new THREE.Object3D();
    var width = 10;

    // Body of the car.
    var shape = new THREE.Shape();
    shape.moveTo(-13, 2);
    shape.lineTo(-13, 13);
    shape.lineTo(8, 13);
    shape.lineTo(8, 7);
    shape.lineTo(13, 7);
    shape.lineTo(13, 2);
    var bodyGeom = new THREE.ExtrudeGeometry(shape, {amount: width, bevelEnabled: false});
    var bodyMat = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide});
    var bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
    bodyMesh.position.z = -width/2;
    bus.add(bodyMesh);

    var windowMat = new THREE.MeshPhongMaterial({color: "white", side: THREE.DoubleSide});

    // Add window 0 (front window).
    var window0 = new THREE.Mesh(new THREE.PlaneGeometry(width*0.8, width*0.4), windowMat);
    window0.rotateY(Math.PI/2);
    window0.position.x = 8.01; // to avoid glitching overlapping faces
    window0.position.y = 10;
    bus.add(window0);

    // For both sides of the car.
    for (side = -1; side <= 1; side += 2) {
        // Add window 1 (left).
        var shape1 = new THREE.Shape();
        shape1.moveTo(-12, 8);
        shape1.lineTo(-12, 12);
        shape1.lineTo(-8, 12);
        shape1.lineTo(-8, 8);
        var window1 = new THREE.Mesh(new THREE.ShapeGeometry(shape1), windowMat);
        window1.position.z = side * width/2 * 1.01; // to avoid glitching overlapping faces
        bus.add(window1);

        // Add window 2 (middle).
        var shape2 = new THREE.Shape();
        shape2.moveTo(-7, 8);
        shape2.lineTo(-7, 12);
        shape2.lineTo(-3, 12);
        shape2.lineTo(-3, 8);
        var window2 = new THREE.Mesh(new THREE.ShapeGeometry(shape2), windowMat);
        window2.position.z = side * width/2 * 1.01; // to avoid glitching overlapping faces
        bus.add(window2);

        // Add window 3 (right).
        var shape3 = new THREE.Shape();
        shape3.moveTo(-2, 8);
        shape3.lineTo(-2, 12);
        shape3.lineTo(2, 12);
        shape3.lineTo(2, 8);
        var window3 = new THREE.Mesh(new THREE.ShapeGeometry(shape3), windowMat);
        window3.position.z = side * width/2 * 1.01; // to avoid glitching overlapping faces
        bus.add(window3);

        // Add window 4 (door).
        var shape4 = new THREE.Shape();
        shape4.moveTo(3, 3);
        shape4.lineTo(3, 12);
        shape4.lineTo(7, 12);
        shape4.lineTo(7, 3);
        var window3 = new THREE.Mesh(new THREE.ShapeGeometry(shape4), windowMat);
        window3.position.z = side * width/2 * 1.01; // to avoid glitching overlapping faces
        bus.add(window3);

        // Add left and right wheels.
        for (s = -1; s <= 1; s += 2) {
            var wheel = createWheel(2);
            wheel.position.set(s*10, 2, side*width/2);
            bus.add(wheel);
        }
    }
    return bus;
}

function createVehicles() {
	var vehicles = [];
    vehicles.push(createHatchback("mediumorchid"));
    vehicles.push(createSedan("orange"));
    vehicles.push(createVan("turquoise"));
    vehicles.push(createTruck("chartreuse"));
    vehicles.push(createBus("yellow"));
    return vehicles;
}