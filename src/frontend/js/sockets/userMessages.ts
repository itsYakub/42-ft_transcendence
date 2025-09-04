import { currentPage, sendMessageToServer } from "./clientSocket.js";
import { getLanguage, navigate } from "../index.js";
import { Message, User } from "../../../common/interfaces.js";
import { chatString } from "../../../common/dynamicElements.js";
import { translate } from "../../../common/translations.js";

export async function userSendUserChat(user: User, message: Message) {
	if (user.userId != message.fromId && user.userId != message.toId)
		return;

	const chatPartnerContainer = <HTMLElement>document.querySelector("#chatPartnerContainer");
	if (chatPartnerContainer) {
		const partnerId = parseInt(chatPartnerContainer.dataset.id);
		if (partnerId == message.fromId || partnerId == message.toId) {
			// user is chatting with this partner
			const node = document.createElement("span");
			node.innerHTML = chatString(message.chat, user.userId == message.toId);
			const container = document.querySelector("#userChatsContainer");
			if (node.firstElementChild)
				container.insertBefore(node.firstElementChild, container.firstChild);
			else
				container.appendChild(node);
		}
		else if ("chat" == currentPage()) {
			// user is chatting with another partner
			console.log("another partner");
		}
	}
	else {
		// user is on another page
		console.log("another page");
		const chatButton = document.querySelector("#chatButton");
		if (chatButton) {
			chatButton.classList.replace("text-gray-300", "text-green-300");
		}
	}
}

/*
	A user has clicked the Ready button or navigated away
*/
export async function userReadyorUnready(user: User, message: Message) {
	if ("game" == currentPage() && message.content) {
		const container = document.querySelector("#gamerMatchReadyForm");
		if (container)
			container.innerHTML = translate(getLanguage(), message.content);
	}
}

export async function userInvite(user: User, message: Message) {
	if (user.userId == message.toId) {
		sendMessageToServer(message);
		navigate(`/game`);
	}
}

export async function userConnectOrDisconnect(user: User, message: Message) {
	if ("friends" == currentPage()) {
		navigate("/friends");
	}
}
