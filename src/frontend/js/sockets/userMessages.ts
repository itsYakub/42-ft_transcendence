import { currentPage, sendMessageToServer } from "./clientSocket.js";
import { getLanguage, showPage } from "../index.js";
import { Message, Page, Result, ShortUser, User } from "../../../common/interfaces.js";
import { chatString } from "../../../common/dynamicElements.js";
import { translate } from "../../../common/translations.js";
import { getUserId } from "../user.js";

export async function userSendUserChat(message: Message) {
	const chatPartnerContainer = <HTMLElement>document.querySelector("#chatPartnerContainer");
	if (chatPartnerContainer) {
		const partnerId = parseInt(chatPartnerContainer.dataset.id);
		if (partnerId === message.fromId || partnerId === message.toId) {
			// user is chatting with this partner
			const node = document.createElement("span");
			node.innerHTML = chatString(message.chat, getUserId() == message.toId);
			const container = document.querySelector("#userChatsContainer");
			if (node.firstElementChild)
				container.insertBefore(node.firstElementChild, container.firstChild);
			else
				container.appendChild(node);
		}
		else if (Page.CHAT == currentPage()) {
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

export async function userInvite(message: Message) {
	const userBox = await fetch("/profile/user");
	const json = await userBox.json();
	if (Result.SUCCESS != json.result)
		return;

	const user = json.contents;
	if (user.userId == message.toId) {
		sendMessageToServer(message);
		showPage(Page.GAME);
	}
}
