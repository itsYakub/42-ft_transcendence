import { sendMessageToServer } from "../sockets/socket.js";

export function messagesFunctions() {
	const messageButtons = document.getElementsByClassName("messageUserButton");
	for (var i = 0; i < messageButtons.length; i++) {
		messageButtons[i].addEventListener("click", async function () {
			const response = await fetch("/messages", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					otherUserID: this.dataset.id
				})
			});

			const text = await response.text();
			document.querySelector("#content").innerHTML = text;
			messagesFunctions();
		});
	}

	const sendMessageForm = <HTMLFormElement>document.querySelector("#sendMessageForm");
	if (sendMessageForm) {
		sendMessageForm.addEventListener("submit", async (e) => {
			e.preventDefault();

			const toButton = <HTMLButtonElement>document.querySelector("#selectedUserButton");
			if (toButton) {
				const message = sendMessageForm.message.value;

				if (message.length > 0) {
					sendMessageToServer({
						type: "user-chat",
						toID: parseInt(toButton.dataset.id),
						chat: message
					});
				}
			}
			else
				(document.querySelector("#sendMessageForm") as HTMLFormElement).message.value = "";
		});
	}
}
