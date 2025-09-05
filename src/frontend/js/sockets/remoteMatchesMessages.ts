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
	if (!user.gameId && (UserType.GUEST == user.userType || "game" == currentPage())) {
		navigate(window.location.href);
		return;
	}
	if (user.gameId == message.gameId) {
		console.log("for me");
		const matchLobbyDetailsContainer = document.querySelector("#matchLobbyDetailsContainer");
		if (matchLobbyDetailsContainer)
			matchLobbyDetailsContainer.innerHTML = translate(getLanguage(), message.content);
		gameListeners();
	}
	else
		console.log("not for me");
}

// There are 2 players in the lobby
export async function startingMatch(user: User) {
	setTimeout(async () => {
		const gamersBox = await fetch("/api/match/gamers");
		const json = await gamersBox.json();
		if (Result.SUCCESS != json.result || 2 != json.contents.length)
			return;

		const gamers: Gamer[] = json.contents;
		const dialog = document.querySelector("#gameDialog");
		if (dialog) {
			dialog.addEventListener("matchOver", async (e: CustomEvent) => {
				sendMessageToServer({
					type: MessageType.MATCH_OVER
				});
				
				// if (gamers[0].userId == user.userId && e.detail["g1Score"] > e.detail["g2Score"]) {
				// 	console.log("sending result");
				// 	const response = await fetch("/api/match-result/add", {
				// 		method: "POST",
				// 		headers: {
				// 			"content-type": "application/json"
				// 		},
				// 		body: JSON.stringify({
				// 			g2Nick: gamers[0].nick == user.nick ? gamers[1].nick : gamers[0].nick,
				// 			g1Score: e.detail["g1Score"],
				// 			g2Score: e.detail["g2Score"],
				// 		})
				// 	});
				// }
				navigate(window.location.href, false);
			});
		}

		g_game.setupElements(GameMode.GAMEMODE_PVP, {
			nick: gamers[0].nick
		}, {
			nick: gamers[1].nick
		});
	}, 2000);
}
