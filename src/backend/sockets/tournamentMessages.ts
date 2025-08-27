import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { broadcastMessageToClients } from './serverSocket.js';
import { gamePlayers, markReady, markUnReady, } from '../db/gameDb.js';
import { Gamer, Message, MessageType, Result, User } from '../../common/interfaces.js';
import { addTournament, markTournamentGamerReady } from '../db/tournamentDb.js';

export function generateTournament(fastify: FastifyInstance, db: DatabaseSync, user: User) {
	const gamersBox = gamePlayers(db, user.gameId);
	if (Result.SUCCESS == gamersBox.result) {
		const shuffled = shuffleGamers(gamersBox.contents);
		if (Result.SUCCESS == addTournament(db, user.gameId, shuffled)) {
			shuffled.forEach(gamer => {
				markUnReady(db, gamer.userId);
			});
			broadcastMessageToClients(fastify, {
				type: MessageType.TOURNAMENT_UPDATE,
				gameId: user.gameId
			});
		}
	}
}

export function tournamentGamerReadyReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	markTournamentGamerReady(db, message.gameId, message.fromId);
	broadcastMessageToClients(fastify, {
		type: MessageType.TOURNAMENT_UPDATE,
		gameId: user.gameId
	});

}

export function userLeaveTournamentReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	broadcastMessageToClients(fastify, {
		type: MessageType.USER_LEAVE_TOURNAMENT,
		fromId: user.userId
	})
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
