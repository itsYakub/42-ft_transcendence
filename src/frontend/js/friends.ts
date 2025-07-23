import { navigate } from "./index.js";

export function friendsFunctions() {
	// get by class not id!
	const removeFriendButtons = document.getElementsByClassName("removeFriendButton");
	for (let i = 0; i < removeFriendButtons.length; i++) {
		removeFriendButtons[i].addEventListener("click", async function () {
			alert("removing friend " + this.dataset.id);
			const response = await fetch("/friends/remove", {
				method: "POST",
				body: JSON.stringify({ "friendID": this.dataset.id })
			});
			if (response.ok)
				navigate("/friends");
		}, { once: true });
	}
}
