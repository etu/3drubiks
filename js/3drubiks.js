'use strict';

/**
 * Main class that holds everything together
 */
var RubiksCube = new Class({
	Implements: Options,
	options: {
		cubesetup: '3x3x3',
		cubesizes: 100
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
			this.cubes.push(new RubiksCubePart({x: offset[0], y: offset[1], z: offset[2], size: this.options.cubesizes}));
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
		angle: 0,
		state: undefined,
		size: undefined
	},
	initialize: function(options) {
		this.setOptions(options);

		var tmpCube = new THREE.Mesh(
			new THREE.CubeGeometry(this.options.size, this.options.size, this.options.size),
			new THREE.MeshNormalMaterial()
		);

		tmpCube.position.x = this.options.x * this.options.size * 1.1;
		tmpCube.position.y = this.options.y * this.options.size * 1.1;
		tmpCube.position.z = this.options.z * this.options.size * 1.1;

		tmpCube.overdraw = true;

		this.options.object = tmpCube;
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

