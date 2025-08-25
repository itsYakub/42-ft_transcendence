import * as BABYLON from 'babylonjs'

import { Player } from './player.js';
import { Ball }  from './ball.js';
import { Ground }  from './ground.js';



/* SECTION:
 *  Classes
 * */

export enum	GameMode {
	GAMEMODE_NONE = 0,
	GAMEMODE_LOCAL_PVP,
	GAMEMODE_LOCAL_AI,
	GAMEMODE_COUNT
}

export class Game {
	/* HTML DOM Elements
	 * */
	private m_dialog : HTMLDialogElement;
	private	m_canvas : HTMLCanvasElement;

	/* babylonjs elements
	 * */
	private	m_engine : BABYLON.Engine;
	private	m_scene : BABYLON.Scene;

	/* Game objects
	 * */
	private m_player0 : Player;
	private	m_player1 : Player;
	private	m_ball : Ball;
	private	m_ground : Ground;

	/* SECTION:
	 *  Public Methods
	 * */
	
	public	setupElements() {
		/* Get the dialog element from the document
		 * */
		console.log('[ INFO ] Referencing the modal dialog');
		this.m_dialog = document.getElementById('gameDialog') as HTMLDialogElement;

		/* Create a canvas element and set it as the child of the dialog
		 * */
		console.log('[ INFO ] Creating a canvas object');
		this.m_canvas = document.createElement('canvas');
		this.m_dialog.appendChild(this.m_canvas);

		/* Create a babylon layer
		 * */
		console.log('[ INFO ] Creating a babylon engine');
		this.m_engine = new BABYLON.Engine(this.m_canvas, true, {preserveDrawingBuffer: true, stencil: true } );

		console.log('[ INFO ] Creating a babylon scene');
		this.m_scene = this.createScene();
	
		/* Display the game dialog
		 * */
		console.log('[ INFO ] Preparing the game');
		this.m_dialog.showModal();
		/* Resize the canvas to the size of the dialog
		 * */
		this.m_canvas.width = this.m_dialog.clientWidth;
		this.m_canvas.height = this.m_dialog.clientHeight;
		
		this.m_engine.runRenderLoop(() => this.updateRenderLoop());

		console.log('[ INFO ] Game is running...');
	}

	public	dispose() {
		console.log('[ INFO ] Disposing babylon engine');
		this.m_engine.stopRenderLoop();
		this.m_engine.dispose();

		console.log('[ INFO ] Removing canvas object from dialog');
		this.m_dialog.removeChild(this.m_canvas);
		
		console.log('[ INFO ] Closing dialog');
		this.m_dialog.close();
		
		console.log('[ INFO ] Game is disposed...');
	}

	/* SECTION:
	 *  Private Methods
	 * */

	private	updateRenderLoop() {
		/* SECTION: Update
		 * */

		/* Update game time
		 * */
		g_gameTime += this.m_engine.getDeltaTime();

		/* Update game components
		 * */
		this.m_player0.update();
		this.m_player1.update();
		this.m_ball.update();
		this.m_ground.update();

		/* SECTION: Render
		 * */
		
		this.m_scene.render()
	}

	private	createScene() {
		let	scene = new BABYLON.Scene(this.m_engine);

		/* SECTION:
		 *  Camera Setup
		 * */
		let camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 16, 10, new BABYLON.Vector3(0, 0, 0));
		
		const light = new BABYLON.PointLight("light0", new BABYLON.Vector3(0, 5, 0), scene);	light.intensity = 2.0;
		light.diffuse = new BABYLON.Color3(0.15, 0, 0.4);
		light.specular = new BABYLON.Color3(0, 0, 0);
		light.intensity = 1;

		/* TODO(joleksia):
		 *  Here we should set-up the game based on the gamemode.
		 *  By setting-up I mean:
		 *  - creating both players;
		 *  - specifing if player is a human or AI;
		 *  - specifing if the game is local or remote (which is important for the socket listening);
		 * */
		this.m_player0 = new Player(this.m_canvas, this.m_scene, 0, 1);
		this.m_player1 = new Player(this.m_canvas, this.m_scene, 1, 1);
		this.m_ball = new Ball(this.m_canvas, this.m_scene);
		this.m_ground = new Ground(this.m_scene, new BABYLON.Vector2(32.0, 24.0));
		return (scene);
	}
}



/* SECTION:
 *  Global game object
 * */
export var	g_gamePlayableArea : BABYLON.Vector2 = new BABYLON.Vector2(7.0, 3.0);
export var	g_gameTime : number = 0.0;

export var	g_game : Game = new Game();
export var	g_gameMode : GameMode = GameMode.GAMEMODE_NONE;
