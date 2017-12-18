/**
 * Written by: Priscilla Lee
 * Course: CS 307, Fall 2017
 * Assignment: Final Project, Golden Gate Bridge
 * 
 * Creates the Golden Gate Bridge.
 *
 * References
 * Bridge structure: http://sitescan.net/wp-content/uploads/2017/05/GoldenGateV1.jpg 
 * Bridge towers: https://i.pinimg.com/736x/7e/96/68/7e9668e32fe261783d963d9c5a2635d7--bridge-structure-technical-drawings.jpg
 *
 * TO DO: fix the cable curves (at edges of top of tower)
 * TO DO: view from inside the car?
 */

var roadMat = new THREE.MeshPhongMaterial({color: "gray", side: THREE.DoubleSide});
var bridgeMat = new THREE.MeshPhongMaterial({color: "red", side: THREE.DoubleSide});
var cableMat = new THREE.MeshPhongMaterial({color: "red", side: THREE.DoubleSide});
var landMat = new THREE.MeshPhongMaterial({color: "#7ebc74", side: THREE.DoubleSide});
var waterMat = new THREE.MeshPhongMaterial({color: "cyan", transparent: true, opacity: 0.5});
var devMat = new THREE.MeshPhongMaterial({color: "yellow", side: THREE.DoubleSide});

