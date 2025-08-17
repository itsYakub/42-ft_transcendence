import { navigate } from "../index.js";
import { sendMessageToServer } from "../sockets/socket.js";

export function matchFunctions() {
	const playerMatchReadyForm = <HTMLFormElement>document.querySelector("#playerMatchReadyForm");
	if (playerMatchReadyForm) {
		playerMatchReadyForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			if ("leaveMatchButton" == e.submitter.id) {
				sendMessageToServer({
					type: "room-leave"
				});
				navigate("/play");
				return;
			}

			sendMessageToServer({
				type: "room-player-ready"
			});
		});
	}

	const sendMatchMessageForm = <HTMLFormElement>document.querySelector("#sendMatchMessageForm");
	if (sendMatchMessageForm) {
		sendMatchMessageForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			if (sendMatchMessageForm.message.value.length > 0) {
				sendMessageToServer({
					type: "room-chat",
					chat: sendMatchMessageForm.message.value
				});
			}
		});
	}
}
