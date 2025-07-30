/*
	Entry point for the game
*/
export function startMatch(p1Name: string, p2Name: string, options: any = null) {

	// This is a button in the dialog with simulates someone winning a game. Call the endMatch function from within your code
	const endMatchButton = document.getElementById("endMatchButton");
	if (endMatchButton) {
		endMatchButton.addEventListener("click", () => {
			const winningPlayer = Math.floor(Math.random() * 2);
			const losingScore = Math.floor(Math.random() * 9);
			if (0 == winningPlayer)
				endMatch(10, losingScore);
			else
				endMatch(losingScore, 10);
		});
	}

	// The tournament page has a dialog ready to go. Replace the contents in backend/game/game.ts with whatever you need
	const dialog = <HTMLDialogElement>document.getElementById("gameDialog");
	dialog.showModal();
}

/*
	When the match ends with a definitive winner
*/
function endMatch(p1Score: number, p2Score: number) {
	document.dispatchEvent(new CustomEvent("matchOver", {
		detail: {
			p1Score,
			p2Score
		}
	}));
}
