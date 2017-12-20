 /**
 * Written by: Priscilla Lee
 * Course: CS 307, Fall 2017
 * Assignment: Final Project, Golden Gate Bridge
 * 
 * Creates different types of vehicles.
 */

var windowMat = new THREE.MeshPhongMaterial({color: "#f2f2f2", transparent: true, opacity: 0.6, side: THREE.DoubleSide});

/* Create a wheel given its radius. Origin is at its center. */
function createWheel(radius) {
    var wheel = new THREE.Object3D();

    // Outer tire.
    var outerGeom = new THREE.CylinderGeometry(radius, radius, radius, 32);
    var outerMat = new THREE.MeshPhongMaterial({color: "#333333", side: THREE.DoubleSide});
    var outerMesh = new THREE.Mesh(outerGeom, outerMat);
    wheel.add(outerMesh);

    // Inner part.
    var innerGeom = new THREE.CylinderGeometry(radius*0.6, radius*0.6, radius*1.01, 32);
    var innerMat = new THREE.MeshPhongMaterial({color: "#cccccc", side: THREE.DoubleSide});
    var innerMesh = new THREE.Mesh(innerGeom, innerMat);
    wheel.add(innerMesh);

    wheel.rotateX(Math.PI/2);
    return wheel;
}

/* Create the front of the car (grille, headlights, bumper). Origin is at its center. */
function createFront(width, height) {
    var front = new THREE.Object3D();

    // Grille.
    var grilleMat = new THREE.MeshPhongMaterial({color: "#4d4d4d", side: THREE.DoubleSide});
    var grille = new THREE.Mesh(new THREE.PlaneGeometry(width/2, height/2), grilleMat);
    grille.position.y = height/8;
    front.add(grille);

    // Head lights.
    for (var side = -1; side <= 1; side += 2) {
        var lightMat = new THREE.MeshPhongMaterial({color: "white", side: THREE.DoubleSide});
        var light = new THREE.Mesh(new THREE.CircleGeometry(width/16, 32), lightMat);
        light.position.x = side * (width/2 - width/8);
        light.position.y = height/4;
        front.add(light);
    }

    // Bumper.
    var bumperMat = new THREE.MeshPhongMaterial({color: "#b3b3b3", side: THREE.DoubleSide});
    var bumper = new THREE.Mesh(new THREE.PlaneGeometry(width, height/4), bumperMat);
    bumper.position.y = -height/2 + height/8;
    front.add(bumper);

    return front;
}

/** 
 * Given the 2D shapes for a vehicle's side profile and window(s), create its body,
 * using an ExtrudeGeometry and PlaneGeometries. Origin is directly beneath its center.
 */
function createBody(profile, bodyMat, windows, windowMat) {
    var body = new THREE.Object3D();
    var width = 10;

    // Main body (given the side profile shape).
    var bodyGeom = new THREE.ExtrudeGeometry(profile, {amount: width, bevelEnabled: false});
    var bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
    bodyMesh.position.z = -width/2;
    body.add(bodyMesh);

    // Add each of the windows (on both sides of the car).
    for (var i = 0; i < windows.length; i++) {
        for (var side = -1; side <= 1; side += 2) {
            var wndw = new THREE.Mesh(new THREE.ShapeGeometry(windows[i]), windowMat);
            wndw.position.z = side * width/2 * 1.01; // to avoid glitching overlapping faces
            body.add(wndw);
        }        
    }
    return body;
}

/* Hatchback: width 10, length 24, height 9, origin directly beneath its center. */
function createHatchback(color) {
    var hatchback = new THREE.Object3D();
    var width = 10;

    // Create shapes of side profile and windows.
    var profile = new THREE.Shape();
    profile.moveTo(-12, 1);
    profile.lineTo(-12, 5);
    profile.lineTo(-9, 9);
    profile.lineTo(3, 9);
    profile.lineTo(7, 5);
    profile.lineTo(12, 5);
    profile.lineTo(12, 1);
    var window1 = new THREE.Shape(); // left
    window1.moveTo(-10, 5);
    window1.lineTo(-8, 8);
    window1.lineTo(-6, 8);
    window1.lineTo(-6, 5);
    var window2 = new THREE.Shape(); // middle
    window2.moveTo(-5, 5);
    window2.lineTo(-5, 8);
    window2.lineTo(-2, 8);
    window2.lineTo(-2, 5);
    var window3 = new THREE.Shape(); // right
    window3.moveTo(-1, 5);
    window3.lineTo(-1, 8);
    window3.lineTo(2, 8);
    window3.lineTo(5, 5);

    // Create the body, using the shapes.
    var bodyMat = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide});
    var body = createBody(profile, bodyMat, [window1, window2, window3], windowMat);
    hatchback.add(body);

    // Add windshield.
    var windshield = new THREE.Mesh(new THREE.PlaneGeometry(width*0.8, width*0.4), windowMat);
    windshield.rotateY(Math.PI/2);
    windshield.rotateX(-Math.PI/4);
    windshield.position.set(5.01, 7, 0);
    hatchback.add(windshield);

    // Add wheels (left and right, on both sides of the car).
    for (var xSide = -1; xSide <= 1; xSide += 2) {
        for (var zSide = -1; zSide <= 1; zSide += 2) {
            var wheel = createWheel(1.5);
            wheel.position.set(xSide*7.5, 1.5, zSide*width/2);
            hatchback.add(wheel);
        }
    }

    // Add the front.
    var front = createFront(10, 4);
    front.rotateY(Math.PI/2);
    front.position.set(12.01, 3, 0);
    hatchback.add(front);

    return hatchback;
}


