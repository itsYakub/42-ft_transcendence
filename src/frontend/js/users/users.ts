import { Result } from "../../../common/interfaces.js";
import { navigate } from "../index.js";
import { profileFunctions } from "./profile.js";

export function usersFunctions() {
	const allButton = document.querySelector("#allButton");
	if (allButton) {
		allButton.addEventListener("click", async () => {
			navigate("/users", false);
		});
	}

	const friendsButton = document.querySelector("#friendsButton");
	if (friendsButton) {
		friendsButton.addEventListener("click", async () => {
			const response = await fetch("/api/friends");
			const text = await response.text();
			const json = JSON.parse(text);
			if (Result.SUCCESS == json.result) {
				document.querySelector("#content").innerHTML = json.value;
				usersFunctions();
			}
		});
	}

	const foesButton = document.querySelector("#foesButton");
	if (foesButton) {
		foesButton.addEventListener("click", async () => {
			const response = await fetch("/api/foes");
			const text = await response.text();
			const json = JSON.parse(text);
			if (Result.SUCCESS == json.result) {
				document.querySelector("#content").innerHTML = json.value;
				usersFunctions();
			}
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
	
	const removeFriendButtons = document.getElementsByClassName("removeFriendButton");
	for (var i = 0; i < removeFriendButtons.length; i++) {
		removeFriendButtons[i].addEventListener("click", async function () {
			const response = await fetch("/api/friends/remove", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					friendId: parseInt(this.dataset.id),
				})
			});

			const text = await response.text();
			if (Result.SUCCESS != text)
				return;

			((this as HTMLElement).closest(".friendButton") as HTMLElement).style = "display: none;";
		});
	}

	const removeFoeButtons = document.getElementsByClassName("removeFoeButton");
	for (var i = 0; i < removeFoeButtons.length; i++) {
		removeFoeButtons[i].addEventListener("click", async function () {
			const response = await fetch("/api/foes/remove", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					foeId: parseInt(this.dataset.id),
				})
			});

			const text = await response.text();
			if (Result.SUCCESS != text)
				return;

			((this as HTMLElement).closest(".foeButton") as HTMLElement).style = "display: none;";
		});
	}
}
