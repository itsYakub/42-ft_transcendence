import { addChatPartnerView, chatPartner, notificationsHtml } from "../../../common/dynamicElements.js";
import { MessageType, Result } from "../../../common/interfaces.js";
import { sendMessageToServer } from "../sockets/clientSocket.js";
import { profileFunctions } from "../users/profile.js";

export function userChatsFunctions() {
	const chatPartnerButtons = document.getElementsByClassName("chatPartnerButton");
	for (var i = 0; i < chatPartnerButtons.length; i++) {
		chatPartnerButtons[i].addEventListener("click", async function () {
			const chatsBox = await fetch("/api/chats", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					partnerId: parseInt(this.dataset.id)
				})
			});

			const json = await chatsBox.json();
			if (Result.SUCCESS == json.result) {
				resetChatPartnerButtons();
				(this as HTMLElement).classList.replace("hover:bg-gray-700", "bg-fuchsia-800");
				const userChatsContainer = document.querySelector("#userChatsContainer");
				if (userChatsContainer) {
					const messages = json.contents.messages;
					const partner = json.contents.partner;
					const chatPartnerContainer = <HTMLElement>document.querySelector("#chatPartnerContainer");
					chatPartnerContainer.innerHTML = chatPartner(partner);
					chatPartnerContainer.dataset.id = partner.userId;
					userChatsContainer.innerHTML = messages;
					document.querySelector("#sendUserChatForm").innerHTML =
						`<div class="flex flex-row gap-1 mt-2">
						<input type="text" name="message" class="text-gray-300 grow border border-gray-700 rounded-lg px-2">
						<input type="submit" hidden>
						<button type="submit" class="border border-gray-700 py-1 px-2 cursor-[url(/images/pointer.png),pointer] hover:bg-gray-700 rounded-lg bg-gray-800"><i class="text-fuchsia-800 fa-solid fa-play"></i></button>
					</div>`
				}
			}
		});
	}

	const chatPartnerContainer = document.querySelector("#chatPartnerContainer");
	if (chatPartnerContainer) {
		chatPartnerContainer.addEventListener("click", async function () {
			const profileBox = await fetch("/api/profile", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					userId: this.dataset.id
				})
			});

			const json = await profileBox.json();
			if (Result.SUCCESS != json.result)
				return;

			const dialog = <HTMLDialogElement>document.querySelector("#profileDialog");
			dialog.innerHTML = json.value;
			profileFunctions();
			if (document.activeElement instanceof HTMLElement)
				document.activeElement.blur();
			dialog.showModal();
		});
	}

	const addUserChatButton = document.querySelector("#addUserChatButton");
	if (addUserChatButton) {
		addUserChatButton.addEventListener("click", async () => {
			const response = await (fetch("/api/chats/users"));
			const json = await response.json();
			const chatUsersDialog = <HTMLDialogElement>document.querySelector("#chatUsersDialog");
			if (chatUsersDialog) {
				chatUsersDialog.innerHTML = addChatPartnerView(json.contents);
				const closeAddChatPartnerButton = document.querySelector("#closeAddChatPartnerButton");
				if (closeAddChatPartnerButton)
					closeAddChatPartnerButton.addEventListener("click", () => chatUsersDialog.close());
				const addChatPartnerButtons = document.getElementsByClassName("addChatPartnerButton");
				for (var i = 0; i < addChatPartnerButtons.length; i++) {
					addChatPartnerButtons[i].addEventListener("click", function () {
						const chatPartnerContainer = <HTMLElement>document.querySelector("#chatPartnerContainer");
						chatPartnerContainer.innerHTML = this.dataset.nick;
						chatPartnerContainer.dataset.id = this.dataset.id;
						resetChatPartnerButtons();
						document.querySelector("#userChatsContainer").innerHTML = "";
						chatUsersDialog.close();
					});
				}
				chatUsersDialog.showModal();
			}
		});
	}

	const notificationsButton = document.querySelector("#notificationsButton");
	if (notificationsButton) {
		notificationsButton.addEventListener("click", async () => {
			const chatsBox = await fetch("/api/chats/notifications");
			const notifications = await chatsBox.json();
			if (Result.SUCCESS == notifications.result) {
				const userChatsContainer = document.querySelector("#userChatsContainer");
				if (userChatsContainer) {
					resetChatPartnerButtons();
					const messages = notifications.contents;
					userChatsContainer.innerHTML = notificationsHtml(messages);
					console.log(messages);
				}
			}
		});
	}


	const sendUserChatForm = <HTMLFormElement>document.querySelector("#sendUserChatForm");
	if (sendUserChatForm) {
		sendUserChatForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const chatPartnerContainer = <HTMLElement>document.querySelector("#chatPartnerContainer");
			const messageText: string = sendUserChatForm.message.value;
			if (messageText.length > 0) {
				sendMessageToServer({
					type: MessageType.USER_SEND_USER_CHAT,
					chat: messageText,
					toId: parseInt(chatPartnerContainer.dataset.id)
				});
			}
			sendUserChatForm.message.value = "";
		});
	}
}

function resetChatPartnerButtons() {
	const chatPartnerButtons = document.getElementsByClassName("chatPartnerButton");
	for (var j = 0; j < chatPartnerButtons.length; j++)
		chatPartnerButtons[j].classList.replace("bg-fuchsia-800", "hover:bg-gray-700");
}
