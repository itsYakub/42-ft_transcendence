import { profileActionbuttons } from "../../../common/dynamicElements.js";
import { Result } from "../../../common/interfaces.js";
import { translate } from "../../../common/translations.js";
import { getLanguage } from "../index.js";

export function profileFunctions() {
	const closeProfileButton = document.querySelector("#closeProfileButton");
	if (closeProfileButton) {
		closeProfileButton.addEventListener("click", () => {
			const profileDialog = <HTMLDialogElement>document.querySelector("#profileDialog");
			if (profileDialog)
				profileDialog.close();
		});
	}

	const addFriendButton = document.querySelector("#addFriendButton");
	if (addFriendButton) {
		addFriendButton.addEventListener("click", async function () {
			const response = await fetch("/api/friends/add", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					friendId: parseInt(this.dataset.id)
				})
			});

			if (Result.SUCCESS == await response.text()) {
				const actionButtons = profileActionbuttons(true, false, parseInt(this.dataset.id));
				const language = getLanguage();
				document.querySelector("#actionButtonsContainer").innerHTML = translate(language, actionButtons);
				profileFunctions();
			}
		});
	}

	const removeFriendButton = document.querySelector("#removeFriendButton");
	if (removeFriendButton) {
		removeFriendButton.addEventListener("click", async function () {
			const response = await fetch("/api/friends/remove", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					friendId: parseInt(this.dataset.id)
				})
			});

			if (Result.SUCCESS == await response.text()) {
				const actionButtons = profileActionbuttons(false, false, parseInt(this.dataset.id));
				const language = getLanguage();
				document.querySelector("#actionButtonsContainer").innerHTML = translate(language, actionButtons);
				profileFunctions();
			}
		});
	}

	const addFoeButton = document.querySelector("#addFoeButton");
	if (addFoeButton) {
		addFoeButton.addEventListener("click", async function () {
			const response = await fetch("/api/foes/add", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					foeId: parseInt(this.dataset.id)
				})
			});

			if (Result.SUCCESS == await response.text()) {
				const actionButtons = profileActionbuttons(false, true, parseInt(this.dataset.id));
				const language = getLanguage();
				document.querySelector("#actionButtonsContainer").innerHTML = translate(language, actionButtons);
				profileFunctions();
			}
		});
	}

	const removeFoeButton = document.querySelector("#removeFoeButton");
	if (removeFoeButton) {
		removeFoeButton.addEventListener("click", async function () {
			const response = await fetch("/api/foes/remove", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					foeId: parseInt(this.dataset.id),
				})
			});

			if (Result.SUCCESS == await response.text()) {
				const actionButtons = profileActionbuttons(false, false, parseInt(this.dataset.id));
				const language = getLanguage();
				document.querySelector("#actionButtonsContainer").innerHTML = translate(language, actionButtons);
				profileFunctions();
			}
		});
	}
}
