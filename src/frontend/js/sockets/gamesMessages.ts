import { Message, Result, User } from "../../../common/interfaces.js";
import { startMatch } from "../game/game.js";
import { navigate } from "../index.js";
import { currentPage } from "./clientSocket.js";

/*
	A user has entered or left a game (match/tournament)
*/
export async function userJoinOrLeave(user: User, message: Message) {
	if ("game" != currentPage())
		return;

	if (!user.gameId) {
		navigate("/game");
		return;
	}

	if (user.gameId == message.gameId && user.userId != message.fromId) {
		const gamerBox = await fetch("/api/gamers");
		const gamers = await gamerBox.json();
		if (Result.SUCCESS == gamers.result) {
			const gameMatchReadyForm = document.querySelector("#gamerMatchReadyForm");
			if (gameMatchReadyForm)
				gameMatchReadyForm.innerHTML = gamers.value;
		}
	}
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
