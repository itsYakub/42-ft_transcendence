import { usersFunctions } from "../account/users.js";
import { accountFunctions } from "../account/account.js";
import { currentPage, sendMessageToServer } from "./socket.js";
import { navigate } from "../index.js";

export function handleIncomingUserMessage(user: any, message: any) {
	switch (message.type) {
		case "user-chat":
			userChat(user, message);
			break;
		case "user-invite":
			userInvite(user, message);
			break;
		case "user-change-status":
			userChangeStatus(user, message);
			break;
	}
}

async function userChat(user: any, message: any) {
	if ("users" != currentPage())
		return;

	let otherID: number = 0;
	if (message.toID == user.id)
		otherID = message.fromID;
	else if (message.fromID == user.id)
		otherID = message.toID;

	if (0 != otherID) {
		const messagesResponse = await fetch(`/api/private-messages/${otherID}`);
		const messages = await messagesResponse.json();
		if (200 == messages.code) {
			(document.querySelector("#sendMessageForm") as HTMLFormElement).message.value = "";
			document.querySelector("#usersDiv").innerHTML = messages.usersHtml;
			document.querySelector("#messagesDiv").innerHTML = messages.messagesHtml;
			accountFunctions();
			usersFunctions();
		}
	}
}

async function userInvite(user: any, message: any) {
	if (user.id == message.toID) {
		sendMessageToServer({
			type: "game-join",
			gameID: message.gameID
		});

		navigate(`/game`);
	}
}

async function userChangeStatus(user: any, message: any) {
	if ("friends" == currentPage()) {
		navigate("/friends");
	}
}