/* Origin: below the center of the bridge, at water level. */
function createGoldenGate(dimensions) {
	var dims;

	if (dimensions != null) {
		dims = dimensions;
	} else {
		// Default realistic dimensions (http://goldengatebridge.org/research/factsGGBDesign.php)
		dims = {
			bridge: {
				width: 28, length: 2738, height: 8,
				clearance: 67, // height clearance above water
				total_span: 1966, // total length of suspension span
				main_span: 1280, // length of main suspension span (between towers)
				side_span: 343 // length on either side of towers
			}, 
			road: {
				roadway: 19, // width of roadway
				sidewalk: 3, // width of each sidewalk
				curb: 1.5, // width of each curb
			},
			tower: {
				height: 227, // total height of tower
				above_roadway: 152, // height above roadway
				width: 10, // width of tower base (leg)
				depth: 16, // depth of tower base (leg)
				top_section: 40, // heights of the top 3 sections
				bottom_section: 50, // heights of the bottom 2 sections
				base: 7, // height of the tower's base
				bar: 10 // height of the 4 bars
			}, 
			cable: {
				fat: 0.92, // radius of main, fat cable
				thin: 0.92/2, // radius of thinner cables
				number: 100 // number of vertical cables
			}
		};
	}

	/* Origin: at the center of the road's surface. */
	function createBridge(dims) {
		var road = new THREE.Object3D();

		// Road surface
		var surfaceGeom = new THREE.BoxGeometry(dims.bridge.length, 1, dims.bridge.width);
		var surfaceMesh = new THREE.Mesh(surfaceGeom, roadMat);
		road.add(surfaceMesh);

		// Support underneath
		var supportGeom = new THREE.BoxGeometry(dims.bridge.length, dims.bridge.height, dims.bridge.width);
		var supportMesh = new THREE.Mesh(supportGeom, bridgeMat);
		supportMesh.position.y = -dims.bridge.height/2;
		road.add(supportMesh);

		return road;
	}

	/* Origin below the center of the tower. */
	function createTower(dims) {

		/* Origin at the bottom of the leg. */
		function createLeg(dims) {
			var leg = new THREE.Object3D();

			// Pull out dimensions
			var width = dims.tower.width;
			var depth = dims.tower.depth;

			// Base
			var baseHeight = dims.tower.base;
			var baseGeom = new THREE.BoxGeometry(width*1.5, baseHeight, depth*1.5);
			var baseMesh = new THREE.Mesh(baseGeom, bridgeMat);
			baseMesh.position.y = baseHeight/2;
			leg.add(baseMesh);

			// Main pillar
			var mainHeight = dims.tower.height - dims.tower.top_section;
			var mainGeom = new THREE.BoxGeometry(width, mainHeight, depth);
			var mainMesh = new THREE.Mesh(mainGeom, bridgeMat);
			mainMesh.position.y = baseHeight + mainHeight/2;
			leg.add(mainMesh);

			// Top section
			var topHeight = dims.tower.top_section;
			var topGeom = new THREE.BoxGeometry(width*0.75, topHeight, depth*0.75);
			var topMesh = new THREE.Mesh(topGeom, bridgeMat);
			topMesh.position.y = baseHeight + mainHeight + topHeight/2;
			leg.add(topMesh);

			// Thin strip (front and back)
			for (var side = -1; side <= 1; side += 2) {
				var thinHeight = dims.tower.top_section + 2 * dims.tower.bottom_section;
				var thinGeom = new THREE.BoxGeometry(width/3, thinHeight, depth/3);
				var thinMesh = new THREE.Mesh(thinGeom, bridgeMat);
				thinMesh.position.y = baseHeight + thinHeight/2;
				thinMesh.position.z = side * depth/2;
				leg.add(thinMesh);
			}

			// Fat strip (left and right)
			for (var side = -1; side <= 1; side += 2) {
				var fatHeight = dims.tower.top_section + 2 * dims.tower.bottom_section;
				var fatGeom = new THREE.BoxGeometry(depth/3, fatHeight, width/3);
				var fatMesh = new THREE.Mesh(fatGeom, bridgeMat);
				fatMesh.position.y = baseHeight + fatHeight/2;
				fatMesh.rotation.y = Math.PI/2;
				fatMesh.position.x = side * width/2;
				leg.add(fatMesh);
			}

			return leg;
		}

		var tower = new THREE.Object3D();

		// 2 legs
		for (var side = -1; side <= 1; side += 2) {
			var leg = createLeg(dims);
			leg.position.x = side * dims.bridge.width/2;
			tower.add(leg);
		}

		// Top bar
		var bar1Geom = new THREE.BoxGeometry(dims.bridge.width, dims.tower.bar, dims.tower.depth*0.75*0.75);
		var bar1Mesh = new THREE.Mesh(bar1Geom, bridgeMat);
		bar1Mesh.position.y = dims.tower.base + 3 * dims.tower.top_section + 2 * dims.tower.bottom_section;
		tower.add(bar1Mesh);

		// 2nd bar
		var bar2Geom = new THREE.BoxGeometry(dims.bridge.width, dims.tower.bar, dims.tower.depth*0.75);
		var bar2Mesh = new THREE.Mesh(bar2Geom, bridgeMat);
		bar2Mesh.position.y = dims.tower.base + 2 * dims.tower.top_section + 2 * dims.tower.bottom_section;
		tower.add(bar2Mesh);

		// 3rd bar
		var bar3Geom = new THREE.BoxGeometry(dims.bridge.width, dims.tower.bar, dims.tower.depth*0.75);
		var bar3Mesh = new THREE.Mesh(bar3Geom, bridgeMat);
		bar3Mesh.position.y = dims.tower.top_section + 2 * dims.tower.bottom_section;
		tower.add(bar3Mesh);

		// 4th bar
		var bar4Geom = new THREE.BoxGeometry(dims.bridge.width, dims.tower.bar, dims.tower.depth*0.75);
		var bar4Mesh = new THREE.Mesh(bar4Geom, bridgeMat);
		bar4Mesh.position.y = 2 * dims.tower.bottom_section - dims.tower.base;
		tower.add(bar4Mesh);

		return tower;
	}

	/* Origin below the center of the cables, at water level. */
	function createCables(dims) {
		var cables = new THREE.Object3D();

		// Thick "curvy" cables.
		for (var side = -1; side <= 1; side += 2) {
			// Middle portion
			var middleCurve = new THREE.CubicBezierCurve3(
				new THREE.Vector3(-dims.bridge.main_span/2, dims.tower.height + dims.tower.base, 0),
				new THREE.Vector3(0, dims.bridge.clearance, 0),
				new THREE.Vector3(0, dims.bridge.clearance, 0),
				new THREE.Vector3(+dims.bridge.main_span/2, dims.tower.height + dims.tower.base, 0)
			);
			var middleGeom = new THREE.TubeGeometry(middleCurve, 128, dims.cable.fat, 64);
			var middleMesh = new THREE.Mesh(middleGeom, cableMat);
			middleMesh.position.z = side * dims.bridge.width/2; 
			cables.add(middleMesh);

			// Left portion
			var leftCurve = new THREE.CubicBezierCurve3(
				new THREE.Vector3(-dims.bridge.main_span/2, dims.tower.height + dims.tower.base, 0),
				new THREE.Vector3(-dims.bridge.main_span/2*1.05, dims.tower.height*0.95, 0), // arbitrary curve
				new THREE.Vector3(-dims.bridge.total_span/2*0.95, dims.bridge.clearance*1.05, 0), // arbitrary curve
				new THREE.Vector3(-dims.bridge.total_span/2, dims.bridge.clearance, 0)
			);
			var leftGeom = new THREE.TubeGeometry(leftCurve, 128, dims.cable.fat, 64);
			var leftMesh = new THREE.Mesh(leftGeom, cableMat);
			leftMesh.position.z = side * dims.bridge.width/2; 
			cables.add(leftMesh);

			// Right portion
			var rightCurve = new THREE.CubicBezierCurve3(
				new THREE.Vector3(dims.bridge.main_span/2, dims.tower.height + dims.tower.base, 0),
				new THREE.Vector3(dims.bridge.main_span/2*1.05, dims.tower.height*0.95, 0), // arbitrary curve
				new THREE.Vector3(dims.bridge.total_span/2*0.95, dims.bridge.clearance*1.05, 0), // arbitrary curve
				new THREE.Vector3(dims.bridge.total_span/2, dims.bridge.clearance, 0)
			);
			var rightGeom = new THREE.TubeGeometry(rightCurve, 128, dims.cable.fat, 64);
			var rightMesh = new THREE.Mesh(rightGeom, cableMat);
			rightMesh.position.z = side * dims.bridge.width/2; 
			cables.add(rightMesh);
		}

		// Thin vertical cables.
		for (var side = -1; side <= 1; side += 2) {
			var verticalCables = new THREE.Object3D();

			// Uniform vertical cables
			for (var i = 0; i < dims.cable.number; i++) {
				var height = dims.tower.height - dims.bridge.clearance;
				var geom = new THREE.CylinderGeometry(dims.cable.thin, dims.cable.thin, height);
				var mesh = new THREE.Mesh(geom, cableMat);
				mesh.position.x = i * dims.bridge.total_span/dims.cable.number;
				mesh.position.y = height/2 + dims.bridge.clearance;
				mesh.position.z = side * dims.bridge.width/2;
				verticalCables.add(mesh);
			}
			verticalCables.position.x = -dims.bridge.total_span/2;
			cables.add(verticalCables);

			// Middle cutout
			var middleShape = new THREE.Shape();
			middleShape.moveTo(-dims.bridge.main_span/2, dims.tower.height + dims.tower.base);
			middleShape.bezierCurveTo(0, dims.bridge.clearance, 
									  0, dims.bridge.clearance, 
									  +dims.bridge.main_span/2, dims.tower.height + dims.tower.base);
			var thickness = dims.bridge.width + 2*dims.cable.thin;
			var middleGeom = new THREE.ExtrudeGeometry(middleShape, {amount: thickness, bevelEnabled: false});
			var middleMesh = new THREE.Mesh(middleGeom, devMat);
			middleMesh.position.z = -thickness/2;
			
			cables.add(middleMesh);
		}

		return cables;
	}

	/* Build the golden gate as a composition of its components. */
	var goldenGate = new THREE.Object3D();

	//Road
	var bridge = createBridge(dims);
	bridge.position.y = dims.bridge.clearance;
	goldenGate.add(bridge);

	// 2 towers
	for (var side = -1; side <= 1; side += 2) {
		var tower = createTower(dims);
		//tower.position.y = dims.tower.height/2;
		tower.rotation.y = Math.PI/2;
		tower.position.x = side * dims.bridge.main_span/2;
		goldenGate.add(tower);
	}

	// Cables
	var cables = createCables(dims);
	goldenGate.add(cables);

	// // Land
	// var landGeom = new THREE.RingGeometry(dims.bridge.main_span/2, dims.bridge.length/2, 32);
	// var landMesh = new THREE.Mesh(landGeom, landMat);
	// landMesh.rotation.x = -Math.PI/2;
	// goldenGate.add(landMesh);

	// var land2Geom = new THREE.RingGeometry(dims.bridge.main_span/2, dims.bridge.length/2, 32);
	// var land2Mesh = new THREE.Mesh(land2Geom, landMat);
	// land2Mesh.rotation.x = -Math.PI/2;
	// land2Mesh.position.y = -dims.bridge.clearance*1.1;
	// goldenGate.add(land2Mesh);

	// var land3Geom = new THREE.CylinderGeometry(dims.bridge.length/2, dims.bridge.length/2, dims.bridge.clearance, 32, 32, true);
	// var land3Mesh = new THREE.Mesh(land3Geom, landMat);
	// land3Mesh.position.y = -dims.bridge.clearance/2;
	// goldenGate.add(land3Mesh);

	// // Water
	// var waterGeom = new THREE.CylinderGeometry(dims.bridge.main_span/2, dims.bridge.main_span/2, dims.bridge.clearance, 32, 32);
	// var waterMesh = new THREE.Mesh(waterGeom, waterMat);
	// waterMesh.position.y = -dims.bridge.clearance/2;
	// goldenGate.add(waterMesh);

	return goldenGate;
}