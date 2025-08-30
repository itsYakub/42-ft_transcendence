import { navigate } from "../index.js";
import { sendTournamentMessage, tournamentGamerIsReady, tournamentGamerLeaving } from "../sockets/remoteTournamentsMessages.js";

export function tournamentListeners() {
	const tournamentGamerReadyButton = document.querySelector("#tournamentGamerReadyButton");
	if (tournamentGamerReadyButton)
		tournamentGamerReadyButton.addEventListener("click", () => tournamentGamerIsReady());

	const leaveTournamentButton = document.querySelector("#leaveTournamentButton");
	if (leaveTournamentButton) {
		leaveTournamentButton.addEventListener("click", () => {
			tournamentGamerLeaving();
			navigate("/game");
		});
	}

	const sendTournamentMessageForm = <HTMLFormElement>document.querySelector("#sendTournamentMessageForm");
	if (sendTournamentMessageForm) {
		sendTournamentMessageForm.addEventListener("submit", async function (e) {
			e.preventDefault();
			if (sendTournamentMessageForm.message.value.length > 0) {
				sendTournamentMessage(sendTournamentMessageForm.message.value);
				sendTournamentMessageForm.message.value = "";
			}
		});
	}
}
