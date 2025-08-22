import * as BABYLON from 'babylonjs';

import { Shape } from './shape.js';


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
		super(
			scene,
			BABYLON.Vector2.Zero(),
			new BABYLON.Vector3(0.2, 0.2, 0.2)
		);

		/* Assign the references
		 * */
		this.m_canvas = canvas;

		/* Create the ball itself
		 * */
		this.createMaterial(
			new BABYLON.Color3(0.58, 0.99, 1.0)
		);
		this.createMesh();
	}	

	/* SECTION:
	 *  Public Methods
	 * */

	public update() {
		/* Update the base 'Shape' class
		 * */
		super.update();
	}
}
