import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

import { Player } from './player.js';

/* SECTION:
 *  Classes
 * */

export class Gui {
    /* HTML DOM Elements */
    private m_canvas: HTMLCanvasElement;

    /* Game objects */

    private m_player0: Player;
    private m_player1: Player;

	/* SECTION: Public Methods */

	public constructor(canvas : HTMLCanvasElement, p0 : Player, p1 : Player) {
		this.m_canvas = canvas;
		this.m_player0 = p0;
		this.m_player1 = p1;
		
		var mesh0 = BABYLON.MeshBuilder.CreatePlane('ui-plane0', { size: 2, width: 4, height: 4 } ); 
		var advancedTexture0 = GUI.AdvancedDynamicTexture.CreateForMesh(mesh0);
		mesh0.rotation = new BABYLON.Vector3(1.5, 0.0, 0.0);
		mesh0.position = new BABYLON.Vector3(-5.5, 2.5, 2.5);

		var rect0 = new GUI.Rectangle();
		rect0.cornerRadius = 8;
		rect0.background = '#00000000';
		rect0.color = '#00000000';
		advancedTexture0.addControl(rect0);

		var text0 = new GUI.TextBlock();
		text0.color = 'white';
		text0.fontFamily = 'Sans-serif';
		text0.fontSize = 96;
		text0.fontWeight = 'bolder';
		text0.text = p0.nick + ': ' + p0.score;
		rect0.addControl(text0);
	}

	public update() {

	}
}
