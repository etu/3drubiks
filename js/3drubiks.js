'use strict';

/**
 * Main class that holds everything together
 */
var RubiksCube = new Class({
	Implements: Options,
	options: {
		cubesetup: '3x3x3',
		cubesizes: 100,
		paddingMultiplier: 1.1
	},
	cubes: [],
	initialize: function(options) {
		this.setOptions(options);

		var cubeOffsets = [];
		for(var i = -1; i <= 1; i++) { // X coords
			for(var j = -1; j <= 1; j++) { // Y coords
				for(var k = -1; k <= 1; k++) { // Z coords
					cubeOffsets.push([i, j, k]);
				}
			}
		}

		// Create cubeparts
		Array.each(cubeOffsets, function(offset) {
			this.cubes.push(new RubiksCubePart({x: offset[0], y: offset[1], z: offset[2], size: this.options.cubesizes, paddingMultiplier: this.options.paddingMultiplier}));
		}, this);

		// Append cubeparts to scene
		Array.each(this.cubes, function(cube) {
			scene.add(cube.options.object);
		}, this);
	},
	rotate: function(angle) {
		Array.each(this.cubes, function(cube) {
			cube.options.object.rotation.y += angle;
		});
	}
});


/**
 * Class that handles state and 3d-object for a specific cubepart
 */
var RubiksCubePart = new Class({
	Implements: Options,
	options: {
		object: undefined,
		x: undefined,
		y: undefined,
		z: undefined,
		angleX: 0,
		angleY: 0,
		angleZ: 0,
		state: undefined,
		size: undefined,
		paddingMultiplier: 1.1,
	},
	initialize: function(options) {
		this.setOptions(options);

		// Create a temporary cube object
		var tmpCube = new THREE.Mesh(
			new THREE.CubeGeometry(this.options.size, this.options.size, this.options.size),
			new THREE.MeshDepthMaterial()
		);

		// Set offset values for positioning
		Object.each(tmpCube.position, function(value, key) {
			tmpCube.position[key] = this.options[key] * this.options.size * this.options.paddingMultiplier;
		}, this);

		// Allow overdrawing
		tmpCube.overdraw = true;

		// Save tmpCube
		this.options.object = tmpCube;
	},
	rotate: function(axis, angleChange) {
		var abs = Number.abs(this.options.x) + Number.abs(this.options.y) + Number.abs(this.options.z);

		switch(abs) {
			case 0:
				console.log('you should not exist, but whatever');
				break;
			case 1:
				console.log('centerpart');
				break;
			case 2:
				console.log('edge between two center parts');
				break;
			case 3:
				console.log('cornerpart');
				break;
		}
	}
});




var WIDTH = 640;
var HEIGHT = 480;

var container;

var renderer = new THREE.WebGLRenderer();
var camera   = new THREE.PerspectiveCamera(80, WIDTH/HEIGHT, 1, 1000);
var scene    = new THREE.Scene();
var lamp     = new THREE.PointLight(0xFFFFFF);
var cube     = new RubiksCube();

// Move the camera
camera.position.z = 500;
camera.position.y = 300;

// Angle the camera
camera.rotation.x = -0.5;

// Move the lamp a bit :)
lamp.position.x = 10;
lamp.position.y = 50;
lamp.position.z = 130;

// Add camera and lamp to scene
scene.add(camera);
scene.add(lamp);

// Start renderer
renderer.setSize(WIDTH, HEIGHT);



var lastTime = 0;
var angularSpeed = 0.2;
var spin = false;

function animate() {
	var time = (new Date()).getTime();
	var delta = time - lastTime;

	var angleChange = angularSpeed * delta * 2 * Math.PI / 1000;
	if(spin) cube.rotate(angleChange);
	lastTime = time;

	renderer.render(scene, camera); // DRAW

	requestAnimationFrame(function(){ animate(); }); // request new frame
}


window.addEvent('domready', function() {
	renderer.domElement.inject($('canvasWrapper')); // attach the render-supplied DOM element

	animate(); // LETS ANIMATE THIS
});

