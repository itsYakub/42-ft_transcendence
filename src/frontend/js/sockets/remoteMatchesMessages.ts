import { Message, MessageType, Result, User } from "../../../common/interfaces.js";
import { translate } from "../../../common/translations.js";
import { g_game, GameMode } from "../class/game.js";
import { getLanguage, navigate } from "../index.js";
import { currentPage, sendMessageToServer } from "./clientSocket.js";

export function createRemoteMatch() {
	const gameId = `m${Date.now().toString(36).substring(5)}`;
	joiningMatch(gameId);
}

export function joiningMatch(gameId: string) {
	sendMessageToServer({
		type: MessageType.MATCH_JOIN,
		gameId
	});
}

export function matchGamerLeaving() {
	sendMessageToServer({
		type: MessageType.MATCH_LEAVE
	});
}

/*
	A chat message has been sent to a game (match/tournament)
*/
export async function tournamentChat(user: User, message: Message) {
	if ("game" != currentPage())
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

export async function updateMatchDetails(user: User, message: Message) {
	if ("game" == currentPage() && user.gameId == message.gameId) {
		console.log("for me");
		const matchLobbyDetailsContainer = document.querySelector("#matchLobbyDetailsContainer");
		if (matchLobbyDetailsContainer)
			matchLobbyDetailsContainer.innerHTML = translate(getLanguage(), message.content);
	}
	else
		console.log("not for me");
}

export async function startingMatch(user: User, message: Message) {
	if (message.gameId != user.gameId)
		return;

	setTimeout(async () => {
		const gamersBox = await fetch("/api/match/gamers");
		const json = await gamersBox.json();
		if (Result.SUCCESS != json.result || 2 != json.contents.length)
			return;

		//g_game.setupElements(user.gameId, GameMode.GAMEMODE_PVP)
	}, 2000);
}

export function actuallyStartingMatch(user: User, message: Message) {
	if (message.gameId != user.gameId)
		return;

	g_game.actuallyStart();
}

export async function gameReady(user: User, message: Message) {
	if (user.gameId != message.gameId)
		return;

	if (message.gameId.startsWith("m")) {
		console.log("match");
		//TODO change this
		//startMatch(null);//"John", "Ed");
	}
	else {
		console.log("tournament");
	}
}
