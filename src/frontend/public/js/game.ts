import * as BABYLON from 'babylonjs';

// Get the canvas DOM element
let	canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
// Load the 3D engine
let	engine = new BABYLON.Engine(canvas, true);
// CreateScene function that creates and return the scene
let	createScene = function(){
    // Create a basic BJS Scene object
    var scene = new BABYLON.Scene(engine);
    // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
    // Target the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // Attach the camera to the canvas
    camera.attachControl(canvas, false);
    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
    var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
    // Move the sphere upward 1/2 of its height
    sphere.position.y = 1;
    // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
    var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false);
    // Return the created scene
    return scene;
}

function	gamePlay() {
	// call the createScene function
	var scene = createScene();
	// run the render loop
	engine.runRenderLoop(function(){
		scene.render();
	});
	// the canvas/window resize event handler
	window.addEventListener('resize', function(){
		engine.resize();
	});

	(<HTMLButtonElement>document.getElementById("gamePlay")).disabled = true;
}

export function	setupGameFrame() {
	document.getElementById("gamePlay").addEventListener("click", async( ) => { gamePlay(); });
}

/*

import { Shape } from "./game/shape.js";
import { Paddle } from "./game/paddle.js";
import { PaddleType } from "./game/paddle.js";
import { Ball } from "./game/ball.js";

export function randomNumber(min : number, max : number) : number {
	return (min + (Math.random() / 2147483647) * (min - max));
}

export class Game {
	private	m_gameCanvas : HTMLCanvasElement;
	private	m_gameContext : CanvasRenderingContext2D;
	private	m_player1 : Paddle;
	private	m_player2 : Paddle;
	private	m_ball : Ball;
	
	public static	keysPressed : boolean[] = [];
	public static	player1Score : number = 0;
	public static	player2Score : number = 0;

	constructor() {
		this.m_gameCanvas = document.getElementById("pongCanvas") as HTMLCanvasElement;
		this.m_gameCanvas.width = this.m_gameCanvas.parentElement.clientWidth;
		this.m_gameCanvas.height = this.m_gameCanvas.parentElement.clientHeight;
		this.m_gameContext = this.m_gameCanvas.getContext("2d");
		//this.gameContext.font = "30px Orbitron";

		window.addEventListener("keydown", function (e) {
			Game.keysPressed[e.key] = true;
		});

		window.addEventListener("keyup", function (e) {
			Game.keysPressed[e.key] = false;
		});

		// Adjust these dependent on available space
		var paddleWidth: number = 16;
		var paddleHeight: number = 128;
		var ballSize: number = 20;
		var wallOffset: number = 24;

		this.m_player1 = new Paddle(
			wallOffset, this.m_gameCanvas.height / 2 - paddleHeight / 2,
			paddleWidth, paddleHeight,
			"w", "s", "#fa2222",
			PaddleType.PADDLE_AI
		);
		
		this.m_player2 = new Paddle(
			this.m_gameCanvas.width - (wallOffset + paddleWidth),
			this.m_gameCanvas.height / 2 - paddleHeight / 2,
			paddleWidth, paddleHeight,
			"ArrowUp", "ArrowDown", "#22fa22",
			PaddleType.PADDLE_AI
		);
		
		this.m_ball = new Ball(
			this.m_gameCanvas.width / 2 - ballSize / 2,
			this.m_gameCanvas.height / 2 - ballSize / 2,
			ballSize, ballSize
		);
	}

	update() {
		this.m_player1.update(this.m_gameCanvas, this.m_ball);
		this.m_player2.update(this.m_gameCanvas, this.m_ball);
		this.m_ball.update(this.m_player1,this.m_player2,this.m_gameCanvas);

		if (this.m_ball.outOfBound(this.m_gameCanvas)) {
			this.m_ball.restart(this.m_gameCanvas);
			this.m_player1.restart();
			this.m_player2.restart();
		}
	}

	render() {
		this.renderCourt();
		this.m_player1.render(this.m_gameContext);
		this.m_player2.render(this.m_gameContext);
		this.m_ball.render(this.m_gameContext);
	}

	run() {
		game.update();
		game.render();
		requestAnimationFrame(game.run);
	}

	renderCourt() {
		// Draws the court floor
		this.m_gameContext.fillStyle = "#008566";
		this.m_gameContext.fillRect(0, 0, this.m_gameCanvas.width, this.m_gameCanvas.height);

		// Draws half-way line
		this.m_gameContext.fillStyle = "#fff";
		this.m_gameContext.fillRect(this.m_gameCanvas.width / 2 - 2, 8, 4, this.m_gameCanvas.height - 16);

		// Draws score numbers
		this.m_gameContext.fillText(Game.player1Score.toString(), this.m_gameCanvas.width / 3, 128);
		this.m_gameContext.fillText(Game.player2Score.toString(), this.m_gameCanvas.width / 3 * 2, 128);
	}
}

var game: Game;

function	gamePlay() {
	game = new Game();
	requestAnimationFrame(game.run);
	(<HTMLButtonElement>document.getElementById("gamePlay")).disabled = true;
}

export function	setupGameFrame() {
	document.getElementById("gamePlay").addEventListener("click", async( ) => { gamePlay(); });
}

*/
