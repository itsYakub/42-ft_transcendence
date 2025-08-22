import * as BABYLON from 'babylonjs'

import { g_gamePlayableArea } from './game.js';



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
	private	m_perlin : BABYLON.SimplexPerlin3DBlock;
	
	/* SECTION:
	 *  Constructor
	 * */

	public constructor(scene : BABYLON.Scene, size : BABYLON.Vector2) {
		this.m_scene = scene;
		this.m_mesh_arr = [ ];
		
		let	map_mat0 = new BABYLON.StandardMaterial('map_mat0', scene);
		map_mat0.roughness = 0.1;
		
		let	ground = BABYLON.MeshBuilder.CreateGround('ground0', { width: size.x, height: size.y }, scene);
		ground.material = map_mat0;
	
		let	bound_cell_index : number = 0.0;
		let	bound_cell_size : number = 0.4;
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
		for (let mesh in this.m_mesh_arr) {
			/* TODO(joleksia):
			 *  Update the position of each mesh based on perlin-noise
			 * */

		}
	}
}
