import * as BABYLON from 'babylonjs';

import { Shape } from './shape.js';


/* SECTION:
 *  Classes
 * */

export enum PlayerMode {
	PLAYERMODE_NONE = 0,
	PLAYERMODE_HUMAN,
	PLAYERMODE_AI,
	PLAYERMODE_COUNT,
}

export class Player extends Shape {
	/* HTML DOM Elements
	 * */
	private	m_canvas : HTMLCanvasElement;

	/* Game objects
	 * */
	private	m_mode : PlayerMode;

	/* SECTION:
	 *  Constructor
	 * */

	public constructor(canvas : HTMLCanvasElement, scene : BABYLON.Scene, side : number, mode : number) {
		/* Base constructor
		 * */
		super(
			scene,
			new BABYLON.Vector2(g_playerCenterOffset, 0.0),
			new BABYLON.Vector3(0.2, 0.2, 2.0)
		);

		/* Assign the references
		 * */
		this.m_canvas = canvas;

		/* Decide if player is HUMAN (PLAYERMODE_HUMAN / 1.0) or AI (PLAYERMODE_AI / 2.0)
		 * */
		this.m_mode = mode;

		/* Decide if player is on the left or right of the map
		 * */
		switch (side) {
			case (0): {
				/* Move the player to the left
				 * */
				this.m_pos.x = -g_playerCenterOffset;
				this.createMaterial(new BABYLON.Color3(0.48, 0.04, 0.98));
			} break;
			case (1): {
				this.createMaterial(new BABYLON.Color3(1.0, 0.92, 0.34));
			} break;
			default: { } break;
		}

		/* Finalize the player creation
		 * */
		this.createMesh();
	}	

	/* SECTION:
	 *  Public Methods
	 * */

	public update() {
		/* TODO(joleksia):
		 *  Create a basic player/ai behaviour
		 * */

		/* Update the base 'Shape' class
		 * */
		super.update();
	}
}



/* SECTION:
 *  Global game object
 * */
export var	g_playerCenterOffset : number = 6.0;
