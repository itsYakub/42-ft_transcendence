import * as BABYLON from 'babylonjs'

import { g_gamePlayableArea } from './game.js';


/* SECTION:
 *  Classes
 * */

export class Shape {
	/* babylonjs elements
	 * */
	public	m_scene : BABYLON.Scene;
	public	m_mat : BABYLON.StandardMaterial;
	public	m_box : BABYLON.Mesh;

	/* NOTE(joleksia):
	 *  We only want to move our object forward-backward and left-rigth.
	 *  The up-down movement is redundant.
	 *  Thus, velocity calculation are 2D based and then mapped to 3D vector.
	 * */
	public	m_pos : BABYLON.Vector2;
	public	m_vel : BABYLON.Vector2;
	public	m_siz : BABYLON.Vector3;

	/* SECTION: Constructor
	 * */
	public	constructor(scene : BABYLON.Scene, pos : BABYLON.Vector2, siz : BABYLON.Vector3) {
		this.m_scene = scene;
		this.m_pos = pos;
		this.m_siz = siz;

		this.m_vel = BABYLON.Vector2.Zero();
	}

	public	update() {
		/* NOTE(joleksia):
		 *  Mapping 2D Position Vector -> 3D Box Position Vector.
		 *  As we don't want to move up-down, we don't update the 'y' coordinates of the Box.
		 * */
		this.m_box.position.x = this.m_pos.x += this.m_vel.x;
		this.m_box.position.z = this.m_pos.y += this.m_vel.y;
	}

	/* SECTION: Methods
	 * */
	public	setPos(vec : BABYLON.Vector2) { this.m_pos = vec; }
	public	setSiz(vec : BABYLON.Vector2) { this.m_pos = vec; }

	public	createMaterial(color : BABYLON.Color3) {
		this.m_mat = new BABYLON.StandardMaterial('mat0', this.m_scene);
		this.m_mat.disableLighting = true;
		this.m_mat.emissiveColor = color;

		console.log('[ INFO ] Material created | Color: ' + color); 
	}

	public	createMesh() {
		this.m_box = BABYLON.MeshBuilder.CreateBox('box0', { }, this.m_scene);
		this.m_box.position = new BABYLON.Vector3(this.m_pos.x, this.m_siz.y, this.m_pos.y);
		this.m_box.scaling = this.m_siz;
		this.m_box.material = this.m_mat;

		console.log('[ INFO ] Mesh created successfully | Position: ' + this.m_pos + ' | Size: ' + this.m_siz);
	}
	
	public	aabb(other : Shape) : boolean {
		return (false);
	}
}
