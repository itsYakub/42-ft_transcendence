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
		
		var mesh = BABYLON.MeshBuilder.CreatePlane('ui-plane0', { width: 4, height: 1 } ); 
		var advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(mesh);

		var rect0 = new GUI.Rectangle();
		rect0.cornerRadius = 8;
		rect0.background = 'rgb(0.74, 0.17, 0.83)';
		advancedTexture.addControl(rect0);

		var text0 = new GUI.TextBlock();
		text0.color = 'white';
		text0.fontSize = 32;
		text0.text = p0.nick;
		rect0.addControl(text0);
	}

	public update() {

	}
}
