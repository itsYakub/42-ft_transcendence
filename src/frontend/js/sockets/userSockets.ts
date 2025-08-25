import { currentPage, sendMessageToServer } from "./socket.js";
import { navigate } from "../index.js";
import { Result, User, WebsocketChatMessage, WebsocketMessage, WebsocketMessageType } from "../../../common/interfaces.js";
import { chatString } from "../../../common/dynamicElements.js";

export function handleIncomingUserMessage(user: User, message: WebsocketMessage) {
	switch (message.type) {
		case WebsocketMessageType.CHAT:
			userChat(user, message as WebsocketChatMessage);
			break;
		case WebsocketMessageType.INVITE:
			userInvite(user, message);
			break;
		case WebsocketMessageType.JOIN:
		case WebsocketMessageType.LEAVE:
			userChangeStatus(user, message);
			break;
		case WebsocketMessageType.READY:
		case WebsocketMessageType.UNREADY:
			userReady(user, message);
			break;
	}
}

async function userChat(user: User, message: WebsocketChatMessage) {
	if (user.userId != message.fromId && user.userId != message.toId)
		return;

	const partnerIdHolder = <HTMLElement>document.querySelector("#chatPartnerIdHolder");
	if (partnerIdHolder) {
		const partnerId = parseInt(partnerIdHolder.dataset.id);
		if (partnerId == message.fromId || partnerId == message.toId) {
			// user is chatting with this partner
			const node = document.createElement("span");
			node.innerHTML = chatString(message.chat, user.userId == message.toId);
			const container = document.querySelector("#userChatsContainer");
			container.insertBefore(node.firstElementChild, container.firstChild);
		}
		else if ("chat" == currentPage()) {
			// user is chatting with another partner
			console.log("another partner");
		}
	}

	else
		// user is on another page
		console.log("another page");
}

/*
	A user has clicked the Ready button or navigated away
*/
async function userReady(user: User, message: WebsocketMessage) {
	if ("game" != currentPage())
		return;

	const gamersBox = await fetch("/api/gamers");
	const gamers = await gamersBox.json();
	if (Result.SUCCESS == gamers.result)
		document.querySelector("#gamerMatchReadyForm").innerHTML = gamers.value;
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
