 /**
 * Written by: Priscilla Lee
 * Course: CS 307, Fall 2017
 * Assignment: Final Project, Golden Gate Bridge
 * 
 * Sets up the scene and camera (birds-eye view and first-person view).
 * 
 * TO DO: fix the fpv controls (trackball?)
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
    road: {
      roadway: 40,
      sidewalk: 5, 
      curb: 2,
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
    radius: 2000,
    depth: 100
  };

  // Add the road on top of the bridge.
  var roadGeom = new THREE.BoxGeometry(bridgeDims.bridge.length, 1, bridgeDims.bridge.width*0.75);
  var roadMat = new THREE.MeshPhongMaterial({color: "#c2c2a3", side: THREE.DoubleSide});
  var roadMesh = new THREE.Mesh(roadGeom, roadMat);
  roadMesh.position.y = bridgeDims.bridge.clearance;
  scene.add(roadMesh);

  // Add vehicles driving across the bridge.
  // var vehicles = createVehicles();
  // animateDriving(scene, vehicles);


  // Create the terrain, given the shape.
  function createTerrain(shape) {   
    // Extrude, position, and rotate.
    var thickness = worldDims.depth;
    var extrude = new THREE.ExtrudeGeometry(shape, {amount: thickness, bevelEnabled: false});
    extrude.translate(0, 0, -thickness/3);
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
    var waterMat = new THREE.MeshPhongMaterial({color: "cyan", transparent: true, opacity: 0.6, side: THREE.DoubleSide, map: textures[1]});
    var waterMesh = new THREE.Mesh(waterGeom, waterMat);
    waterMesh.position.y = -worldDims.depth/2; 
    scene.add(waterMesh);
  });

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