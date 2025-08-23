import { Result, WebsocketMessageGroup, WebsocketMessageType } from "../../../common/interfaces.js";
import { showAlert } from "../index.js";
import { sendMessageToServer } from "../sockets/socket.js";

export function usersFunctions() {
	const friendsButton = document.getElementById("friendsButton");
	if (friendsButton) {
		friendsButton.addEventListener("click", async () => {
			const response = await fetch("/friends");

			const text = await response.text();
			const json = JSON.parse(text);
			if (Result.SUCCESS == json.result) {
				document.querySelector("#content").innerHTML = json.value;
			}
		}, { once: true });
	}

	const inviteButton = document.querySelector("#inviteButton");
	if (inviteButton) {
		inviteButton.addEventListener("click", async () => {
			const toButton = <HTMLButtonElement>document.querySelector("#selectedUserButton");
			if (toButton) {
				const response = await fetch(`/api/is-online/${toButton.dataset.id}`);
				const json = await response.json();
				if (Result.SUCCESS == json.result && 1 == json.online)
					sendMessageToServer({
						group: WebsocketMessageGroup.USER,
						type: WebsocketMessageType.INVITE,
						toId: parseInt(toButton.dataset.id),
					});
				else
					showAlert("ERR_USER_OFFLINE");
			}
		});
	}

	const chatButton = document.querySelector("#chatButton");
	if (chatButton) {
		chatButton.addEventListener("click", async () => {
			const selectedUserButton = <HTMLButtonElement>document.querySelector("#selectedUserButton");
			if (selectedUserButton) {
				// const response = await fetch("/friends/add", {
				// 	method: "POST",
				// 	headers: {
				// 		"content-type": "application/json"
				// 	},
				// 	body: JSON.stringify({
				// 		friendId: parseInt(selectedUserButton.dataset.id),
				// 	})
				// });

				// if (Result.SUCCESS == await response.text()) {
				// 	console.log("added friend!");
				// 	addFriendButton.classList += "hidden";
				// 	addFoeButton.classList += "hidden";
				// }
			}
		});
	}

	const addFriendButtons = document.getElementsByClassName("addFriendButton");
	for (var i = 0; i < addFriendButtons.length; i++) {
		addFriendButtons[i].addEventListener("click", async function () {
			const response = await fetch("/friends/add", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					friendId: parseInt(this.dataset.id)
				})
			});

			if (Result.SUCCESS == await response.text()) {
				this.classList += " hidden";
				const buttons = document.getElementsByClassName("addFoeButton");
				for (var j = 0; j < buttons.length; j++) {
					if ((buttons[j] as HTMLButtonElement).dataset.id == this.dataset.id)
						buttons[j].classList += " hidden";
				}
			}
		});
	}

	const removeFriendButton = document.querySelector("#removeFriendButton");
	if (removeFriendButton) {
		removeFriendButton.addEventListener("click", async function () {
			const selectedUserButton = <HTMLButtonElement>document.querySelector("#selectedUserButton");
			const response = await fetch("/friends/remove", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					friendId: parseInt(selectedUserButton.dataset.id)
				})
			});

			if (Result.SUCCESS == await response.text())
				console.log("removed friend");
		}, { once: true });
	}

	const addFoeButtons = document.getElementsByClassName("addFoeButton");
	for (var i = 0; i < addFoeButtons.length; i++) {
		addFoeButtons[i].addEventListener("click", async function () {
			const response = await fetch("/foes/add", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					foeId: parseInt(this.dataset.id)
				})
			});

			if (Result.SUCCESS == await response.text()) {
				this.classList += " hidden";
				const buttons = document.getElementsByClassName("addFriendButton");
				for (var j = 0; j < buttons.length; j++) {
					if ((buttons[j] as HTMLButtonElement).dataset.id == this.dataset.id)
						buttons[j].classList += " hidden";
				}
			}
		});
	}

	const removeFoeButton = document.querySelector("#removeFoeButton");
	if (removeFoeButton) {
		removeFoeButton.addEventListener("click", async function () {
			const selectedUserButton = <HTMLButtonElement>document.querySelector("#selectedUserButton");
			const response = await fetch("/foes/remove", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					foeId: parseInt(selectedUserButton.dataset.id),
				})
			});

			if (Result.SUCCESS == await response.text())
				console.log("removed foe");
		}, { once: true });
	}
}
