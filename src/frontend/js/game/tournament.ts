import { Match, Message, MessageType, Result, User } from "../../../common/interfaces.js";
import { translate } from "../../../common/translations.js";
import { getLanguage, showAlert } from "../index.js";
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
			const gameTitle = document.querySelector("#gameTitle");
			if (gameTitle) {
				if (3 == message.match?.matchNumber)
					gameTitle.innerHTML = translate(getLanguage(), "%%TEXT_TOURNAMENT%% - %%TEXT_TOURNAMENT_FINAL%%");
				else
					gameTitle.innerHTML = translate(getLanguage(), "%%TEXT_TOURNAMENT%% - %%TEXT_TOURNAMENT_SEMI_FINALS%%");
			}

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
	if ("game" != currentPage() || null == message.match)
		return;

	const match = message.match;
	if (user.userId == match.g1.userId || user.userId == match.g2.userId) {
		console.log("for me");
		console.log("starting match...");

		//TODO game with small window

		//startMatch(message.match);

		match.g1.score = 5;
		match.g2.score = 10;
		sendMessageToServer({
			type: MessageType.TOURNAMENT_MATCH_END,
			match
		})
	}
	else
		console.log("not for me");
}

export function tournamentOver(user: User, message: Message) {
	if ("game" != currentPage() || user.gameId != message.gameId)
		return;

	const match = message.match;
	const gamer = match.g1.score > match.g2.score ? match.g1 : match.g2;
	
	sendMessageToServer({
		type: MessageType.TOURNAMENT_OVER,
	});
	showAlert(translate(getLanguage(), `%%TEXT_CONGRATULATIONS%% ${gamer.nick}!`));

}
