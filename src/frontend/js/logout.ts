import { addFunctions } from "./index.js";

export function logoutFunctions() {
	const logoutButton = document.getElementById("logoutButton");
	if (logoutButton) {
		logoutButton.addEventListener("click", async () => {
			const response = await fetch("/user/logout", {
				method: "GET"
			});

			// Sets the frame's navbar and content
			if (response.ok) {
				const text = await response.json();
				document.querySelector("#navbar").innerHTML = text.navbar;
				document.querySelector("#content").innerHTML = text.content;
				addFunctions();
			}
		}, { once: true });
	}

	window.addEventListener("beforeunload", (event) => {
		fetch("/user/leave", { method: "POST" });
	}, { once: true });
}
