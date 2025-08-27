import * as BABYLON from 'babylonjs';

import { Shape } from './shape.js';
import { Game, g_game, GameMode } from './game.js';
import { g_gamePlayableArea } from './game.js';
import { g_boundCellSize } from './ground.js';


/* SECTION:
 *  Classes
 * */

export enum PlayerMode {
	PLAYERMODE_NONE = 0.0,
	PLAYERMODE_HUMAN = 1.0,
	PLAYERMODE_AI = 2.0,
	PLAYERMODE_COUNT,
}

export class Player extends Shape {
	/* HTML DOM Elements
	 * */
	private	m_canvas : HTMLCanvasElement;

	/* Game objects
	 * */
	private	m_mode : PlayerMode;
	private	m_keyUp : string;
	private	m_keyDown : string;

	/* AI Section
	 * */
	private	m_aiDest : BABYLON.Vector2;
	private	m_aiTimerElapsed : number;

	/* SECTION:
	 *  Constructor
	 * */

	public constructor(canvas : HTMLCanvasElement, scene : BABYLON.Scene, side : number, mode : number) {
		/* Base constructor
		 * */
		super(scene, new BABYLON.Vector2(g_playerCenterOffset, 0.0), new BABYLON.Vector3(0.2, 0.2, 2.0), BABYLON.Color3.White());

		/* Assign the references
		 * */
		this.m_canvas = canvas;

		/* Decide if player is HUMAN (PLAYERMODE_HUMAN / 1.0) or AI (PLAYERMODE_AI / 2.0)
		 * */
		this.m_mode = (mode != 2.0 ? (mode != 1.0 ? PlayerMode.PLAYERMODE_NONE : PlayerMode.PLAYERMODE_HUMAN) : PlayerMode.PLAYERMODE_AI);

		/* Decide if player is on the left or right of the map
		 * */
		switch (side) {
			case (0): {
				/* Move the player to the left
				 * */
				this.m_col = new BABYLON.Color3(0.74, 0.17, 0.83);
				this.m_name = 'player0';
				this.m_keyUp = 'w';
				this.m_keyDown = 's';
				this.m_pos.x = -g_playerCenterOffset;
			} break;
			case (1): {
				this.m_col = new BABYLON.Color3(0.98, 0.8, 0.36);
				this.m_name = 'player1';
				this.m_keyUp = 'ArrowUp';
				this.m_keyDown = 'ArrowDown';
			} break;
			default: { } break;
		}

		/* Finalize the player creation
		 * */
		this.createMesh();

		/* Set the AI data
		 * */
		this.m_aiTimerElapsed = 0.0;
		this.m_aiDest = BABYLON.Vector2.Zero();

		console.log('[ INFO ] Player created | Side: ' + (side == 0.0 ? 'LEFT' : 'RIGHT') + ' | Mode: ' + (this.m_mode == PlayerMode.PLAYERMODE_HUMAN ? 'HUMAN' : 'AI'));
	}	

	/* SECTION:
	 *  Public Methods
	 * */

	public update() {
		let	up : boolean;
		let down : boolean;

		/* TODO(joleksia):
		 *  Create a basic player/ai behaviour
		 * */
		switch (this.m_mode) {
			case (PlayerMode.PLAYERMODE_HUMAN): {
				up = Game.keys[this.m_keyUp];
				down = Game.keys[this.m_keyDown];
			} break;
			case (PlayerMode.PLAYERMODE_AI): {
				/* TODO(joleksia):
				 *  Implement AI
				 * */
				this.aiBehaviour();
				up = this.m_box.position.y < this.m_aiDest.y;
				down = this.m_box.position.y > this.m_aiDest.y;
			} break;
		}
		this.movePlayer(up, down);

		/* Update the base 'Shape' class
		 * */
		super.update();
	}

	/* SECTION:
	 *  Private Methods
	 * */

	private movePlayer(up : boolean, down : boolean) {
		/* NOTE(joleksia):
		 *  This is just a simple, bare-bones solution for player movement
		 *  It requires a lot of improvements especially if it comes to sockets.
		 *  @agarbacz please review it.
		 * */
		let	dir : number = 0.0;
		if (up) { dir = 1.0; }
		else if (down) { dir = -1.0 };

		this.m_vel.y = dir;
	}

	private aiBehaviour() {
		/* Simple workflow:
		 * - if m_aiTimerElapsed < 1.0: just increase the value by the deltaTime;
		 * - if m_aiTimerElasped >= 1.0: get the potential ball position and return it
		 * */
		if (this.m_aiTimerElapsed >= 1.0) {
			let	ball = this.m_scene.getMeshByName('ball');

			this.m_aiDest.x = ball.position.x;
			this.m_aiDest.y = ball.position.z;

			this.m_aiTimerElapsed = 0.0;

			console.log('[ INFO ] Potential ball position: ' + this.m_aiDest);
			console.log('[ INFO ] Current pallet position: ' + this.m_pos);
		}
		else if (this.m_aiTimerElapsed < 1.0) {
			this.m_aiTimerElapsed += g_game.getDeltaTime();
		}
	}
}



/* SECTION:
 *  Global game object
 * */
export var	g_playerCenterOffset : number = 6.0;
