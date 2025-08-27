import { Message, MessageType, User } from "../../../common/interfaces.js";
import { translate } from "../../../common/translations.js";
import { getLanguage } from "../index.js";
import { currentPage, sendMessageToServer } from "../sockets/clientSocket.js";

export function tournamentFunctions() {
	const gamerMatchReadyForm = <HTMLFormElement>document.querySelector("#tournamentMatchReadyForm");
	if (gamerMatchReadyForm) {
		gamerMatchReadyForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			if ("leaveTournamentButton" == e.submitter.id) {
				sendMessageToServer({
					type: MessageType.USER_LEAVE_TOURNAMENT,
				});
				return;
			}

			sendMessageToServer({
				type: MessageType.TOURNAMENT_UPDATE
			});
		});
	}
}

export function updateTournamentDetails(user: User, message: Message) {
	if ("game" == currentPage() && user.userId == message.toId && message.content) {
		console.log("for me");
		const lobbyDetailsContainer = document.querySelector("#lobbyDetailsContainer");
		if (lobbyDetailsContainer) {
			lobbyDetailsContainer.innerHTML = translate(getLanguage(), message.content);
			tournamentFunctions();
		}
	}
	else
		console.log("not for me");
}
