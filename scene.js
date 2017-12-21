 /**
 * Written by: Priscilla Lee
 * Course: CS 307, Fall 2017
 * Assignment: Final Project, Golden Gate Bridge
 * 
 * Sets up the scene and adds the bridge, the road and cars, and the universe (sky, land, water).
 */

/* Create the road, given the path. */
function createRoad(bridgeDims, worldDims) {
  // Create the curve of the path (using bezier curves stringed together).
  var curve = new THREE.CurvePath();
  curve.add(new THREE.CubicBezierCurve3( // Left side
    new THREE.Vector3(-2000, 800, 0),
    new THREE.Vector3(-1600, 0, 0),
    new THREE.Vector3(-1600, 400, 0),
    new THREE.Vector3(-1200, 400, 0)
  ));
  curve.add(new THREE.CubicBezierCurve3(
    new THREE.Vector3(-1200, 400, 0),
    new THREE.Vector3(-1000, 400, 0),
    new THREE.Vector3(-800, 0, 0),
    new THREE.Vector3(-600, 0, 0)
  ));
  curve.add(new THREE.LineCurve3( // Across the bridge
    new THREE.Vector3(-600, 0, 0),
    new THREE.Vector3(600, 0, 0)
  ));
  curve.add(new THREE.CubicBezierCurve3( // Right side
    new THREE.Vector3(600, 0, 0),
    new THREE.Vector3(1200, 0, 0),
    new THREE.Vector3(1200, -300, 0),
    new THREE.Vector3(1200, -400, 0)
  ));
  curve.add(new THREE.CubicBezierCurve3(
    new THREE.Vector3(1200, -400, 0),
    new THREE.Vector3(1200, -700, 0),
    new THREE.Vector3(600, -600, 0),
    new THREE.Vector3(1600, -2000, 0)
  ));

  // Create the road as a tube (to be intersected with a flat surface).
  var surface = new THREE.CylinderGeometry(worldDims.radius, worldDims.radius, worldDims.road, 32);
  var tube = new THREE.TubeGeometry(curve, 64, bridgeDims.bridge.width*0.75/2, 16, false);
  tube.rotateX(Math.PI/2);

  // Use ThreeBSP and csg.js to get the intersection.
  surface = new ThreeBSP(surface);
  tube = new ThreeBSP(tube);
  var mat = new THREE.MeshPhongMaterial({color: "#dbdbaf" , side: THREE.DoubleSide});
  var road = surface.intersect(tube).toMesh(mat);
  road.position.y = bridgeDims.bridge.clearance;
  return road;
}

/* Create a textured sky (the inside of a half dome). */
function createSky(texture, worldDims) {
  texture.wrapS = THREE.MirroredRepeatWrapping; //horizontal
  texture.wrapT = THREE.MirroredRepeatWrapping; //vertical
  texture.repeat.set(2,1);
  texture.needsUpdate = true;

  var geom = new THREE.SphereGeometry(worldDims.radius, 32, 32, 0, 2*Math.PI, 0, Math.PI/2); 
  var mat = new THREE.MeshPhongMaterial({side: THREE.BackSide, map: texture});
  return new THREE.Mesh(geom, mat);
}

/* Create textured water. */
function createWater(texture, worldDims) {
  texture.wrapS = THREE.MirroredRepeatWrapping; //horizontal
  texture.wrapT = THREE.MirroredRepeatWrapping; //vertical
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;

  var geom = new THREE.CylinderGeometry(worldDims.radius, worldDims.radius, worldDims.depth, 32, 32);
  var mat = new THREE.MeshPhongMaterial({transparent: true, opacity: 0.5, side: THREE.DoubleSide, map: texture});
  var water = new THREE.Mesh(geom, mat);
  water.position.y = -worldDims.depth/2; 
  return water;
}

