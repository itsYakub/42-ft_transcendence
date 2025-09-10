import { getLanguage, isLoggedIn, showPage } from "../index.js";
import { g_game, GameMode } from '../class/game.js';
import { MessageType, Page, Result } from "../../../common/interfaces.js";
import { joiningTournament, tournamentGamerLeft } from "../sockets/remoteTournamentsMessages.js";
import { joiningMatch, matchGamerLeaving } from "../sockets/remoteMatchesMessages.js";
import { localTournamentHtml } from "../../../common/dynamicElements.js";
import { translate } from "../../../common/translations.js";
import { localTournamentListeners } from "./localTournament.js";
import { sendMessageToServer } from "../sockets/clientSocket.js";
import { createRemoteTournament, tournamentListeners } from "./remoteTournament.js";
import { numbersToNick } from "../../../common/utils.js";

export function gameListeners() {
	const localMatchButton = document.querySelector("#localMatchButton");
	if (localMatchButton)
		localMatchButton.addEventListener("click", async () => {
			if (!await isLoggedIn())
				return showPage(Page.AUTH);

			startLocalMatch()
		});

	const aiMatchButton = document.querySelector("#aiMatchButton");
	if (aiMatchButton)
		aiMatchButton.addEventListener("click", async () => {
			if (!await isLoggedIn())
				return showPage(Page.AUTH);

			startAiMatch()
		});

	const localTournamentButton = document.querySelector("#localTournamentButton");
	if (localTournamentButton) {
		localTournamentButton.addEventListener("click", async () => {
			if (!await isLoggedIn())
				return showPage(Page.AUTH);

			createLocalTournament();
		});
	}

	const remoteMatchButton = document.querySelector("#remoteMatchButton");
	if (remoteMatchButton) {
		remoteMatchButton.addEventListener("click", async () => {
			if (!await isLoggedIn())
				return showPage(Page.AUTH);

			const result = await createRemoteMatch();
			console.log(result);
			if (Result.SUCCESS == result) {
				showPage(Page.GAME);
				sendMessageToServer({
					type: MessageType.GAME_LIST_CHANGED
				});
			}
		});
	}

	const remoteTournamentButton = document.querySelector("#remoteTournamentButton");
	if (remoteTournamentButton)
		remoteTournamentButton.addEventListener("click", async () => {
			if (!await isLoggedIn())
				return showPage(Page.AUTH);

			const result = await createRemoteTournament();
			console.log(result);
			if (Result.SUCCESS == result) {
				showPage(Page.GAME);
				sendMessageToServer({
					type: MessageType.GAME_LIST_CHANGED
				});
			}
		});

	const joinMatchButtons = document.getElementsByClassName("joinMatchButton");
	for (var i = 0; i < joinMatchButtons.length; i++) {
		joinMatchButtons[i].addEventListener("click", async function () {
			if (!await isLoggedIn())
				return showPage(Page.AUTH);

			joiningMatch(this.dataset.id);
			showPage(Page.GAME);
		});
	}

	const leaveMatchButton = document.querySelector("#leaveMatchButton");
	if (leaveMatchButton) {
		leaveMatchButton.addEventListener("click", async () => {
			if (!await isLoggedIn())
				return showPage(Page.AUTH);

			console.log("clicked");
			matchGamerLeaving();
			showPage(Page.GAME);
		});
	}

	const joinTournamentButtons = document.getElementsByClassName("joinTournamentButton");
	for (var i = 0; i < joinTournamentButtons.length; i++) {
		joinTournamentButtons[i].addEventListener("click", async function () {
			if (!await isLoggedIn())
				return showPage(Page.AUTH);

			joiningTournament(this.dataset.id);
			showPage(Page.GAME);
		});
	}
}

async function startLocalMatch() {
	const nicksResponse = await fetch("/match/nicks");
	const nicksBox = await nicksResponse.json();
	if (Result.SUCCESS == nicksBox.result) {
		const dialog = document.querySelector("#gameDialog");
		if (dialog) {
			g_game.setupElements(GameMode.GAMEMODE_PVP, {
				nick: nicksBox.contents[0]
			}, {
				nick: numbersToNick(nicksBox.contents[1])
			});
		}
	}
}

async function startAiMatch() {
	const nicksResponse = await fetch("/match/nicks");
	const nicksBox = await nicksResponse.json();
	if (Result.SUCCESS == nicksBox.result) {
		const dialog = document.querySelector("#gameDialog");
		if (dialog) {
			g_game.setupElements(GameMode.GAMEMODE_AI, {
				nick: nicksBox.contents[0]
			}, {
				nick: numbersToNick(nicksBox.contents[1])
			});
		}
	}
}

async function createLocalTournament() {
	const nicks = await fetch("/tournament/nicks");
	const nicksBox = await nicks.json();
	if (Result.SUCCESS == nicksBox.result) {
		let newNicks = [];
		nicksBox.contents.forEach(nick => newNicks.push(numbersToNick(nick)));
		document.querySelector("#content").innerHTML = translate(getLanguage(), localTournamentHtml(newNicks));
		localTournamentListeners();
	}
}

export async function createRemoteMatch(): Promise<Result> {
	const response = await fetch(`/match/create`);
	return Result[await response.text()];
}
