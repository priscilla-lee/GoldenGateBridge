 /**
 * Written by: Priscilla Lee
 * Course: CS 307, Fall 2017
 * Assignment: Final Project, Golden Gate Bridge
 * 
 * Sets up the scene and camera (birds-eye view and first-person view).
 */

/* Create a scene, and add everything to it. */
function createScene() {
  var scene = new THREE.Scene();

  var bridgeDims = {
    bridge: {
      width: 40, length: 1000, height: 10,
      clearance: 50,
      total_span: 800,
      main_span: 500,
      side_span: 150 
    },
    tower: {
      height: 205, 
      above_roadway: 150, 
      width: 8, 
      depth: 12,
      top_section: 35, 
      bottom_section: 50, 
      base: 6, 
      bar: 10 
    }, 
    cable: {
      fat: 1, thin: 1/2, number: 50
    }
  };

  // Add the golden gate bridge.
  var bridge = createGoldenGate(bridgeDims);
  scene.add(bridge);

  var worldDims = {
    radius: 2000, // radius of the "world" semisphere
    depth: 100, // depth of the water and thickness of the land masses
    road: 2 // road thickness
  };

  /* Create the road, given the path. */
  function createRoad() {
    var road = new THREE.Object3D();
    var roadMat = new THREE.MeshPhongMaterial({color: "#c2c2a3", side: THREE.DoubleSide});

    // Left road path.
    var curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1960, 400, 0),
      new THREE.Vector3(-1600, 200, 0),
      new THREE.Vector3(-1200, 300, 0),
      new THREE.Vector3(-800, 0, 0),
      new THREE.Vector3(-700, 0, 0),
      new THREE.Vector3(-600, 0, 0)
    ]);
    // Add the road on top of the bridge.
    var tube1 = new THREE.TubeGeometry(curve1, 32, bridgeDims.bridge.width*0.75/2, 16, false);
    tube1.rotateX(Math.PI/2);
    tube1.translate(0, bridgeDims.bridge.clearance, 0);

    // Flat surface (instead of round tube).
    var surface1 = new THREE.BoxGeometry(4*worldDims.radius/5, worldDims.road, 850);
    surface1.translate(-6*worldDims.radius/10, bridgeDims.bridge.clearance, 0);

    // Use ThreeBSP and csg.js to get the intersection.
    tube1 = new ThreeBSP(tube1);
    surface1 = new ThreeBSP(surface1);
    var leftPath = surface1.intersect(tube1).toMesh(roadMat);
    road.add(leftPath);

    // Middle road path.
    var straight = new THREE.BoxGeometry(bridgeDims.bridge.length, worldDims.road, bridgeDims.bridge.width*0.75);
    var middlePath = new THREE.Mesh(straight, roadMat);
    middlePath.position.y = bridgeDims.bridge.clearance;
    road.add(middlePath);

    // Right road path.
    var curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(600, 0, 0),
      new THREE.Vector3(700, 0, 0),
      new THREE.Vector3(800, 0, 0),
      new THREE.Vector3(1200, -400, 0),
      new THREE.Vector3(1000, -800, 0),
      new THREE.Vector3(1300, -1520, 0)
    ]);
    // Add the road on top of the bridge.
    var tube2 = new THREE.TubeGeometry(curve2, 32, bridgeDims.bridge.width*0.75/2, 16, false);
    tube2.rotateX(Math.PI/2);
    tube2.translate(0, bridgeDims.bridge.clearance, 0);

    // Flat surface (instead of round tube).
    var surface2 = new THREE.BoxGeometry(4*worldDims.radius/5, worldDims.road, 3040);
    surface2.translate(+6*worldDims.radius/10, bridgeDims.bridge.clearance, 0);

    // Use ThreeBSP and csg.js to get the intersection.
    tube2 = new ThreeBSP(tube2);
    surface2 = new ThreeBSP(surface2);
    var rightPath = surface2.intersect(tube2).toMesh(roadMat);
    road.add(rightPath);    

    return road;
  }
  
  var road = createRoad();
  scene.add(road);

  // Add vehicles driving across the bridge (and along the path).
  var path = new THREE.Path();
  path.moveTo(-1960, 400);
  path.splineThru([
    new THREE.Vector2(-1960, 400),
    new THREE.Vector2(-1600, 200),
    new THREE.Vector2(-1200, 300),
    new THREE.Vector2(-800, 0),
    new THREE.Vector2(-700, 0),
    new THREE.Vector2(-600, 0)
  ]);
  path.lineTo(600, 0);
  path.splineThru([
    new THREE.Vector2(600, 0),
    new THREE.Vector2(700, 0),
    new THREE.Vector2(800, 0),
    new THREE.Vector2(1200, -400),
    new THREE.Vector2(1000, -800),
    new THREE.Vector2(1300, -1520)
  ]);
  var vehicles = createVehicles();
  animateDriving(scene, vehicles, path);

  /* Create the terrain, given the shape. */
  function createTerrain(shape) {   
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
    var terrain = extrude.intersect(sphere).toMesh(mat);
    return terrain;
  }

  // Left land mass
  var leftShape = new THREE.Shape();
  leftShape.moveTo(-2000, 0);
  leftShape.splineThru([
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
  leftShape.lineTo(-2000, 2000);
  var leftTerrain = createTerrain(leftShape);
  scene.add(leftTerrain);

  // Right land mass
  var rightShape = new THREE.Shape();
    rightShape.moveTo(400, -2000);
    rightShape.splineThru([
      new THREE.Vector2(400, -2000),
      new THREE.Vector2(600, -1400),
      new THREE.Vector2(500, -1000),
      new THREE.Vector2(700, -400),
      new THREE.Vector2(400, 0),
      new THREE.Vector2(1600, 800),
      new THREE.Vector2(2000, 2000)
    ]);
    rightShape.lineTo(2000, -2000); 
  var rightTerrain = createTerrain(rightShape);
  scene.add(rightTerrain);

  TW.loadTextures(['sunset.jpg', 'water.png'], function(textures) {
    // Sky
    textures[0].wrapS = THREE.MirroredRepeatWrapping; //horizontal
    textures[0].wrapT = THREE.MirroredRepeatWrapping; //vertical
    textures[0].repeat.set(2,1);
    textures[0].needsUpdate = true;
    var domeGeom = new THREE.SphereGeometry(worldDims.radius, 32, 32, 0, 2*Math.PI, 0, Math.PI/2); 
    var domeMat = new THREE.MeshPhongMaterial({color: "#ffffff", side: THREE.BackSide, map: textures[0]});
    var domeMesh = new THREE.Mesh(domeGeom, domeMat);
    scene.add(domeMesh);

    // Water 
    textures[1].wrapS = THREE.MirroredRepeatWrapping; //horizontal
    textures[1].wrapT = THREE.MirroredRepeatWrapping; //vertical
    textures[1].repeat.set(4, 4);
    textures[1].needsUpdate = true;
    var waterGeom = new THREE.CylinderGeometry(worldDims.radius, worldDims.radius, worldDims.depth, 32, 32);
    var waterMat = new THREE.MeshPhongMaterial({color: "cyan", transparent: true, opacity: 0.5, side: THREE.DoubleSide, map: textures[1]});
    var waterMesh = new THREE.Mesh(waterGeom, waterMat);
    waterMesh.position.y = -worldDims.depth/2; 
    scene.add(waterMesh);
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

function createScene2() {
  var scene = new THREE.Scene();

  // Add car.
  var car = createBus();
  scene.add(car);

  // Add white ambient light.
  var ambientLight = new THREE.AmbientLight(TW.WHITE, 0.75);
  scene.add(ambientLight);

  // Add a white directional light.
  var directionalLight = new THREE.DirectionalLight(TW.WHITE, 0.25);
  directionalLight.position.set(1, 2, 3);
  scene.add(directionalLight);

  return scene;
}

/* Sets up a bird's eye view of the golden gate bridges. Supports "orbit controls." */
function setupBirdsEyeView() {
  var scene = createScene();

  var renderer = new THREE.WebGLRenderer({antialias: true});
  TW.mainInit(renderer, scene, {parent: document.getElementById('birds_eye')} );

  // Camera setup
  var entireBridge = {
    minx: -1000, maxx: 1000,
    miny: -200, maxy: 200,
    minz: -100, maxz: 100
  };

  var tower = {
    minx: -100, maxx: 100,
    miny: 0, maxy: 200,
    minz: -100, maxz: 100
  };

  var vehicle = {
    minx: -14, maxx: 14,
    miny: 0, maxy: 14,
    minz: -5, maxz: 5
  }

  var state = TW.cameraSetup(renderer, scene, entireBridge);
  TW.render();

  birds_eye_render = TW.lastClickTarget.TW_state.render;

  setInterval(birds_eye_render, 50);
}

/* Sets up a first-person view of the golden gate bridges. Supports arrow keys (wasdrf and ijkl). */
function setupFPV() {
  var scene = createScene();

  var renderer = new THREE.WebGLRenderer({antialias: true});
  TW.mainInit(renderer, scene, {parent: document.getElementById('fpv')} );

  // Create camera (to be modified by later callbacks).
  var fov = 90; // in degrees (won't ever need to change)
  var aspectRatio = 600/500; // from dimensions of canvas, in html
  var near = 1; // arbitrarily small (so everything is visible)
  var far = 10000; // arbitrarily large (so everything is visible)
  var camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);

  camera.position.set(0, 0, 500); 
  camera.up.set(0, 1, 0);
  camera.lookAt(new THREE.Vector3(0, 0, 0)); // do this last
  camera.updateProjectionMatrix(); // then add this line
  renderer.render( scene, camera );

  var canvas = TW.lastClickTarget;
  var state = canvas.TW_state;
  state.render = function () { renderer.render(scene, camera); };

  fpv_render = function () { renderer.render(scene,camera);};
  TW.lastClickTarget.TW_state.render = fpv_render;

  setInterval(fpv_render, 50);

  document.addEventListener('keydown', onKeyDown);

  function onKeyDown(event) {
      switch (event.keyCode) {
          // Look around.
          case 73: camera.rotateX(+Math.PI/32); break; // i
          case 75: camera.rotateX(-Math.PI/32); break; // k
          case 74: camera.rotateY(+Math.PI/32); break; // j
          case 76: camera.rotateY(-Math.PI/32); break; // l

          // Move around.
          case 87: camera.translateZ(-10); break; // w 
          case 83: camera.translateZ(+10); break; // s
          case 65: camera.translateX(-10); break; // a
          case 68: camera.translateX(+10); break; // d
          case 82: camera.translateY(+10); break; // r
          case 70: camera.translateY(-10); break; // f

          // case 32: camera.translateZ(-10); break; // space
          // case 16: camera.translateZ(+10); break; // shift

          default: console.log("key " + event.keyCode + " is not handled");
      }

      camera.updateProjectionMatrix(); // then add this line
      renderer.render( scene, camera );
  }
}