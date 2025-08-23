import { accountFunctions } from "../account/account.js";
import { currentPage, sendMessageToServer } from "./socket.js";
import { navigate } from "../index.js";
import { Result, StringBox, User, WebsocketMessage, WebsocketMessageType } from "../../../common/interfaces.js";

export function handleIncomingUserMessage(user: User, message: WebsocketMessage) {
	switch (message.type) {
		case WebsocketMessageType.CHAT:
			userChat(user, message);
			break;
		case WebsocketMessageType.INVITE:
			userInvite(user, message);
			break;
		case WebsocketMessageType.JOIN:
		case WebsocketMessageType.LEAVE:
			userChangeStatus(user, message);
			break;
		case WebsocketMessageType.READY:
			userReady(user, message);
			break;
	}
}

async function userChat(user: User, message: WebsocketMessage) {
	if ("users" != currentPage())
		return;

	let otherId: number = 0;
	if (message.toId == user.userId)
		otherId = message.fromId;
	else if (message.fromId == user.userId)
		otherId = message.toId;

	if (0 != otherId) {
		const messagesResponse = await fetch(`/api/user-chats/${otherId}`);
		const messages = await messagesResponse.json();
		if (Result.SUCCESS == messages.result) {
			(document.querySelector("#sendMessageForm") as HTMLFormElement).message.value = "";
			document.querySelector("#usersDiv").innerHTML = messages.usersHtml;
			document.querySelector("#messagesDiv").innerHTML = messages.messagesHtml;
			accountFunctions();
			//usersFunctions();
		}
	}
}

/*
	A user has clicked the Ready button
*/
async function userReady(user: User, message: WebsocketMessage) {
	if ("game" != currentPage())
		return;

	console.log(message);

	//if (user.gameId == message.gameId) {
	const gamersBox = await fetch("/api/gamers");
	const gamers: StringBox = await gamersBox.json();
	console.log(gamers);
	if (Result.SUCCESS == gamers.result)
		document.querySelector("#gamerMatchReadyForm").innerHTML = gamers.value;
	//}
}

async function userInvite(user: User, message: WebsocketMessage) {
	if (user.userId == message.toId) {
		sendMessageToServer(message);
		navigate(`/game`);
	}
}

async function userChangeStatus(user: User, message: WebsocketMessage) {
	if ("friends" == currentPage()) {
		navigate("/friends");
	}
}
