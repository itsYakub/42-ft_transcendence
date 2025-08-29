import { matchGamerIsReady, matchGamerLeaving, sendMatchMessage } from "../sockets/remoteMatchesMessages.js";

export function matchLobbyFunctions() {
	const matchGamerReadyButton = document.querySelector("#matchGamerReadyButton");
	if (matchGamerReadyButton)
		matchGamerReadyButton.addEventListener("click", () => matchGamerIsReady());

	const leaveMatchButton = document.querySelector("#leaveMatchButton");
	if (leaveMatchButton)
		leaveMatchButton.addEventListener("click", () => matchGamerLeaving());

	const sendMatchMessageForm = <HTMLFormElement>document.querySelector("#sendMatchMessageForm");
	if (sendMatchMessageForm) {
		sendMatchMessageForm.addEventListener("submit", async function (e) {
			e.preventDefault();
			if (sendMatchMessageForm.message.value.length > 0)
				sendMatchMessage(sendMatchMessageForm.message.value);
		});
	}
}
