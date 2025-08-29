import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { broadcastMessageToClients } from './serverSocket.js';
import { gamePlayers, leaveGame } from '../db/gameDb.js';
import { TournamentMatch, MatchGamer, Message, MessageType, Result, Tournament, TournamentGamer, User } from '../../common/interfaces.js';
import { addTournament, getTournament, joinTournament, markTournamentGamerReady, tournamentGamers, updateTournamentFinal, updateTournamentMatchResult } from '../db/tournamentsDb.js';
import { tournamentGamersHtml } from '../views/tournamentLobbyView.js';

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

export function joinTournamentReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	const gameId = message.gameId;
	if (Result.SUCCESS == joinTournament(db, gameId, user)) {
		const gamers = tournamentGamers(db, gameId);
		if (Result.SUCCESS == gamers.result) {
			if (4 == gamers.contents.length) {
				if (addTournament(db, gameId, gamers.contents))
					broadcastMessageToClients(
						fastify, {
						type: MessageType.TOURNAMENT_UPDATE,
						gameId
					}
					);
				return;
			}
			message.content = tournamentGamersHtml(gamers.contents);
			broadcastMessageToClients(fastify, message);
		}
	}
}

export function tournamentGamerReadyReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	const tournament = getTournament(db, user.gameId);
	if (Result.SUCCESS == tournament.result) {
		const match = userMatch(tournament.contents, user);
		markTournamentGamerReady(db, tournament.contents, user);
		broadcastMessageToClients(fastify, {
			type: MessageType.TOURNAMENT_UPDATE,
			gameId: user.gameId,
			match
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

export function tournamentMatchEndReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	const match = message.match;
	// Only handle the message once per match
	if (match.g1.userId != user.userId)
		return;

	//TODO add to history
	if (Result.SUCCESS == updateTournamentMatchResult(db, user.gameId, match)) {
		const tournament = getTournament(db, user.gameId);
		if (Result.SUCCESS == tournament.result) {
			const matches = tournament.contents.matches;

			if (3 == match.matchNumber) {
				if (match.g1.score > 0 && match.g2.score > 0) {
					broadcastMessageToClients(fastify, {
						type: MessageType.TOURNAMENT_OVER,
						gameId: user.gameId,
						match
					});
					return;
				}
			}

			if ((matches[0].g1.score + matches[0].g2.score > 0) && (matches[1].g1.score + matches[1].g2.score > 0)) {
				if (null == matches[2].g1.userId && null == matches[2].g2.userId)
					updateTournamentFinal(db, user.gameId, matches);
				match.matchNumber = 3;
			}
			broadcastMessageToClients(fastify, {
				type: MessageType.TOURNAMENT_UPDATE,
				gameId: user.gameId,
				match
			});
		}
	}
}

export function tournamentOverReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	leaveGame(db, user.userId);
}

function userMatch(tournament: Tournament, user: User): TournamentMatch {
	return tournament.matches.find(match => match.g1.userId == user.userId || match.g2.userId == user.userId);
}

export function userLeaveTournamentReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	broadcastMessageToClients(fastify, {
		type: MessageType.TOURNAMENT_LEAVE,
		fromId: user.userId
	})
}

function userGamer(match: TournamentMatch, user: User): MatchGamer {
	return match.g1.userId == user.userId ? match.g1 : match.g2;
}

function userOpponent(match: TournamentMatch, user: User): MatchGamer {
	return match.g1.userId == user.userId ? match.g2 : match.g1;
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
