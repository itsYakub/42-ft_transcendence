import { Message, MessageType, Result, User } from "../../../common/interfaces.js";
import { translate } from "../../../common/translations.js";
import { startMatch } from "../game/game.js";
import { matchLobbyFunctions } from "../game/matchLobby.js";
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

export function matchGamerIsReady() {
	console.log("clicked button");
	sendMessageToServer({
		type: MessageType.MATCH_GAMER_READY
	});
}

export function matchGamerLeaving() {
	sendMessageToServer({
		type: MessageType.MATCH_LEAVE
	});
}

export function sendMatchMessage(chat: string) {
	sendMessageToServer({
		type: MessageType.USER_SEND_GAME_CHAT,
		chat
	});
}

/*
	A user has entered or left a match
*/
export async function userJoinOrLeave(user: User, message: Message) {
	if ("game" != currentPage())
		return;

	if (!user.gameId) {
		navigate("/game");
		return;
	}

	// if (user.gameId == message.gameId && user.userId != message.fromId) {
	// 	const gamerBox = await fetch("/api/gamers");
	// 	const gamers = await gamerBox.json();
	// 	if (Result.SUCCESS == gamers.result) {
	// 		const gameMatchReadyForm = document.querySelector("#gamerMatchReadyForm");
	// 		if (gameMatchReadyForm)
	// 			gameMatchReadyForm.innerHTML = gamers.value;
	// 	}
	// }
}

/*
	A chat message has been sent to a game (match/tournament)
*/
export async function userSendGameChat(user: User, message: Message) {
	if ("game" != currentPage())
		return;

	if (user.gameId == message.gameId) {
		const messagesBox = await fetch("/api/game-chats");
		const messages = await messagesBox.json();
		if (Result.SUCCESS == messages.result) {
			(document.querySelector("#sendMatchMessageForm") as HTMLFormElement).message.value = "";
			document.querySelector("#messagesDiv").innerHTML = messages.value;
		}
	}
}

export async function updateMatchDetails(user: User, message: Message) {
	if ("game" == currentPage() && user.gameId == message.gameId) {
		console.log("for me");

		// const contentBox = await fetch("/api/tournament");

		// const json = await contentBox.json();
		// if (Result.SUCCESS == json.result) {
		// 	const tournamentTitle = document.querySelector("#tournamentTitle");
		// 	if (tournamentTitle) {
		// 		if (3 == message.match?.matchNumber)
		// 			tournamentTitle.innerHTML = translate(getLanguage(), "%%TEXT_TOURNAMENT%% - %%TEXT_TOURNAMENT_FINAL%%");
		// 		else
		// 			tournamentTitle.innerHTML = translate(getLanguage(), "%%TEXT_TOURNAMENT%% - %%TEXT_TOURNAMENT_SEMI_FINALS%%");
		// 	}

		const matchLobbyDetailsContainer = document.querySelector("#matchLobbyDetailsContainer");
		if (matchLobbyDetailsContainer) {
			matchLobbyDetailsContainer.innerHTML = translate(getLanguage(), message.content);
			matchLobbyFunctions();
			// 		}
		}
	}
	else
		console.log("not for me");
}

export async function gameReady(user: User, message: Message) {
	if (user.gameId != message.gameId)
		return;

	if (message.gameId.startsWith("m")) {
		console.log("match");
		//TODO change this
		startMatch(null);//"John", "Ed");
	}
	else {
		console.log("tournament");
	}
}
