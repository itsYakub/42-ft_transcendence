import { Result, WebsocketMessageGroup, WebsocketMessageType } from "../../../common/interfaces.js";
import { navigate, showAlert } from "../index.js";
import { sendMessageToServer } from "../sockets/socket.js";

export function tournamentFunctions() {
	const gamerTournamentReadyForm = <HTMLFormElement>document.querySelector("#gamerTournamentReadyForm");
	if (gamerTournamentReadyForm) {
		gamerTournamentReadyForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			const response = await fetch("/game/ready", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({})
			});

			const json = await response.json();
			if (Result.SUCCESS != json.result) {
				showAlert(json.error);
				return;
			}

			sendMessageToServer({
				group: WebsocketMessageGroup.GAME,
				type: WebsocketMessageType.READY
			});

			// const socket = getSocket();
			// if (socket)
			// 	socket.send(JSON.stringify({
			// 		type: "game-ready"
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
				if (Result.SUCCESS != json.result) {
					showAlert(json.error);
					return;
				}

				sendMessageToServer({
					group: WebsocketMessageGroup.GAME,
					type: WebsocketMessageType.CHAT,
					chat: sendTournamentMessageForm.message.value
				});

				// const socket = getSocket();
				// if (socket)
				// 	socket.send(JSON.stringify({
				// 		type: "game-message",
				// 		message: sendTournamentMessageForm.message.value
				// 	}));
				navigate(window.location.href);
			}
		});
	}
}
