import { Result, WebsocketMessageGroup, WebsocketMessageType } from "../../../common/interfaces.js";
import { showAlert } from "../index.js";
import { sendMessageToServer } from "../sockets/socket.js";

export function usersFunctions() {
	const friendsButton = document.getElementById("friendsButton");
	if (friendsButton) {
		friendsButton.addEventListener("click", async () => {
			const response = await fetch("/friends", {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({
						friendId: 0,
					})
				});

			const json = await response.json();
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

	const addFriendButton = document.querySelector("#addFriendButton");
	if (addFriendButton) {
		addFriendButton.addEventListener("click", async () => {
			const selectedUserButton = <HTMLButtonElement>document.querySelector("#selectedUserButton");
			if (selectedUserButton) {
				const response = await fetch("/friends/add", {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({
						friendId: parseInt(selectedUserButton.dataset.id),
					})
				});

				if (Result.SUCCESS == await response.text()) {
					console.log("added friend!");
					// addFriendButton.classList += "hidden";
					// addFoeButton.classList += "hidden";
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

	const addFoeButton = document.querySelector("#addFoeButton");
	if (addFoeButton) {
		addFoeButton.addEventListener("click", async () => {
			const selectedUserButton = <HTMLButtonElement>document.querySelector("#selectedUserButton");
			if (selectedUserButton) {
				const response = await fetch("/foes/add", {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({
						foeId: parseInt(selectedUserButton.dataset.id)
					})
				});

				if (Result.SUCCESS == await response.text()) {
					console.log("added foe!");
					// addFoeButton.classList.replace("visible", "collapse");
					// addFriendButton.classList.replace("visible", "collapse");
					// chatButton.classList.replace("collapse", "visible");
					//showUser(selectedUserButton.dataset.id);
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


	const userButtons = document.getElementsByClassName("userButton");
	for (var i = 0; i < userButtons.length; i++) {
		userButtons[i].addEventListener("click", async function () {
			showUser(this.dataset.id);
		});
	}

	async function showUser(userId: string) {
		const response = await fetch("/users", {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify({
				selectedUserId: parseInt(userId)
			})
		});

		const usersBox = await response.json();

		if (Result.SUCCESS == usersBox.result) {
			document.querySelector("#content").innerHTML = usersBox.value;
			usersFunctions();
		}
	}

	const friendButtons = document.getElementsByClassName("friendButton");
	for (var i = 0; i < friendButtons.length; i++) {
		friendButtons[i].addEventListener("click", async function () {
			const response = await fetch("/friends", {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify({
				selectedFriendId: parseInt(this.dataset.id)
			})
		});

		const usersBox = await response.json();

		if (Result.SUCCESS == usersBox.result) {
			document.querySelector("#content").innerHTML = usersBox.value;
			usersFunctions();
		}
		});
	}
}
