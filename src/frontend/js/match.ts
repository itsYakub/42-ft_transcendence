import { navigate, showAlert } from "./index.js";
import { getSocket } from "./socket.js";

export function matchFunctions() {
	const playerMatchReadyForm = <HTMLFormElement>document.querySelector("#playerMatchReadyForm");
	if (playerMatchReadyForm) {
		playerMatchReadyForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			const response = await fetch("/play/ready", {
				method: "POST"
			});

			const json = await response.json();
			if (json.code != 200) {
				showAlert(json.error);
				return;
			}

			const socket = getSocket();
			if (socket)
				socket.send(JSON.stringify({
					type: "room-ready"
				}));
			navigate(window.location.href);
		});
	}

	const sendMatchMessageForm = <HTMLFormElement>document.querySelector("#sendMatchMessageForm");
	if (sendMatchMessageForm) {
		sendMatchMessageForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			if (sendMatchMessageForm.message.value.length > 0) {
				const response = await fetch("/messages/add", {
					method: "POST",
					body: JSON.stringify({
						message: sendMatchMessageForm.message.value
					})
				});

				const json = await response.json();
				if (json.code != 200) {
					showAlert(json.error);
					return;
				}

				const socket = getSocket();
				if (socket)
					socket.send(JSON.stringify({
						type: "room-message",
						message: sendMatchMessageForm.message.value
					}));
				navigate(window.location.href);
			}
		});
	}
}
