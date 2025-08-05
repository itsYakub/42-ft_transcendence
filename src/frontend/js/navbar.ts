import { navigate } from "./index.js";

/*
	The functions that change the page from the navbar
*/
export function navbarFunctions() {
	document.getElementById("homeButton").addEventListener("click", () => {
		navigate("/");
	}, { once: true });

	document.getElementById("playButton").addEventListener("click", async () => {
		navigate("/play");
	}, { once: true });

	const profileAvatar = document.getElementById("profileAvatar");
	if (profileAvatar) {
		profileAvatar.addEventListener("click", async () => {
			await navigate("/profile");
		}, { once: true });
	}
}
