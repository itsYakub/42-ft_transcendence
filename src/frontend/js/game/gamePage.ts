import { getLanguage, navigate } from "../index.js";
import { g_game, GameMode } from '../class/game.js';
import { TournamentMatch, MatchGamer, Result } from "../../../common/interfaces.js";
import { createRemoteTournament, joiningTournament } from "../sockets/remoteTournamentsMessages.js";
import { createRemoteMatch, joiningMatch } from "../sockets/remoteMatchesMessages.js";
import { localTournamentHtml } from "../../../common/dynamicElements.js";
import { translate } from "../../../common/translations.js";
import { localTournamentListeners } from "./localTournament.js";

export function gameFunctions() {
	const localMatchButton = document.querySelector("#localMatchButton");
	if (localMatchButton)
		localMatchButton.addEventListener("click", () => startLocalMatch());

	const aiMatchButton = document.querySelector("#aiMatchButton");
	if (aiMatchButton)
		aiMatchButton.addEventListener("click", () => startAiMatch());

	const localTournamentButton = document.querySelector("#localTournamentButton");
	if (localTournamentButton) {
		localTournamentButton.addEventListener("click", () => {
			createLocalTournament();

			//navigate(`/game`, false);
		});
	}

	const remoteMatchButton = document.querySelector("#remoteMatchButton");
	if (remoteMatchButton) {
		remoteMatchButton.addEventListener("click", () => {
			createRemoteMatch();
			navigate(`/game`, false);
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


// export function startMatch(match: TournamentMatch) {
// 	// The tournament page has a dialog ready to go. Replace the contents in backend/game/game.ts with whatever you need
// 	const dialog = <HTMLDialogElement>document.querySelector("#gameDialog");
// 	dialog.addEventListener("keydown", (e) => {
// 		if ("Escape" == e.key) {
// 			console.log("Escape pressed");
// 			//e.preventDefault();
// 		}
// 	});

// 	//g_game.setupElements(GameMode.GAMEMODE_PVP);
// }

async function startLocalMatch() {
	const userBoxResponse = await fetch("/api/user");
	const userBox = await userBoxResponse.json();
	if (Result.SUCCESS == userBox.result) {
		const dialog = document.querySelector("#gameDialog");
		if (dialog) {
			dialog.addEventListener("matchOver", async (e: CustomEvent) => {
				const response = await fetch("/api/match-result/add", {
						method: "POST",
						headers: {
							"content-type": "application/json"
						},
						body: JSON.stringify({
							g2Nick: "Guest",
							g1Score: e.detail["g1Score"],
							g2Score: e.detail["g2Score"],
						})
					});
			});
			g_game.setupElements(GameMode.GAMEMODE_PVP, userBox.contents, {
				nick: "Guest"
			});
		}
	}
}

async function startAiMatch() {
	const userBoxResponse = await fetch("/api/user");
	const userBox = await userBoxResponse.json();
	if (Result.SUCCESS == userBox.result) {
		g_game.setupElements(GameMode.GAMEMODE_AI, userBox.contents);
	}
}

async function createLocalTournament() {
	const userBoxResponse = await fetch("/api/user");
	const userBox = await userBoxResponse.json();
	if (Result.SUCCESS == userBox.result) {
		document.querySelector("#content").innerHTML = translate(getLanguage(), localTournamentHtml(userBox.user));
		localTournamentListeners();
	}
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