/* Sedan: width 10, length 20, height 9, origin directly beneath its center. */
function createSedan(color) {
    var sedan = new THREE.Object3D();
    var width = 10;

    // Create shapes of side profile and windows.
    var profile = new THREE.Shape();
    profile.moveTo(-10, 1);
    profile.lineTo(-10, 5);
    profile.lineTo(-8, 5);
    profile.lineTo(-5, 9);
    profile.lineTo(1, 9);
    profile.lineTo(5, 5);
    profile.lineTo(10, 5);
    profile.lineTo(10, 1);
    var window1 = new THREE.Shape(); // left
    window1.moveTo(-6, 5);
    window1.lineTo(-4, 8);
    window1.lineTo(-4, 5);
    var window2 = new THREE.Shape(); // right
    window2.moveTo(-3, 5);
    window2.lineTo(-3, 8);
    window2.lineTo(0, 8);
    window2.lineTo(3, 5);

    // Create the body, using the shapes.
    var bodyMat = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide});
    var body = createBody(profile, bodyMat, [window1, window2], windowMat);
    sedan.add(body);

    // Add windshield.
    var windshield = new THREE.Mesh(new THREE.PlaneGeometry(width*0.8, width*0.4), windowMat);
    windshield.rotateY(Math.PI/2);
    windshield.rotateX(-Math.PI/4);
    windshield.position.set(3.01, 7, 0);
    sedan.add(windshield);

    // Add wheels (left and right, on both sides of the car).
    for (var xSide = -1; xSide <= 1; xSide += 2) {
        for (var zSide = -1; zSide <= 1; zSide += 2) {
            var wheel = createWheel(1.5);
            wheel.position.set(xSide*6.5, 1.5, zSide*width/2);
            sedan.add(wheel);
        }
    }

    // Add the front.
    var front = createFront(10, 4);
    front.rotateY(Math.PI/2);
    front.position.set(10.01, 3, 0);
    sedan.add(front);

    return sedan;
}


/* Van: width 10, length 22, height 11, origin directly beneath its center. */
function createVan(color) {
    var van = new THREE.Object3D();
    var width = 10;

    // Create shapes of side profile and windows.
    var profile = new THREE.Shape();
    profile.moveTo(-11, 1);
    profile.lineTo(-11, 11);
    profile.lineTo(3, 11);
    profile.lineTo(6, 6);
    profile.lineTo(11, 6);
    profile.lineTo(11, 1);
    var window1 = new THREE.Shape();
    window1.moveTo(-1, 6);
    window1.lineTo(-1, 10);
    window1.lineTo(2, 10);
    window1.lineTo(4, 6);

    // Create the body, using the shapes.
    var bodyMat = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide});
    var body = createBody(profile, bodyMat, [window1], windowMat);
    van.add(body);

    // Add windshield.
    var windshield = new THREE.Mesh(new THREE.PlaneGeometry(width*0.8, width*0.4), windowMat);
    windshield.rotateY(Math.PI/2);
    windshield.rotateX(-Math.PI/6);
    windshield.position.set(4.61, 8.5, 0);
    van.add(windshield);

    // Add wheels (left and right, on both sides of the car).
    for (var xSide = -1; xSide <= 1; xSide += 2) {
        for (var zSide = -1; zSide <= 1; zSide += 2) {
            var wheel = createWheel(2);
            wheel.position.set(xSide*7, 2, zSide*width/2);
            van.add(wheel);
        }
    }

    // Add the front.
    var front = createFront(10, 5);
    front.rotateY(Math.PI/2);
    front.position.set(11.01, 3.5, 0);
    van.add(front);

    return van;
}