/* Create the 2 land masses on either side of the bridge. */
function createLand(worldDims) {
  /* Create a contiguous land mass, provided its shape. */
  function createMass(shape) {   
    // Extrude, position, and rotate.
    var thickness = worldDims.depth;
    var extrude = new THREE.ExtrudeGeometry(shape, {amount: thickness, bevelEnabled: false});
    extrude.translate(0, 0, -0.5 - thickness/2);
    extrude.rotateX(Math.PI/2);

    // Bound within sphere of the "world".
    var sphere = new THREE.SphereGeometry(worldDims.radius, 32, 32, 0, 2*Math.PI, 0, Math.PI/2);

    // Use ThreeBSP and csg.js to "punch out" the intersection.
    extrude = new ThreeBSP(extrude);
    sphere = new ThreeBSP(sphere);
    var mat = new THREE.MeshPhongMaterial({color: "#669900", side: THREE.DoubleSide});
    return extrude.intersect(sphere).toMesh(mat);
  }

  var land = new THREE.Object3D();

  // Left land mass (draw the outline using a spline curve).
  var left = new THREE.Shape();
  left.moveTo(-2000, 0);
  left.splineThru([
    new THREE.Vector2(-2000, 0),
    new THREE.Vector2(-1600, -300),
    new THREE.Vector2(-900, -400),
    new THREE.Vector2(-1000, -200),
    new THREE.Vector2(-400, 0),
    new THREE.Vector2(-600, 400),
    new THREE.Vector2(-400, 800),
    new THREE.Vector2(-600, 1600),
    new THREE.Vector2(0, 2000)
  ]);
  left.lineTo(-2000, 2000);
  land.add(createMass(left));

  // Right land mass (draw the outline using a spline curve).
  var right = new THREE.Shape();
  right.moveTo(400, -2000);
  right.splineThru([
    new THREE.Vector2(400, -2000),
    new THREE.Vector2(600, -1400),
    new THREE.Vector2(500, -1000),
    new THREE.Vector2(700, -400),
    new THREE.Vector2(400, 0),
    new THREE.Vector2(1600, 800),
    new THREE.Vector2(2000, 2000)
  ]);
  right.lineTo(2000, -2000); 
  land.add(createMass(right));

  return land;
}

/* Return an array of different types of vehicles. */
function createVehicles() {
  // Options for colors.
  var colors = [
    "black", "dimgrey", "darkslategrey", "lightslategrey", 
    "cadetblue", "darkcyan", "steelblue", "mediumpurple", 
    "olive", "seagreen", "darkgoldenrod", "orangered", "crimson"
  ];

  // Randomly generate a large number of vehicles.
  var num = 100; 
  var vehicles = [];

  for (var i = 0; i < num; i++) {
    var type = Math.random();
    var color = colors[Math.floor(Math.random()*colors.length)];

    if (type < 0.3) { // 30% hatchback
      vehicles.push(createHatchback(color));
    } else if (type < 0.6) { // 30% sedan
      vehicles.push(createSedan(color));
    } else if (type < 0.8) { // 20% van
      vehicles.push(createVan(color));
    } else if (type < 0.9) { // 10% truck
      vehicles.push(createTruck(color, "white"));
    } else { // 10% bus
      vehicles.push(createBus());
    }
  }

  return vehicles;
}

/* Create a scene, and add everything to it. */
function createScene() {
  var scene = new THREE.Scene();

  // Dimensions for the bridge itself (refer to the golden_gate_bridge for documentation).
  var bridgeDims = {
    bridge: {
      width: 40, length: 1000, height: 10,
      clearance: 50,
      total_span: 800, main_span: 500, side_span: 150 
    },
    tower: {
      height: 205, width: 8, depth: 12,
      above_roadway: 150, 
      top_section: 35, bottom_section: 50, 
      base: 6, bar: 10 
    }, 
    cable: {
      fat: 1, thin: 1/2, number: 50
    }
  };

  // Dimensions for the "world" (apart from the bridge).
  var worldDims = {
    radius: 2000, // radius of the "world" semisphere
    depth: 100, // depth of the water and thickness of the land masses
    road: 2 // road thickness
  };

  // Add the golden gate bridge.
  var bridge = createGoldenGate(bridgeDims);
  scene.add(bridge);

  // Add the road.
  var road = createRoad(bridgeDims, worldDims);
  scene.add(road);

  // Add vehicles driving across the bridge (and along the path).
  var path = new THREE.Path();
  path.moveTo(-2000, 800);
  path.bezierCurveTo(-1600, 0, -1600, 400, -1200, 400);
  path.bezierCurveTo(-1000, 400, -800, 0, -600, 0);
  path.lineTo(600, 0);
  path.bezierCurveTo(1200, 0, 1200, -300, 1200, -400);
  path.bezierCurveTo(1200, -700, 600, -600, 1600, -2000);
  var vehicles = createVehicles();
  animateDriving(scene, vehicles, path);

  // Add land.
  var land = createLand(worldDims);
  scene.add(land);

  // Add textured sky and water.
  TW.loadTextures(['sunset.jpg', 'water.png'], function(textures) {
    var sky = createSky(textures[0], worldDims);
    scene.add(sky);
    var water = createWater(textures[1], worldDims);
    scene.add(water);
  });

  // Add white ambient light.
  var ambientLight = new THREE.AmbientLight(TW.WHITE, 0.75);
  scene.add(ambientLight);

  // Add a white directional light.
  var directionalLight = new THREE.DirectionalLight(TW.WHITE, 0.25);
  directionalLight.position.set(1, 2, 3);
  scene.add(directionalLight);

  return scene;
}