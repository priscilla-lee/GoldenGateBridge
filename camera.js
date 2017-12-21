 /**
 * Written by: Priscilla Lee
 * Course: CS 307, Fall 2017
 * Assignment: Final Project, Golden Gate Bridge
 * 
 * Sets up different views (birds-eye view and first-person view).
 */

/* Sets up a bird's eye view of the scene (orbit controls). */
function setupBirdsEye() {
  var scene = createScene();
  var renderer = new THREE.WebGLRenderer({antialias: true});
  TW.mainInit(renderer, scene, {parent: document.getElementById('birds_eye')} );

  // Set up perspective camera.
  var fov = 45; // in degrees
  var aspectRatio = 600/500; // from dimensions of canvas, in html
  var near = 1; // arbitrarily small (so everything is visible)
  var far = 10000; // arbitrarily large (so everything is visible)
  var camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
  camera.position.set(0, 20, 100);

  // Set up orbit controls.
  var controls = new THREE.OrbitControls(camera);
  controls.update();
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

/* Sets up a first-person view of the golden gate bridges. Supports arrow keys (wasdrf and ijkl). */
function setupFPV() {
  var scene = createScene();

  var renderer = new THREE.WebGLRenderer({antialias: true});
  TW.mainInit(renderer, scene, {parent: document.getElementById('fpv')} );

  // Create camera (to be modified by later callbacks).
  var fov = 45; // in degrees (won't ever need to change)
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

setupBirdsEye();
// setupFPV();