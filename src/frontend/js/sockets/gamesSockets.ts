import { startMatch } from "./../game/game.js";
import { navigate } from "./../index.js";
import { currentPage } from "./socket.js";

/*
	A socket message corcerning the game page
*/
export function handleIncomingGameMessage(user: any, message: any) {
	switch (message.type) {
		case "game-join":
		case "game-leave":
			gameChange(user, message);
			break;
		case "game-gamer-ready":
			gamePlayerReady(user, message);
			break;
		case "game-chat":
			gameChat(user, message);
			break;
		case "game-ready":
			gameReady(user, message);
			break;
	}
}

/*
	A user has entered or left a game (match/tournament)
*/
async function gameChange(user: any, message: any) {
	if ("game" != currentPage())
		return;

	if (!user.gameID) {
		navigate("/game");
		return;
	}

	if (user.gameID == message.gameID) {
		const gamerResponse = await fetch("/api/gamers");
		const gamers = await gamerResponse.json();
		if (200 == gamers.code)
			document.querySelector("#gamerMatchReadyForm").innerHTML = gamers.html;
	}
}

/*
	A user has clicked the Ready button
*/
async function gamePlayerReady(user: any, message: any) {
	if ("game" != currentPage())
		return;

	if (user.gameID == message.gameID) {
		const gamerResponse = await fetch("/api/gamers");
		const gamers = await gamerResponse.json();
		if (200 == gamers.code)
			document.querySelector("#gamerMatchReadyForm").innerHTML = gamers.html;
	}
}

/*
	A chat message has been sent to a game (match/tournament)
*/
async function gameChat(user: any, message: any) {
	if ("game" != currentPage())
		return;

	if (user.gameID == message.gameID) {
		const messagesResponse = await fetch("/api/game-messages");
		const messages = await messagesResponse.json();
		console.log(messages);
		if (200 == messages.code) {
			(document.querySelector("#sendMatchMessageForm") as HTMLFormElement).message.value = "";
			document.querySelector("#messagesDiv").innerHTML = messages.html;
		}
	}
}

async function gameReady(user: any, message: any) {
	if ("game" != currentPage())
		return;

	if (user.gameID == message.gameID)
		startMatch("John", "Ed");
}
