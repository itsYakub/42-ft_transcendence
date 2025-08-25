import * as BABYLON from 'babylonjs';

import { Shape } from './shape.js';
import { g_gamePlayableArea } from './game.js';
import { g_boundCellSize } from './ground.js';



/* SECTION:
 *  Classes
 * */

export class Ball extends Shape {
	/* HTML DOM Elements
	 * */
	private	m_canvas : HTMLCanvasElement;

	/* SECTION:
	 *  Constructor
	 * */

	public constructor(canvas : HTMLCanvasElement, scene : BABYLON.Scene) {
		/* Base constructor
		 * */
		super(scene, BABYLON.Vector2.Zero(), new BABYLON.Vector3(0.2, 0.2, 0.2), new BABYLON.Color3(0.28, 0.62, 0.84));

		/* Assign the references
		 * */
		this.m_canvas = canvas;

		/* Create the ball itself
		 * */
		this.m_name = 'ball';
		this.createMesh();
	}	

	/* SECTION:
	 *  Public Methods
	 * */

	public start() {
		this.reset();
		do {
			this.m_vel.x = Math.floor(Math.random() * 3.0 + -1.0);
		} while(this.m_vel.x == 0.0);
		do {
			this.m_vel.y = Math.floor(Math.random() * 3.0 + -1.0);
		} while(this.m_vel.y == 0.0);
	}

	public reset() {
		this.m_pos.x = this.m_pos.y = 0.0;
		this.m_vel.x = this.m_vel.y = 0.0;
	}

	public update() {
		this.wallBounceCheck();

		/* Update the base 'Shape' class
		 * */
		super.update();
	}

	/* SECTION:
	 *  Private Methods
	 * */

	private wallBounceCheck() {
		/* NOTE(joleksia):
		 *  This should also be a 'lose condition' and should send a 'goal event' (or something like that)
		 * */
		if (/* Bounce: LEFT */  (this.m_pos.x - this.m_siz.x / 2.0) <= (-g_gamePlayableArea.x + g_boundCellSize / 2.0) ||
			/* Bounce: RIGHT */ (this.m_pos.x + this.m_siz.x / 2.0) >= (g_gamePlayableArea.x - g_boundCellSize / 2.0)
		) {
			this.m_vel.x *= -1.0;
		}
		
		if (/* Bounce: TOP */    (this.m_pos.y - this.m_siz.y / 2.0) <= (-g_gamePlayableArea.y + g_boundCellSize / 2.0) ||
			/* Bounce: BOTTOM */ (this.m_pos.y + this.m_siz.y / 2.0) >= (g_gamePlayableArea.y - g_boundCellSize / 2.0)
		) {
			this.m_vel.y *= -1.0;
		}
	}
}
