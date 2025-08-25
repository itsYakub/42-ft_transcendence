import { leaveGame } from "../../../backend/db/gameDb.js";
import { Result, User, WebsocketGameMessage, WebsocketMessage, WebsocketMessageType } from "../../../common/interfaces.js";
import { generateTournament } from "../game/tournament.js";
import { startMatch } from "./../game/game.js";
import { navigate } from "./../index.js";
import { currentPage } from "./socket.js";

/*
	A socket message concerning the game page
*/
export function handleIncomingGameMessage(user: User, message: WebsocketGameMessage) {
	switch (message.type) {
		case WebsocketMessageType.JOIN:
		case WebsocketMessageType.LEAVE:
			gameChange(user, message);
			break;
		case WebsocketMessageType.CHAT:
			gameChat(user, message);
			break;
		case WebsocketMessageType.READY:
			gameReady(user, message);
			break;
	}
}

/*
	A user has entered or left a game (match/tournament)
*/
async function gameChange(user: User, message: WebsocketGameMessage) {
	if ("game" != currentPage())
		return;

	if (!user.gameId) {
		navigate("/game");
		return;
	}

	if (user.gameId == message.gameId && user.userId != message.fromId) {
		const gamerBox = await fetch("/api/gamers");
		const gamers = await gamerBox.json();
		if (Result.SUCCESS == gamers.result)
			document.querySelector("#gamerMatchReadyForm").innerHTML = gamers.value;
	}
}

/*
	A chat message has been sent to a game (match/tournament)
*/
async function gameChat(user: User, message: WebsocketGameMessage) {
	if ("game" != currentPage())
		return;

	if (user.gameId == message.gameId) {
		const messagesBox = await fetch("/api/game-chats");
		const messages = await messagesBox.json();
		console.log(messages);
		if (Result.SUCCESS == messages.result) {
			(document.querySelector("#sendMatchMessageForm") as HTMLFormElement).message.value = "";
			document.querySelector("#messagesDiv").innerHTML = messages.value;
		}
	}
}

async function gameReady(user: User, message: WebsocketGameMessage) {
	console.log(user, message);
	if (user.gameId != message.gameId || user.userId != message.fromId)
		return;

	if (message.gameId.startsWith("m")) {
		console.log("match");
		startMatch("John", "Ed");
	}
	else {
		console.log("tournament");
		generateTournament();
	}
}
