import { navigate } from "../index.js";
import { sendMessageToServer } from "../sockets/socket.js";
import { profileFunctions } from "./profile.js";

export function usersFunctions() {
	const addFriendButton = document.querySelector("#addFriendButton");
	if (addFriendButton) {
		addFriendButton.addEventListener("click", async () => {
			const toButton = <HTMLButtonElement>document.querySelector("#selectedUserButton");
			if (toButton) {
				const response = await fetch("/friends/add", {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({
						friendID: toButton.dataset.id
					})
				});

				const json = await response.json();
				if (200 == json.code)
					navigate("/users");
			}
		});
	}

	const addBlockedButton = document.querySelector("#addBlockedButton");
	if (addBlockedButton) {
		addBlockedButton.addEventListener("click", async () => {
			const toButton = <HTMLButtonElement>document.querySelector("#selectedUserButton");
			if (toButton) {
				const response = await fetch("/blocked/add", {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({
						blockedID: toButton.dataset.id
					})
				});

				const json = await response.json();
				if (200 == json.code)
					navigate("/users");
			}
		});
	}

	const messageButtons = document.getElementsByClassName("messageUserButton");
	for (var i = 0; i < messageButtons.length; i++) {
		messageButtons[i].addEventListener("click", async function () {
			const response = await fetch("/users", {
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
			usersFunctions();
			profileFunctions();
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
