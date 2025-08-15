import { navigate } from "./index.js";

/*
	The functions that change the page from the navbar
*/
export function navbarFunctions() {
	const homeButton = document.querySelector("#homeButton");
	if (homeButton) {
		homeButton.addEventListener("click", () => {
			navigate("/");
		}, { once: true });
	}

	const playButton = document.querySelector("#playButton");
	if (playButton) {
		playButton.addEventListener("click", async () => {
			navigate("/play");
		}, { once: true });
	}

	const profileAvatar = document.querySelector("#profileAvatar");
	if (profileAvatar) {
		profileAvatar.addEventListener("click", async () => {
			await navigate("/profile");
		}, { once: true });
	}
}
