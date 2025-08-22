import { Result, User, WebsocketMessage, WebsocketMessageType } from "../../../common/interfaces.js";
import { startMatch } from "./../game/game.js";
import { navigate } from "./../index.js";
import { currentPage } from "./socket.js";

/*
	A socket message concerning the game page
*/
export function handleIncomingGameMessage(user: User, message: WebsocketMessage) {
	console.log("incoming game message", message);
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
async function gameChange(user: User, message: WebsocketMessage) {
	if ("game" != currentPage())
		return;

	if (!user.gameId) {
		console.log("in lobby");
		navigate("/game");
		return;
	}

	if (user.gameId == message.gameId && user.userId != message.fromId) {
		console.log("changing", user);
		const gamerResponse = await fetch("/api/gamers");
		const gamers = await gamerResponse.json();
		if (Result.SUCCESS == gamers.result)
			document.querySelector("#gamerMatchReadyForm").innerHTML = gamers.html;
	}
}

/*
	A chat message has been sent to a game (match/tournament)
*/
async function gameChat(user: User, message: WebsocketMessage) {
	if ("game" != currentPage())
		return;

	if (user.gameId == message.gameId) {
		const messagesResponse = await fetch("/api/game-messages");
		const messages = await messagesResponse.json();
		if (Result.SUCCESS == messages.result) {
			(document.querySelector("#sendMatchMessageForm") as HTMLFormElement).message.value = "";
			document.querySelector("#messagesDiv").innerHTML = messages.html;
		}
	}
}

async function gameReady(user: User, message: WebsocketMessage) {
	if ("game" != currentPage())
		return;

	if (user.gameId == message.gameId)
		startMatch("John", "Ed");
}
