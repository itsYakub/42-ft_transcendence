import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

import { Player } from './player.js';

/* SECTION:
 *  Classes
 * */

export class Gui {
    /* HTML DOM Elements */
    private m_canvas: HTMLCanvasElement;
    
	/* babylonjs elements */
	private	m_rect0 : GUI.Rectangle;
	private	m_rect1 : GUI.Rectangle;
	private m_text0 : GUI.TextBlock;
	private m_text1 : GUI.TextBlock;

    /* Game objects */
    private m_player0: Player;
    private m_player1: Player;

	/* SECTION: Public Methods */

	public constructor(canvas : HTMLCanvasElement, p0 : Player, p1 : Player) {
		this.m_canvas = canvas;
		this.m_player0 = p0;
		this.m_player1 = p1;

		/* Create the GUI mesh for player0
		 * */		
		var mesh0 = BABYLON.MeshBuilder.CreatePlane('ui-plane0', { size: 2, width: 6, height: 6 } ); 
		var advancedTexture0 = GUI.AdvancedDynamicTexture.CreateForMesh(mesh0);
		mesh0.rotation = new BABYLON.Vector3(1.5, 0.0, 0.0);
		mesh0.position = new BABYLON.Vector3(-3.0, 2.5, 2.5);

		var rect0 = new GUI.Rectangle();
		rect0.background = '#00000000';
		rect0.color = '#00000000';
		advancedTexture0.addControl(rect0);

		var text0 = new GUI.TextBlock();
		text0.color = 'white';
		text0.fontFamily = 'Sans-serif';
		text0.fontSize = 64;
		text0.fontWeight = 'bolder';
		text0.text = p0.nick + ': ' + p0.score;
		text0.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
		rect0.addControl(text0);
		
		/* Create the GUI mesh for player1
		 * */		
		var mesh1 = BABYLON.MeshBuilder.CreatePlane('ui-plane1', { size: 2, width: 6, height: 6 } ); 
		var advancedTexture1 = GUI.AdvancedDynamicTexture.CreateForMesh(mesh1);
		mesh1.rotation = new BABYLON.Vector3(1.5, 0.0, 0.0);
		mesh1.position = new BABYLON.Vector3(3.0, 2.5, 2.5);

		var rect1 = new GUI.Rectangle();
		rect1.background = '#00000000';
		rect1.color = '#00000000';
		advancedTexture1.addControl(rect1);

		var text1 = new GUI.TextBlock();
		text1.color = 'white';
		text1.fontFamily = 'Sans-serif';
		text1.fontSize = 64;
		text1.fontWeight = 'bolder';
		text1.text = p1.score + ' :' + p1.nick;
		text1.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
		rect1.addControl(text1);

		/* Assign references to the GUI properties
		 * */
		this.m_rect0 = rect0;
		this.m_rect1 = rect1;
		this.m_text0 = text0;
		this.m_text1 = text1;
	}

	public update() {
		this.m_text0.text = this.m_player0.nick + ': ' + this.m_player0.score;
		this.m_text1.text = this.m_player1.score + ' :' + this.m_player1.nick;
	}
}
