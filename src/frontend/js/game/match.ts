import { WebsocketMessageGroup, WebsocketMessageType } from "../../../common/interfaces.js";
import { navigate } from "../index.js";
import { sendMessageToServer } from "../sockets/socket.js";

export function matchFunctions() {
	const gamerMatchReadyForm = <HTMLFormElement>document.querySelector("#gamerMatchReadyForm");
	if (gamerMatchReadyForm) {
		gamerMatchReadyForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			if ("leaveMatchButton" == e.submitter.id) {
				sendMessageToServer({
					group: WebsocketMessageGroup.GAME,
					type: WebsocketMessageType.LEAVE
				});
				navigate("/game");
				return;
			}

			sendMessageToServer({
				group: WebsocketMessageGroup.USER,
				type: WebsocketMessageType.READY
			});
		});
	}

	const sendMatchMessageForm = <HTMLFormElement>document.querySelector("#sendMatchMessageForm");
	if (sendMatchMessageForm) {
		sendMatchMessageForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			if (sendMatchMessageForm.message.value.length > 0) {
				sendMessageToServer({
					group: WebsocketMessageGroup.GAME,
					type: WebsocketMessageType.CHAT,
					chat: sendMatchMessageForm.message.value
				});
			}
		});
	}
}
