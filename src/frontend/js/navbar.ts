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

	const gameButton = document.querySelector("#gameButton");
	if (gameButton) {
		gameButton.addEventListener("click", async () => {
			navigate("/game");
		}, { once: true });
	}

	const profileAvatar = document.querySelector("#accountAvatar");
	if (profileAvatar) {
		profileAvatar.addEventListener("click", async () => {
			await navigate("/account");
		}, { once: true });
	}
}
