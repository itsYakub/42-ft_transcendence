import { getLanguage, isLoggedIn, showPage } from "../index.js";
import { g_game, GameMode } from '../class/game.js';
import { Page, Result } from "../../../common/interfaces.js";
import { createRemoteTournament, joiningTournament } from "../sockets/remoteTournamentsMessages.js";
import { createRemoteMatch, joiningMatch, matchGamerLeaving } from "../sockets/remoteMatchesMessages.js";
import { localTournamentHtml } from "../../../common/dynamicElements.js";
import { translate } from "../../../common/translations.js";
import { localTournamentListeners } from "./localTournament.js";

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

			createRemoteMatch();
			showPage(Page.GAME);
		});
	}

	const remoteTournamentButton = document.querySelector("#remoteTournamentButton");
	if (remoteTournamentButton)
		remoteTournamentButton.addEventListener("click", async () => {
			if (!await isLoggedIn())
				return showPage(Page.AUTH);

			createRemoteTournament();
			showPage(Page.GAME);
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
				nick: nicksBox.contents[1]
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
				nick: nicksBox.contents[1]
			});
		}
	}
}

async function createLocalTournament() {
	const nicks = await fetch("/tournament/nicks");
	const nicksBox = await nicks.json();
	if (Result.SUCCESS == nicksBox.result) {
		document.querySelector("#content").innerHTML = translate(getLanguage(), localTournamentHtml(nicksBox.contents));
		localTournamentListeners();
	}
}
