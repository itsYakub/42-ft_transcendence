import { Result } from "../../../common/interfaces.js";
import { navigate } from "../index.js";

export function foesFunctions() {
	const removeFoeButtons = document.getElementsByClassName("removeFoeButton");
	for (let i = 0; i < removeFoeButtons.length; i++) {
		removeFoeButtons[i].addEventListener("click", async function () {
			const response = await fetch("/foes/remove", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					blockedID: this.dataset.id
				})
			});

			const json = await response.json();

			if (Result.SUCCESS == json.result)
				navigate("/foes");
		}, { once: true });
	}
}
