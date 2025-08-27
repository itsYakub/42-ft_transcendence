import { Message, MessageType, Result, User } from "../../../common/interfaces.js";
import { translate } from "../../../common/translations.js";
import { getLanguage } from "../index.js";
import { currentPage, sendMessageToServer } from "../sockets/clientSocket.js";
import { startMatch } from "./game.js";

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
				type: MessageType.TOURNAMENT_GAMER_READY
			});
		});
	}
}

export async function updateTournamentDetails(user: User, message: Message) {
	if ("game" == currentPage() && user.gameId == message.gameId) {
		console.log("for me");

		const contentBox = await fetch("/api/tournament");

		const json = await contentBox.json();
		if (Result.SUCCESS == json.result) {
			const lobbyDetailsContainer = document.querySelector("#lobbyDetailsContainer");
			if (lobbyDetailsContainer) {
				lobbyDetailsContainer.innerHTML = translate(getLanguage(), json.contents);
				tournamentFunctions();
			}
		}
	}
	else
		console.log("not for me");
}

export async function startTournamentMatch(user: User, message: Message) {
	if ("game" == currentPage() && user.userId == message.toId) {
		console.log("for me");

		startMatch("abc", "def");
	}
	else
		console.log("not for me");
}
