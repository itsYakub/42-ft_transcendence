import { DatabaseSync } from "node:sqlite";
import { gamePlayers } from '../../db/gameDb.js';
import { Match, MatchGamer, Message, MessageType, Result, Tournament, TournamentGamer, User, ShortUser, Gamer } from '../../common/interfaces.js';
import { readRemoteTournament, joinTournament, markTournamentGamerReady, updateTournamentFinal, updateTournamentMatchResult, createRemoteTournament } from '../../db/remoteTournamentsDb.js';
import { remoteTournamentLobbyPlayersView } from '../views/remoteTournamentLobbyView.js';
import { removeUserFromMatch, usersInTournament } from '../../db/userDB.js';
import { createMatchResult } from '../../db/matchResultsDb.js';
import { sendMessageToGameIdUsers, sendMessageToOtherUsers, sendMessageToUser, sendMessageToUsers } from "./serverSocket.js";
import { remoteTournamentDetails } from "../views/remoteTournamentView.js";

export function generateTournament(db: DatabaseSync, gamers: Gamer[]) {
	const shuffled = shuffleGamers(gamers);
	const gameId = `r${Date.now().toString(36).substring(5)}`;
	if (Result.SUCCESS == createRemoteTournament(db, gameId, shuffled)) {
		const userIds = gamers.map((gamer) => gamer.userId);
		sendMessageToGameIdUsers({
			type: MessageType.TOURNAMENT_UPDATE,
			gameId
		}, userIds);
	}
}

export function tournamentJoinReceived(db: DatabaseSync, message: Message) {
	const { gameId, fromId } = message;
	if (Result.SUCCESS == joinTournament(db, gameId, fromId)) {
		const gamers = usersInTournament(db, gameId);
		if (Result.SUCCESS == gamers.result) {
			if (4 == gamers.contents.length) {
				console.log("generating");
				generateTournament(db, gamers.contents);
			}
			else {
				console.log("added to lobby");
				const content = remoteTournamentLobbyPlayersView(gamers.contents);
				const userIds = gamers.contents.map((gamer) => gamer.userId).filter((userId) => userId != fromId);
				sendMessageToGameIdUsers({
					type: MessageType.TOURNAMENT_LOBBY_CHANGED,
					gameId,
					content
				}, userIds);
			}

			sendMessageToOtherUsers({
				type: MessageType.GAME_LIST_CHANGED
			}, fromId);
		}
	}
}

export function tournamentGamerReadyReceived(db: DatabaseSync, message: Message) {
	const { gameId, fromId } = message;
	const tournament = readRemoteTournament(db, gameId);
	if (Result.SUCCESS == tournament.result) {
		const match = userMatch(tournament.contents, fromId);
		markTournamentGamerReady(db, tournament.contents, gameId, fromId);
		sendMessageToGameIdUsers({
			type: MessageType.TOURNAMENT_UPDATE,
			gameId
		}, [match.g1.userId, match.g2.userId]);

		const opponent = userOpponent(match, fromId);
		if (opponent.ready) {
			console.log(`starting match between ${match.g1.nick} and ${match.g2.nick}`);
			sendMessageToGameIdUsers({
				type: MessageType.TOURNAMENT_MATCH_START,
				gameId,
				match
			}, [match.g1.userId, match.g2.userId]);
		}
	}
}

export function tournamentMatchEndReceived(db: DatabaseSync, message: Message) {
	const { gameId, fromId, match } = message;
	// Only handle the message once per match
	if (match.g1.userId != fromId)
		return;

	if (match.g1.userId == fromId) {
		const tournamentWin = 3 == match.matchNumber && match.g1.score > match.g2.score;
		const result = createMatchResult(db, fromId, match.g2.nick, match.g1.score, match.g2.score, tournamentWin);
		if (Result.SUCCESS != result)
			return;
	}
	else if (match.g2.userId == fromId) {
		const tournamentWin = 3 == match.matchNumber && match.g2.score > match.g1.score;
		const result = createMatchResult(db, fromId, match.g1.nick, match.g2.score, match.g1.score, tournamentWin);
		if (Result.SUCCESS != result)
			return;
	}

	if (Result.SUCCESS == updateTournamentMatchResult(db, gameId, match)) {
		const tournament = readRemoteTournament(db, gameId);
		if (Result.SUCCESS == tournament.result) {
			const matches = tournament.contents.matches;

			if (4 == match.matchNumber) {
				if (match.g1.score > 0 && match.g2.score > 0) {
					// broadcastMessageToClients(fastify, {
					// 	type: MessageType.TOURNAMENT_OVER,
					// 	gameId: user.gameId,
					// 	match
					// });
					return;
				}
			}

			if ((matches[0].g1.score + matches[0].g2.score > 0) && (matches[1].g1.score + matches[1].g2.score > 0)) {
				if (null == matches[2].g1.userId && null == matches[2].g2.userId)
					updateTournamentFinal(db, gameId, matches);
				match.matchNumber = 3;
			}
			// broadcastMessageToClients(fastify, {
			// 	type: MessageType.TOURNAMENT_UPDATE,
			// 	gameId: user.gameId,
			// 	match
			// });
		}
	}
}

export function tournamentOverReceived(db: DatabaseSync, message: Message) {
	removeUserFromMatch(db, message.fromId);
}

function userMatch(tournament: Tournament, userId: number): Match {
	return tournament.matches.find(match => match.g1.userId == userId || match.g2.userId == userId);
}

export function tournamentLeaveReceived(db: DatabaseSync, message: Message) {
	const { gameId, fromId } = message;
	const gamers = usersInTournament(db, gameId);
	if (Result.SUCCESS == gamers.result) {
		const content = remoteTournamentLobbyPlayersView(gamers.contents);
		const userIds = gamers.contents.map((gamer) => gamer.userId).filter((userId) => userId != fromId);
		sendMessageToGameIdUsers({
			type: MessageType.TOURNAMENT_LOBBY_CHANGED,
			gameId,
			content
		}, userIds);
		sendMessageToOtherUsers({
			type: MessageType.GAME_LIST_CHANGED
		}, fromId);
	}
}

function userGamer(match: Match, user: ShortUser): MatchGamer {
	return match.g1.userId == user.userId ? match.g1 : match.g2;
}

function userOpponent(match: Match, userId: number): MatchGamer {
	return match.g1.userId == userId ? match.g2 : match.g1;
}

function shuffleGamers(gamers: MatchGamer[]): MatchGamer[] {
	let players = [
		0, 1, 2, 3
	];

	players = players.sort(() => Math.random() - 0.5);
	return [
		gamers[players[0]],
		gamers[players[1]],
		gamers[players[2]],
		gamers[players[3]]
	];
}
