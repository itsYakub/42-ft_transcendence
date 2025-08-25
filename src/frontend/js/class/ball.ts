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
		/* TODO(joleksia):
		 *  Fix this function:
		 *
		 *	this.playerBounceCheck();
		 * */

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

	private playerBounceCheck() {
		let	p0 = this.m_scene.getMeshByName('player0');
		let	p1 = this.m_scene.getMeshByName('player1');
		let tolerance = p0.scaling.x;
		
		/* TODO(joleksia):
		 *  Paste the previous implementation of the ball bouncing
		 *  SOURCE:
		 *	- https://github.com/coldandtired/ft_transcendence/blob/a19c083a77dd46ab9a900f0b97a5211eef3f9922/src/frontend/public/js/game/ball.ts#L68
		 * */
		if (this.m_box.intersectsMesh(p0)) {
		
		}
		
		if (this.m_box.intersectsMesh(p1)) {
			
		}
	}
}
