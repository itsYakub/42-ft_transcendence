import * as BABYLON from 'babylonjs';

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
	private m_dialog : HTMLDialogElement;
	private	m_canvas : HTMLCanvasElement;

	public	setupElements() {
		/* Get the dialog element from the document
		 * */
		console.log('[ INFO ] Showing modal dialog');
		this.m_dialog = document.getElementById('gameDialog') as HTMLDialogElement;
		this.m_dialog.showModal();

		/* Create a canvas element and set it as the child of the dialog
		 * */
		console.log('[ INFO ] Creating a canvas object');
		this.m_canvas = document.createElement('canvas');
		this.m_canvas.width = this.m_dialog.clientWidth;
		this.m_canvas.height = this.m_dialog.clientHeight;

		console.log('[ INFO ] Appending canvas to dialog');
		this.m_dialog.appendChild(this.m_canvas);

		console.log('[ INFO ] Game is set up');
	}

	public dispose() {
		console.log('[ INFO ] Removing canvas object from dialog');
		this.m_dialog.removeChild(this.m_canvas);
		console.log('[ INFO ] Closing dialog');
		this.m_dialog.close();
		console.log('[ INFO ] Game is disposed');
	}
}

/* NOTE(joleksia):
 *  Global game object
 * */
export var	g_game : Game = new Game();
