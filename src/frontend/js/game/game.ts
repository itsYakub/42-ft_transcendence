import { getLanguage, navigate } from "./../index.js";
import { g_game, GameMode } from './../class/game.js';
import { TournamentMatch, MatchGamer } from "../../../common/interfaces.js";
import { translate } from "../../../common/translations.js";
import { localMatchFunctions } from "./localMatch.js";
import { createRemoteTournament, joiningTournament } from "../sockets/remoteTournamentsMessages.js";
import { createRemoteMatch, joiningMatch } from "../sockets/remoteMatchesMessages.js";

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
		remoteMatchButton.addEventListener("click", () => {
			createRemoteMatch();
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
	if (remoteTournamentButton)
		remoteTournamentButton.addEventListener("click", () => {
			createRemoteTournament();
			navigate(`/game`, false);
		});

	const joinMatchButtons = document.getElementsByClassName("joinMatchButton");
	for (var i = 0; i < joinMatchButtons.length; i++) {
		joinMatchButtons[i].addEventListener("click", function () {
			joiningMatch(this.dataset.id)
			navigate("/game", false);
		});
	}

	const joinTournamentButtons = document.getElementsByClassName("joinTournamentButton");
	for (var i = 0; i < joinTournamentButtons.length; i++) {
		joinTournamentButtons[i].addEventListener("click", function () {
			joiningTournament(this.dataset.id)
			navigate("/game", false);
		});
	}
}

/*
	Entry point for the game
*/
export function startMatch(match: TournamentMatch) {
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
