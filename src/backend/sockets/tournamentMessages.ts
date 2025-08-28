import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { broadcastMessageToClients } from './serverSocket.js';
import { gamePlayers } from '../db/gameDb.js';
import { Gamer, Match, MatchGamer, Message, MessageType, Result, Tournament, TournamentGamer, User } from '../../common/interfaces.js';
import { addTournament, getTournament, markTournamentGamerReady, updateTournamentFinal, updateTournamentMatchResult } from '../db/tournamentDb.js';

export function generateTournament(fastify: FastifyInstance, db: DatabaseSync, user: User) {
	const gamersBox = gamePlayers(db, user.gameId);
	if (Result.SUCCESS == gamersBox.result) {
		const shuffled = shuffleGamers(gamersBox.contents);
		if (Result.SUCCESS == addTournament(db, user.gameId, shuffled)) {
			broadcastMessageToClients(fastify, {
				type: MessageType.TOURNAMENT_UPDATE,
				gameId: user.gameId
			});
		}
	}
}

export function tournamentGamerReadyReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {

	const tournament = getTournament(db, user.gameId);
	if (Result.SUCCESS == tournament.result) {
		const match = userMatch(tournament.contents, user);
		console.debug(`match is between ${match.g1.nick} and ${match.g2.nick}`);
		markTournamentGamerReady(db, tournament.contents, user);
		broadcastMessageToClients(fastify, {
			type: MessageType.TOURNAMENT_UPDATE,
			gameId: user.gameId
		});

		if (userOpponent(match, user).ready) {
			console.log(`starting match between ${match.g1.nick} and ${match.g2.nick}`);
			broadcastMessageToClients(fastify, {
				type: MessageType.TOURNAMENT_MATCH_START,
				match
			});
		}
	}
}

export function tournamentMatchEnd(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	const match = message.match;
	// Only handle the message once per match
	if (match.g1.userId != user.userId)
		return;

	//TODO add to history
	if (Result.SUCCESS == updateTournamentMatchResult(db, user.gameId, match)) {
		const tournament = getTournament(db, user.gameId);
		if (Result.SUCCESS == tournament.result) {
			const matches = tournament.contents.matches;
			if ((matches[0].g1.score + matches[0].g2.score > 0) && (matches[1].g1.score + matches[1].g2.score > 0)) {
				updateTournamentFinal(db, user.gameId, matches);
			}
			broadcastMessageToClients(fastify, {
				type: MessageType.TOURNAMENT_UPDATE,
				gameId: user.gameId
			});
		}
	}
}

function userMatch(tournament: Tournament, user: User): Match {
	return tournament.matches.find(match => match.g1.userId == user.userId || match.g2.userId == user.userId);
}

export function userLeaveTournamentReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	broadcastMessageToClients(fastify, {
		type: MessageType.USER_LEAVE_TOURNAMENT,
		fromId: user.userId
	})
}

function userGamer(match: Match, user: User): MatchGamer {
	return match.g1.userId == user.userId ? match.g1 : match.g2;
}

function userOpponent(match: Match, user: User): MatchGamer {
	return match.g1.userId == user.userId ? match.g2 : match.g1;
}

// function opponentFromUser(tournament: Tournament, user: User): TournamentGamer {
// 	const gamer = gamerFromUser(tournament, user);
// 	switch (gamer.index) {
// 		case 1:
// 			return tournament.primaryMatch.gamer2;
// 		case 2:
// 			return tournament.primaryMatch.gamer1;
// 		case 3:
// 			return tournament.secondaryMatch.gamer2;
// 		default:
// 			return tournament.secondaryMatch.gamer1;
// 	}
// }

function shuffleGamers(gamers: Gamer[]): Gamer[] {
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
