import { navigate, showAlert } from "../index.js";

export function friendsFunctions() {
	const addFriendButton = document.querySelector("#addFriendButton");
	if (addFriendButton) {
		addFriendButton.addEventListener("click", async function () {
			const addFriendDialog = <HTMLDialogElement>document.querySelector("#addFriendDialog");
			if (addFriendDialog) {
				addFriendDialog.showModal();
			}
		});
	}

	const addFriendForm = <HTMLFormElement>document.querySelector("#addFriendForm");
	if (addFriendForm) {
		addFriendForm.addEventListener("submit", async (e) => {
			if ("cancelAddFriendButton" == e.submitter.id)
				return;

			e.preventDefault();

			const friendEmail = addFriendForm.email.value;
			const response = await fetch("/friends/find", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({ email: friendEmail })
			});

			const json = await response.json();

			if (200 != json.code) {
				const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
				alertDialog.addEventListener("close", () => {
					addFriendForm.email.value = "";
					addFriendForm.email.focus();
				});
				showAlert(json.error);
				return;
			}

			navigate("/friends");
		});
	}

	const removeFriendButtons = document.getElementsByClassName("removeFriendButton");
	for (let i = 0; i < removeFriendButtons.length; i++) {
		removeFriendButtons[i].addEventListener("click", async function () {
			const response = await fetch("/friends/remove", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					friendID: this.dataset.id
				})
			});

			const json = await response.json();

			if (!json.error)
				navigate("/friends");
		}, { once: true });
	}
}
