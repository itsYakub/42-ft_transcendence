import { Page, Result } from "../../../common/interfaces.js";
import { isLoggedIn, showPage } from "../index.js";
import { sendTournamentMessage, tournamentGamerIsReady, tournamentGamerLeft } from "../sockets/remoteTournamentsMessages.js";

export async function createRemoteTournament(): Promise<Result> {
	const response = await fetch(`/tournament/remote/add`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({})
	});
	return Result[await response.text()];
}

export function tournamentListeners() {
	const tournamentGamerReadyButton = document.querySelector("#tournamentGamerReadyButton");
	if (tournamentGamerReadyButton)
		tournamentGamerReadyButton.addEventListener("click", () => tournamentGamerIsReady());

	const leaveTournamentButton = document.querySelector("#leaveTournamentButton");
	if (leaveTournamentButton) {
		leaveTournamentButton.addEventListener("click", async () => {console.log("clicked leave");
			if (!await isLoggedIn())
				return showPage(Page.AUTH);

			showPage(Page.GAME);
			tournamentGamerLeft();
		});
	}

	const sendTournamentMessageForm = <HTMLFormElement>document.querySelector("#sendTournamentMessageForm");
	if (sendTournamentMessageForm) {
		sendTournamentMessageForm.addEventListener("submit", async function (e) {
			if (!await isLoggedIn())
				return showPage(Page.AUTH);

			e.preventDefault();
			if (sendTournamentMessageForm.message.value.length > 0) {
				sendTournamentMessage(sendTournamentMessageForm.message.value);
				sendTournamentMessageForm.message.value = "";
			}
		});
	}
}
