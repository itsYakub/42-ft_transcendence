import { Gamer, Message, MessageType, Result, User } from "../../../common/interfaces.js";
import { translate } from "../../../common/translations.js";
import { g_game, GameMode } from "../class/game.js";
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

export function matchGamerLeaving() {
	sendMessageToServer({
		type: MessageType.MATCH_LEAVE
	});
}

export async function updateMatchDetails(user: User, message: Message) {
	if ("game" == currentPage() && user.gameId == message.gameId) {
		console.log("for me");
		const matchLobbyDetailsContainer = document.querySelector("#matchLobbyDetailsContainer");
		if (matchLobbyDetailsContainer)
			matchLobbyDetailsContainer.innerHTML = translate(getLanguage(), message.content);
	}
	else
		console.log("not for me");
}

export async function startingMatch(user: User, message: Message) {
	if (message.gameId != user.gameId)
		return;

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
					type: MessageType.MATCH_LEAVE
				});
				const response = await fetch("/api/match-result/add", {
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
				navigate("/");
			});
		}

		g_game.setupElements(GameMode.GAMEMODE_PVP, {
			nick: gamers[0].nick
		}, {
			nick: gamers[1].nick
		});
	}, 2000);
}

export function actuallyStartingMatch(user: User, message: Message) {
	if (message.gameId != user.gameId)
		return;

	g_game.actuallyStart();
}

// export async function gameReady(user: User, message: Message) {
// 	if (user.gameId != message.gameId)
// 		return;

// 	if (message.gameId.startsWith("m")) {
// 		console.log("match");
// 		//TODO change this
// 		//startMatch(null);//"John", "Ed");
// 	}
// 	else {
// 		console.log("tournament");
// 	}
// }
