import { getLanguage, navigate, showAlert } from "./../index.js";
import { sendMessageToServer } from "../sockets/clientSocket.js";
import { g_game, GameMode } from './../class/game.js';
import { Match, MatchGamer, MessageType } from "../../../common/interfaces.js";
import { translate } from "../../../common/translations.js";
import { localMatchFunctions } from "./localMatch.js";

export function gameFunctions() {
	const localMatchButton = document.querySelector("#localMatchButton");
	if (localMatchButton) {
		localMatchButton.addEventListener("click", async () => {
			const response = await fetch("/api/game/local-match");
			const text = await response.text();
			document.querySelector("#content").innerHTML = translate(getLanguage(), text);
			localMatchFunctions();
		});
	}

	const aiMatchButton = document.querySelector("#aiMatchButton");
	if (aiMatchButton) {
		aiMatchButton.addEventListener("click", () => {
			startAiMatch({
				nick: "abc",
				ready: true,
				score: 0,
				userId: 1
			});
		});
	}

	const remoteMatchButton = document.querySelector("#remoteMatchButton");
	if (remoteMatchButton) {
		remoteMatchButton.addEventListener("click", async () => {
			const gameId = `m${Date.now().toString(36).substring(5)}`;

			sendMessageToServer({
				type: MessageType.USER_JOIN_GAME,
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
				type: MessageType.USER_JOIN_GAME,
				gameId
			});

			navigate(`/game`, false);
		});
	}

	const joinGameButtons = document.getElementsByClassName("joinGameButton");
	for (var i = 0; i < joinGameButtons.length; i++) {
		joinGameButtons[i].addEventListener("click", async function () {
			sendMessageToServer({
				type: MessageType.USER_JOIN_GAME,
				gameId: this.dataset.id
			});
		//	setTimeout(function(){
  navigate(`/game`, false);
//}, 2000);
			
		})
	}
}

/*
	Entry point for the game
*/
export function startMatch(match: Match) {
	// The tournament page has a dialog ready to go. Replace the contents in backend/game/game.ts with whatever you need
	const dialog = <HTMLDialogElement>document.querySelector("#gameDialog");
	dialog.addEventListener("keydown", (e) => {
		if ("Escape" == e.key) {
			console.log("Escape pressed");
			//e.preventDefault();
		}
	});

	g_game.setupElements(GameMode.GAMEMODE_PVP);
}

function startAiMatch(gamer: MatchGamer) {
	g_game.setupElements(GameMode.GAMEMODE_AI);
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
