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
		});
	}

	// This is a button in the dialog with simulates p1 losing a game. Call the endMatch function from within your code
	const loseMatchButton = document.querySelector("#loseMatchButton");
	if (loseMatchButton) {
		const losingScore = Math.floor(Math.random() * 9);
		loseMatchButton.textContent = `${p1Name} ${losingScore} : 10 ${p2Name}`;
		loseMatchButton.addEventListener("click", () => {
			endMatch(losingScore, 10, p2Name);
		});
	}

	// The tournament page has a dialog ready to go. Replace the contents in backend/game/game.ts with whatever you need
	const dialog = <HTMLDialogElement>document.querySelector("#gameDialog");
	dialog.showModal();
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
}
