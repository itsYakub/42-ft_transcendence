import { navigate } from "../index.js";
import { sendMessageToServer } from "../sockets/socket.js";

export function matchFunctions() {
	const gamerMatchReadyForm = <HTMLFormElement>document.querySelector("#gamerMatchReadyForm");
	if (gamerMatchReadyForm) {
		gamerMatchReadyForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			if ("leaveMatchButton" == e.submitter.id) {
				sendMessageToServer({
					type: "game-leave"
				});
				navigate("/game");
				return;
			}

			sendMessageToServer({
				type: "game-gamer-ready"
			});
		});
	}

	const sendMatchMessageForm = <HTMLFormElement>document.querySelector("#sendMatchMessageForm");
	if (sendMatchMessageForm) {
		sendMatchMessageForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			if (sendMatchMessageForm.message.value.length > 0) {
				sendMessageToServer({
					type: "game-chat",
					chat: sendMatchMessageForm.message.value
				});
			}
		});
	}
}
