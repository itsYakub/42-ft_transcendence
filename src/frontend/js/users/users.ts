import { Result } from "../../../common/interfaces.js";
import { navigate, showFoesPage, showFriendsPage, showUsersPage } from "../index.js";
import { profileFunctions } from "./profile.js";

export function usersFunctions() {
	const allButton = document.querySelector("#allButton");
	if (allButton) {
		allButton.addEventListener("click", async () => {
			//navigate("/users", false);
			showUsersPage();
		});
	}

	const friendsButton = document.querySelector("#friendsButton");
	if (friendsButton) {
		friendsButton.addEventListener("click", async () => {
			// const response = await fetch("/api/friends");
			// const text = await response.text();
			// const json = JSON.parse(text);
			// if (Result.SUCCESS == json.result) {
			// 	document.querySelector("#content").innerHTML = json.value;
			// 	usersFunctions();
			// }
			showFriendsPage();
		});
	}

	const foesButton = document.querySelector("#foesButton");
	if (foesButton) {
		foesButton.addEventListener("click", async () => {
			// const response = await fetch("/api/foes");
			// const text = await response.text();
			// const json = JSON.parse(text);
			// if (Result.SUCCESS == json.result) {
			// 	document.querySelector("#content").innerHTML = json.value;
			// 	usersFunctions();
			// }
			showFoesPage();
		});
	}

	const userButtons = document.getElementsByClassName("userButton");
	for (var i = 0; i < userButtons.length; i++) {
		userButtons[i].addEventListener("click", async function () {
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
}
