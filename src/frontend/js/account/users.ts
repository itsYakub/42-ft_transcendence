import { navigate, showAlert } from "../index.js";
import { sendMessageToServer } from "../sockets/socket.js";
import { accountFunctions } from "./account.js";

export function usersFunctions() {

	const inviteButton = document.querySelector("#inviteButton");
	if (inviteButton) {
		inviteButton.addEventListener("click", async () => {
			const toButton = <HTMLButtonElement>document.querySelector("#selectedUserButton");
			if (toButton) {
				const response = await fetch(`/api/is-online/${toButton.dataset.id}`);
				const json = await response.json();
				if (200 == json.code && 1 == json.online)
					sendMessageToServer({
						type: "user-invite",
						toID: parseInt(toButton.dataset.id),
					});
				else
					showAlert("ERR_USER_OFFLINE");
			}
		});
	}

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
						friendID: parseInt(toButton.dataset.id),
					})
				});

				const json = await response.json();
				if (200 == json.code) {
					addFriendButton.classList += "hidden";
					document.querySelector("#addBlockedButton").classList += "hidden";
				}
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
						blockedID: parseInt(toButton.dataset.id),
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
					otherUserID: parseInt(this.dataset.id)
				})
			});

			const text = await response.text();

			document.querySelector("#content").innerHTML = text;
			usersFunctions();
			accountFunctions();
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
		}, { once: true });
	}
}
