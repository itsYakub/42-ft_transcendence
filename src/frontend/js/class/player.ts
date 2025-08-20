import * as BABYLON from 'babylonjs'



/* SECTION:
 *  Classes
 * */

export enum PlayerMode {
	PLAYERMODE_NONE = 0,
	PLAYERMODE_HUMAN,
	PLAYERMODE_AI,
	PLAYERMODE_COUNT,
}

export class Player {
	/* HTML DOM Elements
	 * */
	private	m_canvas : HTMLCanvasElement;

	/* babylonjs elements
	 * */
	private	m_scene : BABYLON.Scene;
	private	m_position : BABYLON.Vector3 = new BABYLON.Vector3(g_playerCenterOffset, 1.0, 0.0);
	private	m_size : BABYLON.Vector3 = new BABYLON.Vector3(1.0, 1.0, 2.0);
	private	m_mat : BABYLON.StandardMaterial;
	private	m_box : BABYLON.Mesh;

	/* Game objects
	 * */
	private	m_mode : PlayerMode;

	/* SECTION:
	 *  Constructor
	 * */

	public constructor(canvas : HTMLCanvasElement, scene : BABYLON.Scene, side : number, mode : number) {
		/* Assign the references
		 * */
		this.m_canvas = canvas;
		this.m_scene = scene;

		/* Decide if player is HUMAN (PLAYERMODE_HUMAN / 1.0) or AI (PLAYERMODE_AI / 2.0)
		 * */
		this.m_mode = mode;

		/* Decide if player is on the LEFT (-1.0) or RIGHT (1.0)
		 * */
		this.m_mat = new BABYLON.StandardMaterial('mat', scene);
		switch (side) {
			case (0): {
				this.m_position._x *= -1.0;
				this.m_mat.diffuseColor = new BABYLON.Color3(0.8, 0.2, 0.2);
			} break;
			case (1): {
				this.m_mat.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2);
			} break;
			default: { } break;
		}

		/* Create the mesh
		 * */
		this.m_box = BABYLON.MeshBuilder.CreateBox('box', { }, scene);
		this.m_box.position = this.m_position;
		this.m_box.material = this.m_mat;

		/* TODO(joleksia):
		 *  Finish creating the object
		 * */

		console.log('[ INFO ] Player created | Position: ' + this.m_position + ' | Type: ' + (mode == PlayerMode.PLAYERMODE_HUMAN ? 'HUMAN' : 'AI'));
	}	

	/* SECTION:
	 *  Public Methods
	 * */

	public update() {
		/* TODO(joleksia):
		 *  Create a basic player/ai behaviour
		 * */
	}
}



/* SECTION:
 *  Global game object
 * */
export var	g_playerCenterOffset : number = 2.0;
