import { navigate, showAlert } from "../index.js";
import { sendMessageToServer } from "../sockets/socket.js";

export function tournamentFunctions() {
	const playerTournamentReadyForm = <HTMLFormElement>document.querySelector("#playerTournamentReadyForm");
	if (playerTournamentReadyForm) {
		playerTournamentReadyForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			const response = await fetch("/play/ready", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
			});

			const json = await response.json();
			if (json.code != 200) {
				showAlert(json.error);
				return;
			}

			sendMessageToServer({
				type: "room-ready"
			});

			// const socket = getSocket();
			// if (socket)
			// 	socket.send(JSON.stringify({
			// 		type: "room-ready"
			// 	}));
			navigate(window.location.href);
		});
	}

	const sendTournamentMessageForm = <HTMLFormElement>document.querySelector("#sendTournamentMessageForm");
	if (sendTournamentMessageForm) {
		sendTournamentMessageForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			if (sendTournamentMessageForm.message.value.length > 0) {
				const response = await fetch("/messages/add", {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({
						message: sendTournamentMessageForm.message.value
					})
				});

				const json = await response.json();
				if (json.code != 200) {
					showAlert(json.error);
					return;
				}

				sendMessageToServer({
					type: "room-message",
					message: sendTournamentMessageForm.message.value
				});

				// const socket = getSocket();
				// if (socket)
				// 	socket.send(JSON.stringify({
				// 		type: "room-message",
				// 		message: sendTournamentMessageForm.message.value
				// 	}));
				navigate(window.location.href);
			}
		});
	}
}
