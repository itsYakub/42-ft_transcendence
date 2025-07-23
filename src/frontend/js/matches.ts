import { navigate } from "./index.js";

export function matchesFunctions() {
	const addToFriendsButtons = document.getElementsByClassName("addToFriendsButton");
	for (let i = 0; i < addToFriendsButtons.length; i++) {
		addToFriendsButtons[i].addEventListener("click", async function () {
			const response = await fetch("/friends/add", {
				method: "POST",
				body: JSON.stringify({
					"friendID": this.dataset.id,
					"friendNick": this.dataset.nick
				})
			});
			if (response.ok) {
				alert(`Added ${this.dataset.nick} as a friend!`);
				navigate("/matches");
			}
		}, { once: true });
	}

	const addMatchButton = document.getElementById("addMatchButton");
	if (addMatchButton) {
		addMatchButton.addEventListener("click", async function () {
			const response = await fetch("/matches/add", {
				method: "POST",
				body: JSON.stringify({
					"p1ID": 1,
					"p2Name": "Ed",
					"p1Score": 4,
					"p2Score": 10
				})
			});
			if (response.ok) {
				navigate("/matches");
			}
		}, { once: true });
	}
}
