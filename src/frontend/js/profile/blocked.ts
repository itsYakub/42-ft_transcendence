import { navigate } from "../index.js";

export function blockedFunctions() {
	const removeBlockedButton = document.getElementsByClassName("removeBlockedButton");
	for (let i = 0; i < removeBlockedButton.length; i++) {
		removeBlockedButton[i].addEventListener("click", async function () {
			const response = await fetch("/blocked/remove", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					blockedID: this.dataset.id
				})
			});

			const json = await response.json();

			if (200 == json.code)
				navigate("/blocked");
		}, { once: true });
	}
}