/* Truck: width 10, length 28, height 14, origin directly beneath its center. */
function createTruck(color, cargoColor) {
    var truck = new THREE.Object3D();
    var width = 10;

    // Create shapes of side profile and windows.
    var profile = new THREE.Shape();
    profile.moveTo(-14, 2);
    profile.lineTo(-14, 3);
    profile.lineTo(6, 3);
    profile.lineTo(6, 12);
    profile.lineTo(10, 12);
    profile.lineTo(12, 7);
    profile.lineTo(14, 7);
    profile.lineTo(14, 2);
    var window1 = new THREE.Shape();
    window1.moveTo(7, 7);
    window1.lineTo(7, 11);
    window1.lineTo(9, 11);
    window1.lineTo(11, 7);

    // Create the body, using the shapes.
    var bodyMat = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide});
    var body = createBody(profile, bodyMat, [window1], windowMat);
    truck.add(body);

    // Add windshield.
    var windshield = new THREE.Mesh(new THREE.PlaneGeometry(width*0.8, width*0.4), windowMat);
    windshield.rotateY(Math.PI/2);
    windshield.rotateX(-Math.PI/8);
    windshield.position.set(11.11, 9.5, 0); // to avoid glitching overlapping faces
    truck.add(windshield);

    // Add cargo.
    var cargoGeom = new THREE.BoxGeometry(20, 11, width*0.9);
    var cargoMat = new THREE.MeshPhongMaterial({color: cargoColor, side: THREE.DoubleSide});
    var cargoMesh = new THREE.Mesh(cargoGeom, cargoMat);
    cargoMesh.position.set(-4, 8.5, 0);
    truck.add(cargoMesh);

    // Add wheels (left and right, on both sides of the car).
    for (var xSide = -1; xSide <= 1; xSide += 2) {
        for (var zSide = -1; zSide <= 1; zSide += 2) {
            var wheel = createWheel(2);
            wheel.position.set(xSide*10, 2, zSide*width/2);
            truck.add(wheel);
        }
    }

    // Add the front.
    var front = createFront(10, 5);
    front.rotateY(Math.PI/2);
    front.position.set(14.01, 4.5, 0);
    truck.add(front);

    return truck;
}

/* Bus: width 10, length 26, height 13, origin directly beneath its center. */
function createBus() {
    var bus = new THREE.Object3D();
    var color = "#ffbf00"; // always this iconic yellow color
    var width = 10;

    // Create shapes of side profile and windows.
    var profile = new THREE.Shape();
    profile.moveTo(-13, 2);
    profile.lineTo(-13, 13);
    profile.lineTo(8, 13);
    profile.lineTo(8, 7);
    profile.lineTo(13, 7);
    profile.lineTo(13, 2);
    var window1 = new THREE.Shape(); // left
    window1.moveTo(-12, 8);
    window1.lineTo(-12, 12);
    window1.lineTo(-8, 12);
    window1.lineTo(-8, 8);
    var window2 = new THREE.Shape(); // middle
    window2.moveTo(-7, 8);
    window2.lineTo(-7, 12);
    window2.lineTo(-3, 12);
    window2.lineTo(-3, 8);
    var window3 = new THREE.Shape(); // right
    window3.moveTo(-2, 8);
    window3.lineTo(-2, 12);
    window3.lineTo(2, 12);
    window3.lineTo(2, 8);
    var window4 = new THREE.Shape(); // door
    window4.moveTo(3, 3);
    window4.lineTo(3, 12);
    window4.lineTo(7, 12);
    window4.lineTo(7, 3);

    // Create the body, using the shapes.
    var bodyMat = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide});
    var body = createBody(profile, bodyMat, [window1, window2, window3, window4], windowMat);
    bus.add(body);

    // Add windshield.
    var windshield = new THREE.Mesh(new THREE.PlaneGeometry(width*0.8, width*0.4), windowMat);
    windshield.rotateY(Math.PI/2);
    windshield.position.set(8.01, 10, 0);
    bus.add(windshield);

    // Add wheels (left and right, on both sides of the car).
    for (var xSide = -1; xSide <= 1; xSide += 2) {
        for (var zSide = -1; zSide <= 1; zSide += 2) {
            var wheel = createWheel(2);
            wheel.position.set(xSide*10, 2, zSide*width/2);
            bus.add(wheel);
        }
    }

    // Add the front.
    var front = createFront(10, 5);
    front.rotateY(Math.PI/2);
    front.position.set(13.01, 4.5, 0);
    bus.add(front);

    // Add side stripes.
    for (var side = -1; side <= 1; side += 2) {
        var stripeMat = new THREE.MeshPhongMaterial({color: "#1a1a1a", side: THREE.DoubleSide});
        var topStripe = new THREE.Mesh(new THREE.PlaneGeometry(14, 0.75), stripeMat);
        topStripe.position.set(-5, 6.5, side*width/2*1.01);
        bus.add(topStripe);

        var botStripe = new THREE.Mesh(new THREE.PlaneGeometry(14, 0.75), stripeMat);
        botStripe.position.set(-5, 5, side*width/2*1.01);
        bus.add(botStripe);
    }

    return bus;
}

/* Return an array of different types of vehicles. */
function createVehicles() {
	var vehicles = [];
    vehicles.push(createHatchback("mediumorchid"));
    vehicles.push(createSedan("orange"));
    vehicles.push(createVan("turquoise"));
    vehicles.push(createTruck("chartreuse", "white"));
    vehicles.push(createBus());
    return vehicles;
}