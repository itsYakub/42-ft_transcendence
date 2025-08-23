import { navigate } from "./index.js";

/*
	The functions that change the page from the navbar
*/
export function navbarFunctions() {
	const languageSelect = <HTMLSelectElement>document.getElementById("languageSelect");
	if (languageSelect) {
		languageSelect.addEventListener("change", (event) => {
			const date = new Date();
			date.setFullYear(date.getFullYear() + 1);
			document.cookie = `language=${languageSelect.value}; expires=${date}`;
			navigate(window.location.href);
		})
	}

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

	const usersButton = document.querySelector("#usersButton");
	if (usersButton) {
		usersButton.addEventListener("click", async () => {
			navigate("/users");
		}, { once: true });
	}

	const profileAvatar = document.querySelector("#accountAvatar");
	if (profileAvatar) {
		profileAvatar.addEventListener("click", async () => {
			await navigate("/account");
		}, { once: true });
	}
}
