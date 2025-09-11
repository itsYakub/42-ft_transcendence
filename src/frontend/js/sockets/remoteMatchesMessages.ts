import { Gamer, Message, MessageType, Page, Result, ShortUser, User, UserType } from "../../../common/interfaces.js";
import { translate } from "../../../common/translations.js";
import { g_game, GameMode } from "../class/game.js";
import { gameListeners } from "../game/gamePage.js";
import { getLanguage, showPage } from "../index.js";
import { currentPage, sendMessageToServer } from "./clientSocket.js";

export function createRemoteMatch() {
	const gameId = `m${Date.now().toString(36).substring(5)}`;
	joiningMatch(gameId);
}

export function joiningMatch(gameId: string) {
	sendMessageToServer({
		type: MessageType.MATCH_JOIN,
		gameId
	});
}

export function matchFinishing() {
	showPage(Page.GAME);
}

export function matchGamerLeaving() {
	sendMessageToServer({
		type: MessageType.MATCH_LEAVE
	});
}

export async function updateMatchList() {
	if (Page.GAME == currentPage()) {
		console.log("game list updating");
		showPage(Page.GAME);
	}
}

export async function updateMatchDetails(message: Message) {
	// Handle game events (keys, goals, resets, etc.)
	if (message.content && message.content.includes('"kind"')) {
		g_game.netOnMessage(message);
	}
}

export async function updateMatchLobby(message: Message) {
	console.log("lobby changing");
	const matchLobbyDetailsContainer = document.querySelector("#matchLobbyDetailsContainer");
	if (matchLobbyDetailsContainer)
		matchLobbyDetailsContainer.innerHTML = translate(getLanguage(), message.content);
	gameListeners();
}

// There are 2 players in the lobby
export async function startingMatch() {
	const userBox = await fetch("/profile/user");
	const json = await userBox.json();
	if (Result.SUCCESS != json.result)
		return;

	const user = json.contents;

	setTimeout(async () => {
		const gamersBox = await fetch("/match/gamers");
		const json = await gamersBox.json();
		if (Result.SUCCESS != json.result || 2 != json.contents.length)
			return;

		const gamers: Gamer[] = json.contents;
		const localIndex = gamers[0].userId === user.userId ? 0 : 1;

		const dialog = document.querySelector("#gameDialog");
		if (dialog) {
			dialog.addEventListener("matchOver", async (e: CustomEvent) => {
				sendMessageToServer({
					type: MessageType.MATCH_LEAVE
				});
				const response = await fetch("/match-result/add", {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({
						g2Nick: gamers[0].nick == user.nick ? gamers[1].nick : gamers[0].nick,
						g1Score: e.detail["g1Score"],
						g2Score: e.detail["g2Score"],
					})
				});
				showPage(Page.GAME);
			});
		}

		g_game.setupElements(GameMode.GAMEMODE_PVP, {
			nick: gamers[0].nick,
			userId: gamers[0].userId,
		}, {
			nick: gamers[1].nick,
			userId: gamers[1].userId,
		}, {
			networked: true,
			gameId: user.gameId,
			localIndex: localIndex as 0 | 1
		});
	}, 2000);
}

export function actuallyStartingMatch() {
	g_game.actuallyStart();
}
