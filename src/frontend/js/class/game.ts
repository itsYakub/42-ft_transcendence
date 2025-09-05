import * as BABYLON from '@babylonjs/core/Legacy/legacy';

import { Player } from './player.js';
import { Ball } from './ball.js';
import { Ground } from './ground.js';
import { GamePlayer, MessageType } from '../../../common/interfaces.js';
import { sendMessageToServer } from '../sockets/clientSocket.js';
import * as GUI from '@babylonjs/gui';

/* SECTION:
 *  Classes
 * */

export enum GameMode {
	GAMEMODE_NONE = 0,
	GAMEMODE_PVP,
	GAMEMODE_AI,
	GAMEMODE_REMOTE,
	GAMEMODE_COUNT
}

export enum StateMachine {
	STATE_NONE = 0,
	STATE_START,		/* State when the game is being preapred */
	STATE_UPDATE,		/* State when the game is being updated */
	STATE_PAUSED,		/* State for when the game should be paused */
	STATE_RESTART,		/* State invoked most likely by someone scoring a point */
	STATE_GAMEOVER,		/* GameOver state; the game should be closed soon, there can be a game over window, etc. */
	STATE_COUNT
}

export class Game {
	/* HTML DOM Elements
	 * */
	private m_dialog: HTMLDialogElement;
	private m_canvas: HTMLCanvasElement;

	/* babylonjs elements
	 * */
	private m_engine: BABYLON.Engine;
	private m_scene: BABYLON.Scene;

	/* Game objects
	 * */
	private m_mode: GameMode;

	private m_player0: Player;
	private m_player1: Player;
	private m_ball: Ball;
	private m_ground: Ground;

	private m_canvasCreated: boolean = false;
	private m_engineCreated: boolean = false;
	private m_sceneCreated: boolean = false;

	/* TODO(joleksia):
	 *  This variable is here to tell every game object to no update anymore.
	 *  Basically, every method should now check if this flag is set to tru or false.
	 *  If true: no update;
	 *  If false: update normally;
	 *  This also should be in sync between clients.
	 * */
	private m_stateMachine: StateMachine;

	public static keys: boolean[];

	/* SECTION:
	 *  Public Methods
	 * */

	get deltaTime() { return (this.m_engine.getDeltaTime() * 0.001); }
	get ball() { return (this.m_ball); }

	public async setupElements(mode: GameMode, p0: GamePlayer, p1: GamePlayer) {
		/* Get the dialog element from the document
		 * */
		console.log('[ INFO ] Referencing the modal dialog');
		this.m_dialog = document.getElementById('gameDialog') as HTMLDialogElement;

		/* Check if there's no scene created yet.
		 * If so, create a new one
		 * */
		if (!this.m_canvasCreated) {
			console.log('[ INFO ] Creating a canvas object');
			this.m_canvas = document.createElement('canvas');
			this.m_canvasCreated = true;
		}
		this.m_dialog.appendChild(this.m_canvas);

		/* Setup keyboard input map
		 * TODO(joleksia):
		 *  This is just a temporary solution and should be probably switched ASAP (@agarbacz?)
		 * */
		Game.keys = [];
		window.addEventListener("keydown", function (e) {
			Game.keys[e.key] = true;
		});

		window.addEventListener("keyup", function (e) {
			Game.keys[e.key] = false;
		});

		/* Create a babylon layer
		 * */
		if (!this.m_engineCreated) {
			console.log('[ INFO ] Creating a babylon engine');
			this.m_engine = new BABYLON.Engine(this.m_canvas, true, { preserveDrawingBuffer: true, stencil: true });
			this.m_engineCreated = true;
		}

		if (!this.m_sceneCreated) {
			console.log('[ INFO ] Creating a babylon scene');
			this.m_mode = mode;
			this.m_scene = this.createScene(p0, p1);
		}

		/* Display the game dialog
		 * */
		console.log('[ INFO ] Preparing the game');
		this.m_dialog.showModal();

		/* Resize the canvas to the size of the dialog
		 * */
		this.m_canvas.width = this.m_dialog.clientWidth;
		this.m_canvas.height = this.m_dialog.clientHeight;

		/* If the list of active render loops is equal to zero,
		 * start a new render loop
		 * */
		if (!this.m_engine.activeRenderLoops.length) {
			this.m_engine.runRenderLoop(() => this.updateRenderLoop());
		}

		this.m_stateMachine = StateMachine.STATE_START;
		console.log('[ INFO ] Game is running...');
	}

	public dispose() {
		console.log('[ INFO ] Disposing babylon scene');
		this.m_scene.dispose();
		this.m_sceneCreated = false;

		console.log('[ INFO ] Disposing babylon engine');
		this.m_engine.stopRenderLoop();
		this.m_engine.dispose();
		this.m_engineCreated = false;

		console.log('[ INFO ] Removing canvas object from dialog');
		this.m_dialog.removeChild(this.m_canvas);
		this.m_canvasCreated = false;

		console.log('[ INFO ] Closing dialog');
		this.m_dialog.close();

		console.log('[ INFO ] Game is disposed...');
	}


