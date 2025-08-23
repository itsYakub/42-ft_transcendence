import { Result } from "../../../common/interfaces.js";
import { navigate } from "../index.js";

export function foesFunctions() {
	const removeFoeButtons = document.getElementsByClassName("removeFoeButton");
	for (let i = 0; i < removeFoeButtons.length; i++) {
		removeFoeButtons[i].addEventListener("click", async function () {
			console.log("clicked");
			const response = await fetch("/foes/remove", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					foeId: this.dataset.id
				})
			});

			if (Result.SUCCESS == await response.text())
				navigate("/foes");
		}, { once: true });
	}
}
