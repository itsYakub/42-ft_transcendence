import { Result, WebsocketMessageGroup, WebsocketMessageType } from "../../../common/interfaces.js";
import { sendMessageToServer } from "../sockets/socket.js";

export function userChatsFunctions() {
	const chatPartnerButtons = document.getElementsByClassName("chatPartnerButton");
	for (var i = 0; i < chatPartnerButtons.length; i++) {
		chatPartnerButtons[i].addEventListener("click", async function () {
			const partnerIdHolder = <HTMLElement>document.querySelector("#chatPartnerIdHolder");
			partnerIdHolder.dataset.id = this.dataset.id;
			const stringBox = await fetch("/api/chats", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					partnerId: parseInt(this.dataset.id)
				})
			});

			const json = await stringBox.json();
			if (Result.SUCCESS == json.result) {
				for (var j = 0; j < chatPartnerButtons.length; j++)
					chatPartnerButtons[j].classList.replace("bg-gray-800", "hover:bg-gray-800");
				(this as HTMLElement).classList.replace("hover:bg-gray-800", "bg-gray-800");
				const userChatsContainer = document.querySelector("#userChatsContainer");
				if (userChatsContainer)
					userChatsContainer.innerHTML = json.value;
			}
		});
	}


	const sendUserChatForm = <HTMLFormElement>document.querySelector("#sendUserChatForm");
	if (sendUserChatForm) {
		sendUserChatForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const partnerIdHolder = <HTMLElement>document.querySelector("#chatPartnerIdHolder");
			const messageText: string = sendUserChatForm.message.value;
			if (messageText.length > 0) {
				sendMessageToServer({
					group: WebsocketMessageGroup.USER,
					type: WebsocketMessageType.CHAT,
					chat: messageText,
					toId: parseInt(partnerIdHolder.dataset.id)
				});
			}
			sendUserChatForm.message.value = "";
		});
	}
}
