import { navigate } from "./index.js";

export function friendsFunctions() {
	const addFriendButton = document.getElementById("addFriendButton");
	if (addFriendButton) {
		addFriendButton.addEventListener("click", async function () {
			let friendEmail = prompt("Friend's email");

			if (!friendEmail)
				return;

			const response = await fetch("/friends/find", {
				method: "POST",
				body: JSON.stringify({ "email": friendEmail })
			});

			if (404 == response.status) {
				alert("User not found!");
				return;
			}

			if (response.ok) {
				alert("Added friend!");
				navigate("/friends");
			}
		});
	}

	const removeFriendButtons = document.getElementsByClassName("removeFriendButton");
	for (let i = 0; i < removeFriendButtons.length; i++) {
		removeFriendButtons[i].addEventListener("click", async function () {
			const response = await fetch("/friends/remove", {
				method: "POST",
				body: JSON.stringify({ "friendID": this.dataset.id })
			});
			if (response.ok)
				navigate("/friends");
		}, { once: true });
	}
}
