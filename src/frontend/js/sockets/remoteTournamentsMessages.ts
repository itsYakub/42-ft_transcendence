import { Message, MessageType, Page, Result, ShortUser, User, UserType } from "../../../common/interfaces.js";
import { translate } from "../../../common/translations.js";
import { nickToNumbers } from "../../../common/utils.js";
import { g_game, GameMode } from "../class/game.js";
import { tournamentListeners } from "../game/remoteTournament.js";
import { getLanguage, showAlert, showPage } from "../index.js";
import { getUserGameId, getUserId, setUserGameId } from "../user.js";
import { sendMessageToServer } from "./clientSocket.js";

export function joiningTournament(gameId: string) {
	sendMessageToServer({
		type: MessageType.TOURNAMENT_JOIN,
		gameId
	});
}

export function tournamentGamerIsReady() {
	sendMessageToServer({
		type: MessageType.TOURNAMENT_GAMER_READY
	});
}

export function tournamentGamerLeft() {
	sendMessageToServer({
		type: MessageType.TOURNAMENT_LEAVE
	});
}

export function sendTournamentMessage(chat: string) {
	sendMessageToServer({
		type: MessageType.TOURNAMENT_CHAT,
		chat
	});
}

/*
	A chat message has been sent to a tournament
*/
export async function tournamentChat(message: Message) {
	const messagesBox = await fetch("/tournament/remote/chat");
	const messages = await messagesBox.json();
	if (Result.SUCCESS == messages.result) {
		const tournamentMessagesDiv = document.querySelector("#tournamentMessagesDiv");
		if (tournamentMessagesDiv)
			tournamentMessagesDiv.innerHTML = messages.content;
	}
}

export async function updateTournamentDetails(message: Message) {
	console.log("update:", message);
	setUserGameId(message.gameId);
	const contentBox = await fetch("/tournament");
	const json = await contentBox.json();
	if (Result.SUCCESS == json.result) {
		const tournamentTitle = document.querySelector("#tournamentTitle");
		if (tournamentTitle) {
			if (3 == message.match?.matchNumber)
				tournamentTitle.innerHTML = translate(getLanguage(), "%%TEXT_REMOTE_TOURNAMENT%% - %%TEXT_TOURNAMENT_FINAL%%");
			else
				tournamentTitle.innerHTML = translate(getLanguage(), "%%TEXT_REMOTE_TOURNAMENT%% - %%TEXT_TOURNAMENT_SEMI_FINALS%%");
		}

		const tournamentDetailsContainer = document.querySelector("#tournamentLobbyDetailsContainer");
		if (tournamentDetailsContainer) {

			console.log("new page:", json.contents);

			tournamentDetailsContainer.innerHTML = translate(getLanguage(), json.contents);
			tournamentListeners();
		}
	}
}

export async function updateTournamentLobby(message: Message) {
	const tournamentLobbyDetailsContainer = document.querySelector("#tournamentLobbyDetailsContainer");
	if (tournamentLobbyDetailsContainer)
		tournamentLobbyDetailsContainer.innerHTML = translate(getLanguage(), message.content);
	(document.querySelector("#navBar") as HTMLElement).dataset.page = Page.TOURNAMENT;

	tournamentListeners();
}

export async function tournamentMatchStart(message: Message) {
	const match = message.match;
	setTimeout(async () => {
		const dialog = document.querySelector("#gameDialog");
		if (dialog) {
			dialog.addEventListener("keydown", (e: KeyboardEvent) => {
				if ("Escape" == e.key)
					e.preventDefault();
			});
			dialog.addEventListener("close", () => {
				showPage(Page.GAME);
			});

			const localIndex = match.g1.userId === getUserId() ? 0 : 1;

			dialog.addEventListener("matchOver", async (e: CustomEvent) => {
				if (0 == localIndex) {
					match.g1.score = e.detail["g1Score"];
					match.g2.score = e.detail["g2Score"];
					sendMessageToServer({
						type: MessageType.TOURNAMENT_MATCH_END,
						match
					});
				}				
			});

			g_game.setupElements(GameMode.GAMEMODE_PVP, match.g1, match.g2, {
				networked: true,
				gameId: getUserGameId(),
				localIndex: localIndex as 0 | 1,
				receiverId: match.g1.userId === getUserId() ? match.g2.userId : match.g1.userId
			});
			g_game.actuallyStart();
		}
	}, 1000);
}

export function tournamentOver(message: Message) {

	const match = message.match;
	const gamer = match.g1.score > match.g2.score ? match.g1 : match.g2;

	sendMessageToServer({
		type: MessageType.TOURNAMENT_OVER,
	});
	const alertDialog = document.querySelector("#alertDialog");
	alertDialog.addEventListener("close", async () => {
		//navigate("/");
	});
	showAlert(`${translate(getLanguage(), "%%TEXT_CONGRATULATIONS%%")} ${gamer.nick}!`, false);
}

// function isMessageForMe(user: ShortUser, message: Message) {
// 	if (message.gameId != user.gameId)
// 		return false;

// 	if (Page.GAME != currentPage())
// 		return false;

// 	return true;
// }
