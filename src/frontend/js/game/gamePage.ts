import { getLanguage, navigate } from "../index.js";
import { g_game, GameMode } from '../class/game.js';
import { Result } from "../../../common/interfaces.js";
import { createRemoteTournament, joiningTournament } from "../sockets/remoteTournamentsMessages.js";
import { createRemoteMatch, joiningMatch, matchGamerLeaving } from "../sockets/remoteMatchesMessages.js";
import { localTournamentHtml } from "../../../common/dynamicElements.js";
import { translate } from "../../../common/translations.js";
import { localTournamentListeners } from "./localTournament.js";
import { sendMessageToServer } from "../sockets/clientSocket.js";

export function gameListeners() {
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
		});
	}

	const remoteMatchButton = document.querySelector("#remoteMatchButton");
	if (remoteMatchButton) {
		remoteMatchButton.addEventListener("click", () => {
			createRemoteMatch();
			navigate(window.location.href, false);
		});
	}

	const remoteTournamentButton = document.querySelector("#remoteTournamentButton");
	if (remoteTournamentButton)
		remoteTournamentButton.addEventListener("click", () => {
			createRemoteTournament();
			navigate(window.location.href, false);
		});

	const joinMatchButtons = document.getElementsByClassName("joinMatchButton");
	for (var i = 0; i < joinMatchButtons.length; i++) {
		joinMatchButtons[i].addEventListener("click", function () {
			joiningMatch(this.dataset.id)
			navigate(window.location.href, false);
		});
	}

	const leaveMatchButton = document.querySelector("#leaveMatchButton");
	if (leaveMatchButton) {
		leaveMatchButton.addEventListener("click", () => {
			matchGamerLeaving();
		});
	}

	const joinTournamentButtons = document.getElementsByClassName("joinTournamentButton");
	for (var i = 0; i < joinTournamentButtons.length; i++) {
		joinTournamentButtons[i].addEventListener("click", function () {
			joiningTournament(this.dataset.id)
			navigate(window.location.href, false);
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
	const nicksResponse = await fetch("/api/match/nicks");
	const nicksBox = await nicksResponse.json();
	if (Result.SUCCESS == nicksBox.result) {
		const dialog = document.querySelector("#gameDialog");
		if (dialog) {
			const g2Nick = nicksBox.contents[1];
			dialog.addEventListener("matchOver", async (e: CustomEvent) => {
				const response = await fetch("/api/match-result/add", {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({
						g2Nick,
						g1Score: e.detail["g1Score"],
						g2Score: e.detail["g2Score"],
					})
				});
			});
			g_game.setupElements(GameMode.GAMEMODE_PVP, {
				nick: nicksBox.contents[0]
			}, {
				nick: g2Nick
			});
		}
	}
}

async function startAiMatch() {
	const nicksResponse = await fetch("/api/match/nicks");
	const nicksBox = await nicksResponse.json();
	if (Result.SUCCESS == nicksBox.result) {
		const dialog = document.querySelector("#gameDialog");
		if (dialog) {
			const g2Nick = nicksBox.contents[1];
			dialog.addEventListener("matchOver", async (e: CustomEvent) => {
				const response = await fetch("/api/match-result/add", {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({
						g2Nick,
						g1Score: e.detail["g1Score"],
						g2Score: e.detail["g2Score"],
					})
				});
			});
			g_game.setupElements(GameMode.GAMEMODE_AI, {
				nick: nicksBox.contents[0]
			}, {
				nick: g2Nick
			});
		}
	}
}

async function createLocalTournament() {
	const nicks = await fetch("/api/tournament/nicks");
	const nicksBox = await nicks.json();
	if (Result.SUCCESS == nicksBox.result) {
		document.querySelector("#content").innerHTML = translate(getLanguage(), localTournamentHtml(nicksBox.contents));
		localTournamentListeners();
	}
}
