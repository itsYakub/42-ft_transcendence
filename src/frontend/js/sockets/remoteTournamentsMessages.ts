import { Message, MessageType, Result, User, UserType } from "../../../common/interfaces.js";
import { translate } from "../../../common/translations.js";
import { g_game, GameMode } from "../class/game.js";
import { tournamentListeners } from "../game/tournament.js";
import { getLanguage, navigate, showAlert } from "../index.js";
import { currentPage, sendMessageToServer } from "./clientSocket.js";

export function createRemoteTournament() {
	const gameId = `t${Date.now().toString(36).substring(5)}`;
	joiningTournament(gameId);
}

export function joiningTournament(gameId: string) {
	sendMessageToServer({
		type: MessageType.TOURNAMENT_JOIN,
		gameId
	});
}

export function tournamentGamerIsReady() {
	sendMessageToServer({
		type: MessageType.TOURNAMENT_GAMER_READY
	});
}

export function tournamentGamerLeaving() {
	sendMessageToServer({
		type: MessageType.TOURNAMENT_LEAVE
	});
}

export function sendTournamentMessage(chat: string) {
	sendMessageToServer({
		type: MessageType.TOURNAMENT_CHAT,
		chat
	});
}

/*
	A user has entered or left a tournament
*/
export async function joinOrLeaveTournament(user: User, message: Message) {
	if (UserType.GUEST == user.userType && !user.gameId) {
		navigate(window.location.href);
		return;
	}

	if (!isMessageForMe(user, message))
		return;

	if (!user.gameId) {
		navigate(window.location.href, false);
		return;
	}

	if (user.gameId == message.gameId) {
		const tournamentDetailsContainer = document.querySelector("#tournamentDetailsContainer");
		if (tournamentDetailsContainer)
			tournamentDetailsContainer.innerHTML = translate(getLanguage(), message.content);
		const gamers = document.getElementsByClassName("tournamentGamer").length;
		const tournamentPlayersLegend = document.querySelector("#tournamentPlayersLegend");
		tournamentPlayersLegend.innerHTML = translate(getLanguage(), `${gamers} / 4 %%TEXT_PLAYERS%%`);
		tournamentListeners();
	}
}

/*
	A chat message has been sent to a tournament
*/
export async function tournamentChat(user: User, message: Message) {
	if (!isMessageForMe(user, message))
		return;

	if (user.gameId == message.gameId) {
		const messagesBox = await fetch("/api/game-chats");
		const messages = await messagesBox.json();
		if (Result.SUCCESS == messages.result) {
			const tournamentMessagesDiv = document.querySelector("#tournamentMessagesDiv");
			if (tournamentMessagesDiv)
				tournamentMessagesDiv.innerHTML = messages.value;
		}
	}
}

export async function updateTournamentDetails(user: User, message: Message) {
	if (!isMessageForMe(user, message))
		return;

	const contentBox = await fetch("/api/tournament");

	const json = await contentBox.json();
	if (Result.SUCCESS == json.result) {
		const tournamentTitle = document.querySelector("#tournamentTitle");
		if (tournamentTitle) {
			if (3 == message.match?.matchNumber)
				tournamentTitle.innerHTML = translate(getLanguage(), "%%TEXT_REMOTE_TOURNAMENT%% - %%TEXT_TOURNAMENT_FINAL%%");
			else
				tournamentTitle.innerHTML = translate(getLanguage(), "%%TEXT_REMOTE_TOURNAMENT%% - %%TEXT_TOURNAMENT_SEMI_FINALS%%");
		}

		const tournamentDetailsContainer = document.querySelector("#tournamentDetailsContainer");
		if (tournamentDetailsContainer) {
			tournamentDetailsContainer.innerHTML = translate(getLanguage(), json.contents);
			tournamentListeners();
		}
	}
}

export async function tournamentMatchStart(user: User, message: Message) {
	if (!isMessageForMe(user, message) || null == message.match)
		return;

	const match = message.match;
	if (user.userId == match.g1.userId || user.userId == match.g2.userId) {
		console.log("for me");
		setTimeout(async () => {
			const dialog = document.querySelector("#gameDialog");
			if (dialog) {
				dialog.addEventListener("matchOver", async (e: CustomEvent) => {
					const response = await fetch("/api/match-result/add", {
						method: "POST",
						headers: {
							"content-type": "application/json"
						},
						body: JSON.stringify({
							g2Nick: match.g1.nick == user.nick ? match.g2.nick : match.g1.nick,
							g1Score: e.detail["g1Score"],
							g2Score: e.detail["g2Score"],
						})
					});
					navigate("/");
				});
			}

			g_game.setupElements(GameMode.GAMEMODE_PVP, {
				nick: match.g1.nick
			}, {
				nick: match.g2.nick
			});
		}, 2000);
	}
	else
		console.log("not for me");
}

export function tournamentOver(user: User, message: Message) {
	if (!isMessageForMe(user, message))
		return;

	const match = message.match;
	const gamer = match.g1.score > match.g2.score ? match.g1 : match.g2;

	sendMessageToServer({
		type: MessageType.TOURNAMENT_OVER,
	});
	const alertDialog = document.querySelector("#alertDialog");
	alertDialog.addEventListener("close", async () => {
		navigate("/");
	});
	showAlert(`${translate(getLanguage(), "%%TEXT_CONGRATULATIONS%%")} ${gamer.nick}!`, false);
}

function isMessageForMe(user: User, message: Message) {
	if (message.gameId != user.gameId)
		return false;

	if (UserType.GUEST != user.userType && "game" != currentPage())
		return false;

	return true;
}
