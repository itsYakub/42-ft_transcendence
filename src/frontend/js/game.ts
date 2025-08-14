import * as BABYLON from 'babylonjs'

/*
	Entry point for the game
*/
export function startMatch(p1Name: string, p2Name: string, options: any = null) {

	// This is a button in the dialog with simulates p1 winning a game. Call the endMatch function from within your code
	const winMatchButton = document.querySelector("#winMatchButton");
	if (winMatchButton) {
		const losingScore = Math.floor(Math.random() * 9);
		winMatchButton.textContent = `${p1Name} 10 : ${losingScore} ${p2Name}`;
		winMatchButton.addEventListener("click", () => {
			endMatch(10, losingScore, p2Name);
		}, { once: true } );
	}

	// This is a button in the dialog with simulates p1 losing a game. Call the endMatch function from within your code
	const loseMatchButton = document.querySelector("#loseMatchButton");
	if (loseMatchButton) {
		const losingScore = Math.floor(Math.random() * 9);
		loseMatchButton.textContent = `${p1Name} ${losingScore} : 10 ${p2Name}`;
		loseMatchButton.addEventListener("click", () => {
			endMatch(losingScore, 10, p2Name);
		}, { once: true } );
	}

	g_game.setupElements();
}

/*
	When the match ends with a definitive winner
*/
function endMatch(p1Score: number, p2Score: number, p2Name: string) {
	document.dispatchEvent(new CustomEvent("matchOver", {
		detail: {
			p1Score,
			p2Score,
			p2Name
		}
	}));
	
	g_game.dispose();
}

/* NOTE(joleksia):
 *  Game class
 * */

export class Game {
	/* HTML DOM Elements
	 * */
	private m_dialog : HTMLDialogElement;
	private	m_canvas : HTMLCanvasElement;

	/* babylonjs elements
	 * */
	private	m_engine : BABYLON.Engine;
	private	m_scene : BABYLON.Scene;

	/* SECTION:
	 *  Public Methods
	 * */
	
	public	setupElements() {
		/* Get the dialog element from the document
		 * */
		console.log('[ INFO ] Referencing the modal dialog');
		this.m_dialog = document.getElementById('gameDialog') as HTMLDialogElement;

		/* Create a canvas element and set it as the child of the dialog
		 * */
		console.log('[ INFO ] Creating a canvas object');
		this.m_canvas = document.createElement('canvas');
		this.m_canvas.width = this.m_dialog.clientWidth;
		this.m_canvas.height = this.m_dialog.clientHeight;

		/* Create a babylon layer
		 * */
		console.log('[ INFO ] Creating a babylon engine');
		this.m_engine = new BABYLON.Engine(this.m_canvas, true, {preserveDrawingBuffer: true, stencil: true } );

		console.log('[ INFO ] Creating a babylon scene');
		this.m_scene = this.createScene();
		
		console.log('[ INFO ] Preparing the game');
		this.m_dialog.appendChild(this.m_canvas);
		this.m_dialog.showModal();
		this.m_engine.runRenderLoop(() => this.m_scene.render());

		console.log('[ INFO ] Game is running...');
	}

	public	dispose() {
		console.log('[ INFO ] Disposing babylon engine');
		this.m_engine.stopRenderLoop();
		this.m_engine.dispose();

		console.log('[ INFO ] Removing canvas object from dialog');
		this.m_dialog.removeChild(this.m_canvas);
		
		console.log('[ INFO ] Closing dialog');
		this.m_dialog.close();
		
		console.log('[ INFO ] Game is disposed...');
	}

	/* SECTION:
	 *  Private Methods
	 * */

	private	createScene() {
		let	scene = new BABYLON.Scene(this.m_engine);
		let	camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -5), scene);
        camera.setTarget(BABYLON.Vector3.Zero());

		scene.clearColor = new BABYLON.Color4(0.2, 0.2, 0.2, 1.0);
		return (scene);
	}
}

/* NOTE(joleksia):
 *  Global game object
 * */
export var	g_game : Game = new Game();
