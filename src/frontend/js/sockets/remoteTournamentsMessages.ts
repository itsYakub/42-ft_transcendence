import { Message, MessageType, Result, User } from "../../../common/interfaces.js";
import { translate } from "../../../common/translations.js";
import { tournamentListeners } from "../game/tournament.js";
import { getLanguage, navigate, showAlert } from "../index.js";
import { currentPage, sendMessageToServer } from "./clientSocket.js";

export function createLocalTournament() {
	const gameId = `t${Date.now().toString(36).substring(5)}`;
}

export function createRemoteTournament() {
	const gameId = `t${Date.now().toString(36).substring(5)}`;
	joiningTournament(gameId);
}

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

export function tournamentGamerLeaving() {
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
	A user has entered or left a tournament
*/
export async function joinOrLeaveTournament(user: User, message: Message) {
	if ("game" != currentPage())
		return;

	if (!user.gameId) {
		navigate("/game");
		return;
	}

	if (user.gameId == message.gameId && user.userId != message.fromId) {
		const tournamentDetailsContainer = document.querySelector("#tournamentDetailsContainer");
		if (tournamentDetailsContainer)
			tournamentDetailsContainer.innerHTML = translate(getLanguage(), message.content);
		const gamers = document.getElementsByClassName("tournamentGamer").length;
		const tournamentTitle = document.querySelector("#tournamentTitle");
		tournamentTitle.innerHTML = translate(getLanguage(), `%%TEXT_TOURNAMENT%% - ${gamers} / 4 %%TEXT_PLAYERS%%`);
		tournamentListeners();
	}
}

export async function updateTournamentDetails(user: User, message: Message) {
	if ("game" == currentPage() && user.gameId == message.gameId) {
		console.log("for me");

		const contentBox = await fetch("/api/tournament");

		const json = await contentBox.json();
		if (Result.SUCCESS == json.result) {
			const tournamentTitle = document.querySelector("#tournamentTitle");
			if (tournamentTitle) {
				if (3 == message.match?.matchNumber)
					tournamentTitle.innerHTML = translate(getLanguage(), "%%TEXT_TOURNAMENT%% - %%TEXT_TOURNAMENT_FINAL%%");
				else
					tournamentTitle.innerHTML = translate(getLanguage(), "%%TEXT_TOURNAMENT%% - %%TEXT_TOURNAMENT_SEMI_FINALS%%");
			}

			const tournamentDetailsContainer = document.querySelector("#tournamentDetailsContainer");
			if (tournamentDetailsContainer) {
				tournamentDetailsContainer.innerHTML = translate(getLanguage(), json.contents);
				tournamentListeners();
			}
		}
	}
	else
		console.log("not for me");
}

export async function tournamentMatchStart(user: User, message: Message) {
	if ("game" != currentPage() || null == message.match)
		return;

	const match = message.match;
	if (user.userId == match.g1.userId || user.userId == match.g2.userId) {
		console.log("for me");

		// TODO remove this
		const losingScore = Math.floor(Math.random() * 10);
		if (0 == Math.floor(Math.random() * 2)) {
			match.g1.score = 10;
			match.g2.score = losingScore;
		}
		else {
			match.g1.score = losingScore;
			match.g2.score = 10;
		}
		// END

		sendMessageToServer({
			type: MessageType.TOURNAMENT_MATCH_END,
			match
		});

		// TODO game with small window?
		// startMatch(message.match);
	}
	else
		console.log("not for me");
}

export function tournamentOver(user: User, message: Message) {
	console.log(message);
	if ("game" != currentPage() || user.gameId != message.gameId)
		return;

	const match = message.match;
	const gamer = match.g1.score > match.g2.score ? match.g1 : match.g2;

	sendMessageToServer({
		type: MessageType.TOURNAMENT_OVER,
	});
	showAlert(translate(getLanguage(), `%%TEXT_CONGRATULATIONS%% ${gamer.nick}!`));

}
