 /**
 * Written by: Priscilla Lee
 * Course: CS 307, Fall 2017
 * Assignment: Final Project, Golden Gate Bridge
 * 
 * Sets up different views (birds-eye view and first-person view).
 */

/**
  * Sets up the default TW camera, controls, and keyboard callbacks. This function is 
  * purely for developing purposes (convenience of bounding box, keyboard callbacks, etc).
  */
function setupDefault(element) {  
  var scene = createScene();

  var renderer = new THREE.WebGLRenderer({antialias: true});
  TW.mainInit(renderer, scene, {parent: element} );

  // Bounding boxes
  var world = {
    minx: -2000, maxx: 2000,
    miny: 0, maxy: 2000,
    minz: -2000, maxz: 2000    
  }
  var bridge = {
    minx: -500, maxx: 500,
    miny: -100, maxy: 300,
    minz: -50, maxz: 50
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

  var state = TW.cameraSetup(renderer, scene, bridge);
  function animate() {
    requestAnimationFrame(animate);
    TW.render();
  }
  animate();
}

/* Sets up a bird's eye view of the scene (orbit controls). */
function setupBirdsEye(element) {
  var scene = createScene();
  var renderer = new THREE.WebGLRenderer({antialias: true});
  TW.mainInit(renderer, scene, {parent: element} );

  // Set up perspective camera.
  var fov = 45; // in degrees
  var aspectRatio = 600/500; // from dimensions of canvas, in html
  var near = 1; // arbitrarily small (so everything is visible)
  var far = 10000; // arbitrarily large (so everything is visible)
  var camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
  camera.position.set(750, 200, -250); // carefully selected position & rotation
  camera.rotation.set(-2.7, 1.2, 2.7);

  // Set up orbit controls.
  var controls = new THREE.OrbitControls(camera, element);
  controls.update();
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

/* Sets up a first-person view of the scene (flies along the path of the cars). */
function setupFPV(element) {
  var scene = createScene();
  var renderer = new THREE.WebGLRenderer({antialias: true});
  TW.mainInit(renderer, scene, {parent: element});

  // Set up perspective camera.
  var fov = 45; // in degrees
  var aspectRatio = 600/500; // from dimensions of canvas, in html
  var near = 1; // arbitrarily small (so everything is visible)
  var far = 10000; // arbitrarily large (so everything is visible)
  var camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);

  // Create a path for the camera to travel along (same as path for road & cars).
  var path = new THREE.Path();
  path.moveTo(-2000, 800);
  path.bezierCurveTo(-1600, 0, -1600, 400, -1200, 400);
  path.bezierCurveTo(-1000, 400, -800, 0, -600, 0);
  path.lineTo(600, 0);
  path.bezierCurveTo(1200, 0, 1200, -300, 1200, -400);
  path.bezierCurveTo(1200, -700, 600, -600, 1600, -2000);

  /* Moves camera to given position t (range [0,1]) along the path. */
  var forward = true;
  function moveCameraTo(t) {
    var point = path.getPoint(t);
    var tangent = path.getTangent(t);

    camera.position.set(point.x, 50 + 2 + 15, point.y);

    if (forward) { // Look forward.
     camera.lookAt(new THREE.Vector3(point.x + tangent.x, 50 + 2 + 15, point.y + tangent.y));
    } else { // Look backward.
     camera.lookAt(new THREE.Vector3(point.x - tangent.x, 50 + 2 + 15, point.y - tangent.y));      
    }
  }

  // Animate the camera.
  var position = 0;
  function animate() {
    requestAnimationFrame(animate);
    moveCameraTo(position);
    position += 0.0003; // Camera moves slower than cars.
    if (position > 0.92) {
      position = 0.03;
    }
    renderer.render(scene, camera);
  }
  animate();

  // Let user click to toggle looking forward and backward.
  element.addEventListener('click', onMouseClick);
  function onMouseClick(event) {
    forward = !forward; // toggle
  }
}

// setupDefault(document.getElementById('birds_eye'));
setupBirdsEye(document.getElementById('birds_eye'));
setupFPV(document.getElementById('fpv'));

