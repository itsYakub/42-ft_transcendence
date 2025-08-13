import { startMatch } from "./game.js";
import { navigate, showAlert } from "./index.js";

export function matchFunctions() {
	const playerReadyForm = <HTMLFormElement>document.querySelector("#playerReadyForm");
	if (playerReadyForm) {
		playerReadyForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			const response = await fetch("/play/ready", {
				method: "POST"
			});

			const json = await response.json();
			if (json.code != 200) {
				showAlert(json.error);
				return;
			}
			navigate(window.location.href);
		});
	}

	const sendRoomMessageForm = <HTMLFormElement>document.querySelector("#sendRoomMessageForm");
	if (sendRoomMessageForm) {
		sendRoomMessageForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			const roomID = e.submitter.dataset.id;
			const userID = e.submitter.dataset.user;

			if (sendRoomMessageForm.message.value.length > 0) {
				const response = await fetch("/messages/add", {
					method: "POST",
					body: JSON.stringify({
						toID: roomID,
						fromID: userID,
						message: sendRoomMessageForm.message.value
					})
				});

				const json = await response.json();
				if (json.code != 200) {
					showAlert(json.error);
					return;
				}

				navigate(window.location.href);
			}
		});
	}
}
