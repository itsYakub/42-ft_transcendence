import { addChatPartnerView, chatMessageForm, chatPartner, partnersHtml, userNotificationsMessages } from "./../../common/dynamicElements.js";
import { MessageType, Page, Result } from "./../../common/interfaces.js";
import { showPage } from "./index.js";
import { sendMessageToServer } from "./sockets/clientSocket.js";
import { isUserLoggedIn } from "./user.js";
import { profileFunctions } from "./users/profile.js";

export function userChatListeners() {
	const chatPartnerButtons = document.getElementsByClassName("chatPartnerButton");
	for (var i = 0; i < chatPartnerButtons.length; i++)
		chatPartnerButtons[i].addEventListener("click", function () {chatPartnerClicked(this)});

	const chatPartnerContainer = document.querySelector("#chatPartnerContainer");
	if (chatPartnerContainer) {
		chatPartnerContainer.addEventListener("click", async function () {
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const profileBox = await fetch(`/profile/${this.dataset.id}`);

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
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const response = await (fetch("/chat/users"));
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
						chatPartnerContainer.innerHTML = `<div class="bg-red-300/50 rounded text-center p-2 text-stone-700">${this.dataset.nick}</div>`;
						chatPartnerContainer.dataset.id = this.dataset.id;
						chatPartnerContainer.dataset.new = "true";
						resetChatPartnerButtons();
						document.querySelector("#userChatsContainer").innerHTML = "";
						document.querySelector("#sendUserChatForm").innerHTML = chatMessageForm();
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
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const chatsBox = await fetch("/chat/notifications");
			const notifications = await chatsBox.json();
			if (Result.SUCCESS == notifications.result) {
				const userChatsContainer = document.querySelector("#userChatsContainer");
				if (userChatsContainer) {
					resetChatPartnerButtons();
					const chatPartnerContainer = <HTMLElement>document.querySelector("#chatPartnerContainer");
					chatPartnerContainer.innerHTML = "";
					notificationsButton.classList.add("bg-red-400");
					notificationsButton.classList.remove("bg-red-300/50");
					notificationsButton.classList.remove("cursor-[url(/images/pointer.png),pointer]");
					notificationsButton.classList.remove("hover:bg-red-300");
					const messages = notifications.contents;
					userChatsContainer.innerHTML = userNotificationsMessages(messages);
					document.querySelector("#sendUserChatForm").innerHTML = "";
				}
			}
		});
	}


	const sendUserChatForm = <HTMLFormElement>document.querySelector("#sendUserChatForm");
	if (sendUserChatForm) {
		sendUserChatForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			if (!isUserLoggedIn())
				return showPage(Page.AUTH);

			const chatPartnerContainer = <HTMLElement>document.querySelector("#chatPartnerContainer");
			const messageText: string = sendUserChatForm.message.value;
			if (messageText.length > 0) {
				sendMessageToServer({
					type: MessageType.USER_SEND_USER_CHAT,
					chat: messageText,
					toId: parseInt(chatPartnerContainer.dataset.id)
				});
				if ("true" === chatPartnerContainer.dataset.new) {
					const response = await (fetch("/chat/partners"));
					const json = await response.json();
					document.querySelector("#usersDiv").innerHTML = partnersHtml(json.contents);
					const partnerButtons = document.getElementsByClassName("chatPartnerButton");
					for (var i = 0; i < partnerButtons.length; i++) {
						if ((partnerButtons[i] as HTMLElement).dataset.id == chatPartnerContainer.dataset.id) {
							partnerButtons[i].classList.replace("bg-red-300/50", "bg-red-400");
							partnerButtons[i].classList.remove("hover:bg-red-300");
							partnerButtons[i].classList.remove("cursor-[url(/images/pointer.png),pointer]");
						}
						partnerButtons[i].addEventListener("click", function () {chatPartnerClicked(this)});
					}
					chatPartnerContainer.dataset.new = "false";
				}
			}
			sendUserChatForm.message.value = "";
		});
	}
}

async function chatPartnerClicked(button: HTMLElement) {
	if (!isUserLoggedIn())
		return showPage(Page.AUTH);

	const chatsBox = await fetch(`/chat/partners/${button.dataset.id}`);

	const json = await chatsBox.json();
	if (Result.SUCCESS == json.result) {
		resetChatPartnerButtons();
		button.classList.add("bg-red-400");
		button.classList.remove("bg-red-300/50");
		button.classList.remove("cursor-[url(/images/pointer.png),pointer]");
		button.classList.remove("hover:bg-red-300");

		const userChatsContainer = document.querySelector("#userChatsContainer");
		if (userChatsContainer) {
			const messages = json.contents.messages;
			const partner = json.contents.partner;
			const chatPartnerContainer = <HTMLElement>document.querySelector("#chatPartnerContainer");
			chatPartnerContainer.innerHTML = chatPartner(partner);
			chatPartnerContainer.dataset.id = partner.userId;
			userChatsContainer.innerHTML = messages;
			document.querySelector("#sendUserChatForm").innerHTML = chatMessageForm();
		}
	}
}

function resetChatPartnerButtons() {
	const chatPartnerButtons = document.getElementsByClassName("chatPartnerButton");
	for (var j = 0; j < chatPartnerButtons.length; j++) {
		chatPartnerButtons[j].classList.remove("bg-red-400");
		chatPartnerButtons[j].classList.add("bg-red-300/50");
		chatPartnerButtons[j].classList.add("cursor-[url(/images/pointer.png),pointer]");
		chatPartnerButtons[j].classList.add("hover:bg-red-300");
	}

	const notificationsButton = document.querySelector("#notificationsButton");
	if (notificationsButton) {
		notificationsButton.classList.remove("bg-red-400");
		notificationsButton.classList.add("bg-red-300/50");
		notificationsButton.classList.add("cursor-[url(/images/pointer.png),pointer]");
		notificationsButton.classList.add("hover:bg-red-300");
	}
}
