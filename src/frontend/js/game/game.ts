import { navigate } from "./../index.js";
import { sendMessageToServer } from "./../sockets/socket.js";
import { g_game } from './../class/game.js';
import { WebsocketMessageGroup, WebsocketMessageType } from "../../../common/interfaces.js";

export function gameFunctions() {
	const localMatchButton = document.querySelector("#localMatchButton");
	if (localMatchButton) {
		localMatchButton.addEventListener("click", () => {
			navigate("/match/local")
		});
	}

	const aiMatchButton = document.querySelector("#aiMatchButton");
	if (aiMatchButton) {
		aiMatchButton.addEventListener("click", () => {
			navigate("/match/local")
		});
	}

	const remoteMatchButton = document.querySelector("#remoteMatchButton");
	if (remoteMatchButton) {
		remoteMatchButton.addEventListener("click", async () => {
			const gameId = `m${Date.now().toString(36).substring(5)}`;

			sendMessageToServer({
				group: WebsocketMessageGroup.GAME,
				type: WebsocketMessageType.JOIN,
				gameId
			});

			navigate(`/game`, false);
		});
	}

	const localTournamentButton = document.querySelector("#localTournamentButton");
	if (localTournamentButton) {
		localTournamentButton.addEventListener("click", () => {
			//navigate("/tournament/local")
		});
	}

	const remoteTournamentButton = document.querySelector("#remoteTournamentButton");
	if (remoteTournamentButton) {
		remoteTournamentButton.addEventListener("click", async () => {
			const gameId = `t${Date.now().toString(36).substring(5)}`;
			sendMessageToServer({
				group: WebsocketMessageGroup.GAME,
				type: WebsocketMessageType.JOIN,
				gameId
			});

			navigate(`/game`, false);
		});
	}

	const joinGameButtons = document.getElementsByClassName("joinGameButton");
	for (var i = 0; i < joinGameButtons.length; i++) {
		joinGameButtons[i].addEventListener("click", async function () {
			sendMessageToServer({
				group: WebsocketMessageGroup.GAME,
				type: WebsocketMessageType.JOIN,
				gameId: this.dataset.id
			});

			navigate(`/game`, false);
		})
	}
}

/*
	Entry point for the game
*/
export function startMatch(p1Name: string, p2Name: string) {

	// This is a button in the dialog with simulates p1 winning a game. Call the endMatch function from within your code
	const winMatchButton = document.querySelector("#winMatchButton");
	if (winMatchButton) {
		const losingScore = Math.floor(Math.random() * 9);
		winMatchButton.textContent = `${p1Name} 10 : ${losingScore} ${p2Name}`;
		winMatchButton.addEventListener("click", () => {
			endMatch(10, losingScore, p2Name);
		}, { once: true });
	}

	// This is a button in the dialog with simulates p1 losing a game. Call the endMatch function from within your code
	const loseMatchButton = document.querySelector("#loseMatchButton");
	if (loseMatchButton) {
		const losingScore = Math.floor(Math.random() * 9);
		loseMatchButton.textContent = `${p1Name} ${losingScore} : 10 ${p2Name}`;
		loseMatchButton.addEventListener("click", () => {
			endMatch(losingScore, 10, p2Name);
		}, { once: true });
	}

	// The tournament page has a dialog ready to go. Replace the contents in backend/game/game.ts with whatever you need
	const dialog = <HTMLDialogElement>document.querySelector("#gameDialog");
	dialog.addEventListener("keydown", (e) => {
		if ("Escape" == e.key) {
			console.log("gamer quit");
			//e.preventDefault();
			//alert("Quitter!");
			// Report gamer lost
		}
	});

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