	public score(p0: boolean, p1: boolean) {
		/* Increment the player score.
		 * */
		if (p0) { this.m_player0.score++ };
		if (p1) { this.m_player1.score++ };
		console.log('[ INFO ] Current score: p0:' + this.m_player0.score + ' | p1:' + this.m_player1.score);

		/* Check if the someone passed the score threshold.
		 * If so, the match is over!
		 * */
		if (this.m_player0.score >= g_gameScoreTotal ||
			this.m_player1.score >= g_gameScoreTotal
		) {
			this.m_stateMachine = StateMachine.STATE_GAMEOVER;
		}
		else {
			this.m_stateMachine = StateMachine.STATE_RESTART;
		}
	}

	/* SECTION:
	 *  Private Methods
	 * */

	private updateRenderLoop() {
		/* StateMachine - dependent code
		 * */
		switch (this.m_stateMachine) {
			case (StateMachine.STATE_START): {
				/* NOTE(joleksia):
				 *  I've removed the setTimeout added by @lwillis
				 *  It had some issues with the curremt state machine
				 *  The state machine, even tho it was updated, still called the conent of setTimeout
				 * */
				if (this.m_mode == GameMode.GAMEMODE_REMOTE) {
					sendMessageToServer({
						type: MessageType.MATCH_START, gameId: this.m_player0.gameID
					});
					console.log('[ INFO ] Match type: remote');
				}
				else {
					this.m_ball.start();
					console.log('[ INFO ] Match type: local');
				}
				this.m_stateMachine = StateMachine.STATE_UPDATE;
				console.log('[ INFO ] Match start!');
			} break;

			case (StateMachine.STATE_UPDATE): {
				this.m_player0.update();
				this.m_player1.update();
				this.m_ball.update();
			} break;

			case (StateMachine.STATE_PAUSED): {
				/* NOTE(joleksia):
				 *  For now you shouldn't be able to enter this state
				 * */
			} break;

			case (StateMachine.STATE_RESTART): {
				/* TODO(joleksia):
				 *  The ball, in the 'reset()' function, should also set some sort of delay
				 *  to wait before the actual match starts. It also must be in sync with other clients!
				 *  @agarbacz
				 * */
				this.m_player0.reset();
				this.m_player1.reset();
				this.m_ball.reset();

				this.m_stateMachine = StateMachine.STATE_START;
			} break;

			case (StateMachine.STATE_GAMEOVER): {
				this.matchOver();
				return;
			} break;

			default: { } break;
		}

		/* StateMachine - independent code
		 * */
		g_gameTime += this.deltaTime;
		this.m_ground.update();

		/* Render the scene...
		 * */
		this.m_scene.render()
	}

	// send the match info back to the frontend
	private matchOver() {
		// show "winner message" or something, or leave it to the frontend

		// @joleksia this is so it's only sent once per match
		if (this.m_player0.score > this.m_player1.score || this.m_mode == GameMode.GAMEMODE_AI) {
			sendMessageToServer({
				type: MessageType.MATCH_OVER,
				match: {
					g1: {
						nick: this.m_player0.nick,
						score: this.m_player0.score,
						userId: this.m_player0.userID
					},
					g2: {
						nick: this.m_player1.nick,
						score: this.m_player1.score,
						userId: this.m_player1.userID
					}
				}
			});
		}

		this.dispose();
	}


	private createScene(p0: GamePlayer, p1: GamePlayer) {
		let scene = new BABYLON.Scene(this.m_engine);

		/* SECTION:
		 *  Camera Setup
		 * */
		let camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 16, 10, new BABYLON.Vector3(0, 0, 0));

		const light = new BABYLON.PointLight("light0", new BABYLON.Vector3(0, 5, 0), scene); light.intensity = 2.0;
		light.diffuse = new BABYLON.Color3(0.15, 0, 0.4);
		light.specular = new BABYLON.Color3(0, 0, 0);
		light.intensity = 1;

		/* TODO(joleksia):
		 *  Here we should set-up the game based on the gamemode.
		 *  By setting-up I mean:
		 *  - creating both players [X];
		 *  - specifing if player is a human or AI [X];
		 *  - specifing if the game is local or remote (which is important for the socket listening);
		 * */
		this.m_ground = new Ground(scene, new BABYLON.Vector2(32.0, 24.0));
		this.m_ball = new Ball(this.m_canvas, scene);
		this.m_player0 = new Player(this.m_canvas, scene, p0, 0.0, 1.0);
		switch (this.m_mode) {
			case (GameMode.GAMEMODE_PVP): {
				this.m_player1 = new Player(this.m_canvas, scene, p1, 1.0, 1.0);
			} break;
			case (GameMode.GAMEMODE_AI): {
				this.m_player1 = new Player(this.m_canvas, scene, p1, 1.0, 2.0);
			} break;
		}

		// This is adapted from the docs
		var plane = BABYLON.MeshBuilder.CreatePlane("plane", {
			size: 2,
			width: 10,
			height: 5
		});
		plane.position.y = 2;
		var advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane);
		var button1 = GUI.Button.CreateSimpleButton("but1", "Click Me");
		button1.width = 1;
		button1.height = 0.4;
		button1.color = "white";
		button1.fontSize = 50;
		button1.background = "green";
		button1.onPointerUpObservable.add(function () {
			alert("Shitty Babylonjs");
		});
		advancedTexture.addControl(button1);

		return (scene);
	}
}

/* SECTION:
 *  Global game object
 * */
export var g_gamePlayableArea: BABYLON.Vector2 = new BABYLON.Vector2(7.0, 3.0);
export var g_gameTime: number = 0.0;
export const g_gameScoreTotal: number = /* 10.0; */ 3.0;

export var g_game: Game = new Game();


