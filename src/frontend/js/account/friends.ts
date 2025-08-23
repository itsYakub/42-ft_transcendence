import { Result } from "../../../common/interfaces.js";
import { navigate } from "../index.js";

export function friendsFunctions() {
	const removeFriendButtons = document.getElementsByClassName("removeFriendButton");
	for (let i = 0; i < removeFriendButtons.length; i++) {
		removeFriendButtons[i].addEventListener("click", async function () {
			const response = await fetch("/friends/remove", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					friendId: this.dataset.id
				})
			});

			if (Result.SUCCESS == await response.text())
				navigate("/friends");
		}, { once: true });
	}
}
