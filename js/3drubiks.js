'use strict';

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

		Array.each(cubeOffsets, function(offset) {
			var tmpCube = new THREE.Mesh(
				new THREE.CubeGeometry(this.options.cubesizes, this.options.cubesizes, this.options.cubesizes),
				new THREE.MeshNormalMaterial()
			);

			tmpCube.position.x = offset[0] * this.options.cubesizes * 1.1;
			tmpCube.position.y = offset[1] * this.options.cubesizes * 1.1;
			tmpCube.position.z = offset[2] * this.options.cubesizes * 1.1;

			tmpCube.overdraw = true;

			this.cubes.push(tmpCube);
		}, this);

		// Append cubes to scene
		Array.each(this.cubes, function(cube) {
			scene.add(cube);
		}, this);
	},
	rotate: function(angle) {
		Array.each(this.cubes, function(cube) {
			cube.rotation.y += angle;
		});
	}
});




var WIDTH = 640;
var HEIGHT = 480;

var container;

var renderer = new THREE.WebGLRenderer();
var camera   = new THREE.PerspectiveCamera(80, WIDTH/HEIGHT, 1, 1000);
var scene    = new THREE.Scene();
var lamp     = new THREE.PointLight(0xFFFFFF);
var RubiksCube = new RubiksCube();

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
	if(spin) RubiksCube.rotate(angleChange);
	lastTime = time;

	renderer.render(scene, camera); // DRAW

	requestAnimationFrame(function(){ animate(); }); // request new frame
}


window.addEvent('domready', function() {
	renderer.domElement.inject($('canvasWrapper')); // attach the render-supplied DOM element

	animate(); // LETS ANIMATE THIS
});

