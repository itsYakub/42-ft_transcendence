import { Result } from "../../common/interfaces.js";
import { navigate, showUsersPage } from "./index.js";
import { profileFunctions } from "./users/profile.js";

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
		homeButton.addEventListener("click", async function() {
			const profileBox = await fetch("/api/profile", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					userId: this.dataset.id
				})
			});

			const json = await profileBox.json();
			if (Result.SUCCESS != json.result)
				return;

			const dialog = <HTMLDialogElement>document.querySelector("#profileDialog");
			dialog.innerHTML = json.value;
			profileFunctions();
			if (document.activeElement instanceof HTMLElement)
				document.activeElement.blur();
			dialog.showModal();
		});
	}

	const accountButton = document.querySelector("#accountButton");
	if (accountButton) {
		accountButton.addEventListener("click", async () => {
			await navigate("/account");
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
			//navigate("/users");
			showUsersPage();
		}, { once: true });
	}

	const chatButton = document.querySelector("#chatButton");
	if (chatButton) {
		chatButton.addEventListener("click", async () => {
			navigate("/chat");
		}, { once: true });
	}
}
