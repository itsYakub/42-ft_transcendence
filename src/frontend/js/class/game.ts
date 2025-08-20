import * as BABYLON from 'babylonjs'

import { Player } from './player.js';



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

		/* Run the render loop
		 * */
		console.log('[ INFO ] Preparing the game');
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

		this.m_player0.update();
		this.m_player1.update();

		/* SECTION: Render
		 * */
		
		this.m_scene.render()
	}

	private	createScene() {
		let	scene = new BABYLON.Scene(this.m_engine);

		let camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 12, 10, new BABYLON.Vector3(0, 0, 0));
		let	light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0));

		scene.clearColor = new BABYLON.Color4(0.2, 0.2, 0.2, 1.0);

		let	mat_ground = new BABYLON.StandardMaterial('mat_ground', scene);
		mat_ground.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
		
		/* TODO(joleksia):
		 *  Here we should set-up the game based on the gamemode.
		 *  By setting-up I mean:
		 *  - creating both players;
		 *  - specifing if player is a human or AI;
		 *  - specifing if the game is local or remote (which is important for the socket listening);
		 * */
		this.m_player0 = new Player(this.m_canvas, this.m_scene, 0, 1);
		this.m_player1 = new Player(this.m_canvas, this.m_scene, 1, 1);
		
		let	ground = BABYLON.MeshBuilder.CreateGround('ground', { width:32, height:24 }, scene);
		ground.material = mat_ground;

		return (scene);
	}
}



/* SECTION:
 *  Global game object
 * */
export var	g_game : Game = new Game();
export var	g_gameMode : GameMode = GameMode.GAMEMODE_NONE;
