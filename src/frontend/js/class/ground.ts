import * as BABYLON from 'babylonjs'
import * as SIMPLEX from 'simplex-noise';

import { g_gameTime, g_gamePlayableArea } from './game.js';



/* SECTION:
 *  Classes
 * */

export class Ground {
	/* babylonjs elements
	 * */
	private	m_scene : BABYLON.Scene;
	
	/* Game objects
	 * */
	private	m_mesh_arr : BABYLON.Mesh[];
	private	m_perlin : SIMPLEX.NoiseFunction2D;
	
	/* SECTION:
	 *  Constructor
	 * */

	public constructor(scene : BABYLON.Scene, size : BABYLON.Vector2) {
		this.m_scene = scene;
		this.m_mesh_arr = [ ];
		this.m_perlin = SIMPLEX.createNoise2D();
		
		let	map_mat0 = new BABYLON.StandardMaterial('map_mat0', scene);
		map_mat0.roughness = 0.9;
		
		let	ground = BABYLON.MeshBuilder.CreateGround('ground0', { width: size.x, height: size.y }, scene);
		ground.material = map_mat0;
	
		let	bound_cell_index : number = 0.0;
		let	bound_cell_size : number = 0.45;
		for (let x = size.x / -2.0; x < size.x / 2.0; x += bound_cell_size + 0.05) {
            for (let y = size.y / -2.0; y < size.y / 2.0; y+= bound_cell_size + 0.05) {
				/* Don't create any boxes in the gameplay area
				 * */
                if (x > -g_gamePlayableArea.x && x < g_gamePlayableArea.x &&
                    y > -g_gamePlayableArea.y && y < g_gamePlayableArea.y
                ) {
                    continue;
                }

                let box = BABYLON.MeshBuilder.CreateBox('cell0', { }, scene);
				box.scaling = new BABYLON.Vector3(bound_cell_size, bound_cell_size * 2.0, bound_cell_size);
				box.position = new BABYLON.Vector3(x, 0.0, y);
				box.material = map_mat0;

				this.m_mesh_arr.push(box);
            }
        }
	}

	/* SECTION:
	 *  Public Methods
	 * */

	public update() {
		/* NOTE(joleksia):
		 *  We can mess around with those values to get even better noise effects
		 * */
		for (let i = 0; i < this.m_mesh_arr.length; i++) {
			let mesh = this.m_mesh_arr[i];
			let	x : number = (mesh.position.x * 0.1) + g_gameTime * 0.0001;
			let	y : number = (mesh.position.z * 0.1) + g_gameTime * 0.0001;
			let	val : number = this.m_perlin(x, y);

			mesh.position.y = val / 2.0;
		}
	}
}
