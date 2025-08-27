import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { broadcastMessageToClients } from './serverSocket.js';
import { gamePlayers } from '../db/gameDb.js';
import { Gamer, Message, MessageType, Result, Tournament, TournamentGamer, User } from '../../common/interfaces.js';
import { addTournament, getTournament, markTournamentGamerReady } from '../db/tournamentDb.js';

export function generateTournament(fastify: FastifyInstance, db: DatabaseSync, user: User) {
	const gamersBox = gamePlayers(db, user.gameId);
	if (Result.SUCCESS == gamersBox.result) {
		const shuffled = shuffleGamers(gamersBox.contents);
		if (Result.SUCCESS == addTournament(db, user.gameId, shuffled)) {
			// shuffled.forEach(gamer => {
			// 	markUnReady(db, gamer.userId);
			// });
			broadcastMessageToClients(fastify, {
				type: MessageType.TOURNAMENT_UPDATE,
				gameId: user.gameId
			});
		}
	}
}

export function tournamentGamerReadyReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {

	const tournament = getTournament(db, user);
	if (Result.SUCCESS == tournament.result) {
		const gamer = gamerFromUser(tournament.contents, user);
		const opponent = opponentFromUser(tournament.contents, user);
		console.log(`match is between ${gamer.nick} and ${opponent.nick}`);
		markTournamentGamerReady(db, user.gameId, gamer.index);
		broadcastMessageToClients(fastify, {
			type: MessageType.TOURNAMENT_UPDATE,
			gameId: user.gameId
		});

		if (opponent.ready) {
			console.log(`starting match between ${gamer.nick} and ${opponent.nick}`);
			broadcastMessageToClients(fastify, {
				type: MessageType.TOURNAMENT_MATCH_START,
				toId: gamer.userId
			});

			broadcastMessageToClients(fastify, {
				type: MessageType.TOURNAMENT_MATCH_START,
				toId: opponent.userId
			});
		}
	}
}

export function userLeaveTournamentReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	broadcastMessageToClients(fastify, {
		type: MessageType.USER_LEAVE_TOURNAMENT,
		fromId: user.userId
	})
}

function gamerFromUser(tournament: Tournament, user: User): TournamentGamer {
	const gamers = [];
	gamers.push(tournament.primaryMatch.gamer1, tournament.primaryMatch.gamer2, tournament.secondaryMatch.gamer1, tournament.secondaryMatch.gamer2);
	return gamers.find(gamer => gamer.userId == user.userId);
}

function opponentFromUser(tournament: Tournament, user: User): TournamentGamer {
	const gamer = gamerFromUser(tournament, user);
	switch (gamer.index) {
		case 1:
			return tournament.primaryMatch.gamer2;
		case 2:
			return tournament.primaryMatch.gamer1;
		case 3:
			return tournament.secondaryMatch.gamer2;
		default:
			return tournament.secondaryMatch.gamer1;
	}
}

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
