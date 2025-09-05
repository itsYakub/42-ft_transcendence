import { Gamer, Message, MessageType, Result, User, UserType } from "../../../common/interfaces.js";
import { translate } from "../../../common/translations.js";
import { g_game, GameMode } from "../class/game.js";
import { gameListeners } from "../game/gamePage.js";
import { getLanguage, navigate } from "../index.js";
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

export function matchFinishing(user: User, message: Message) {
	navigate(window.location.href);
}

export function matchGamerLeaving() {
	sendMessageToServer({
		type: MessageType.MATCH_LEAVE
	});
}

export async function updateMatchList(user: User) {
	if ((UserType.GUEST == user.userType && !user.gameId) || "game" == currentPage())
		navigate(window.location.href);
}

export async function updateMatchLobby(user: User, message: Message) {
	const matchLobbyDetailsContainer = document.querySelector("#matchLobbyDetailsContainer");
	if (matchLobbyDetailsContainer)
		matchLobbyDetailsContainer.innerHTML = translate(getLanguage(), message.content);
	gameListeners();
}

// There are 2 players in the lobby
export async function startingMatch(user: User) {
	setTimeout(async () => {
		const gamersBox = await fetch("/api/match/gamers");
		const json = await gamersBox.json();
		if (Result.SUCCESS != json.result || 2 != json.contents.length)
			return;

		const gamers: Gamer[] = json.contents;
		g_game.setupElements(GameMode.GAMEMODE_PVP, {
			nick: gamers[0].nick,
			userId: gamers[0].userId,
		}, {
			nick: gamers[1].nick,
			userId: gamers[1].userId,
		});
	}, 2000);
}
