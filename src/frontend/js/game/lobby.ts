import { MessageType } from "../../../common/interfaces.js";
import { sendMessageToServer } from "../sockets/clientSocket.js";

export function lobbyFunctions() {
	const gamerMatchReadyForm = <HTMLFormElement>document.querySelector("#gamerMatchReadyForm");
	if (gamerMatchReadyForm) {
		gamerMatchReadyForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			if ("leaveMatchButton" == e.submitter.id) {
				sendMessageToServer({
					type: MessageType.USER_LEAVE_GAME,
				});
				return;
			}

			sendMessageToServer({
				type: MessageType.USER_READY
			});
		});
	}

	const sendMatchMessageForm = <HTMLFormElement>document.querySelector("#sendMatchMessageForm");
	if (sendMatchMessageForm) {
		sendMatchMessageForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			if (sendMatchMessageForm.message.value.length > 0) {
				sendMessageToServer({
					type: MessageType.USER_SEND_GAME_CHAT,
					chat: sendMatchMessageForm.message.value
				});
			}
		});
	}
}
