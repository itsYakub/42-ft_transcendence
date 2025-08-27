import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { broadcastMessageToClients } from './serverSocket.js';
import { gamePlayers, joinGame, leaveGame, } from '../db/gameDb.js';
import { Gamer, Message, MessageType, Result, User } from '../../common/interfaces.js';
import { addGameChat } from '../db/gameChatsDb.js';
import { addTournament } from '../db/tournamentDb.js';
import { gamersString, tournamentMatchString } from '../views/lobbyView.js';

export function generateTournament(fastify: FastifyInstance, db: DatabaseSync, user: User) {
	const gamersBox = gamePlayers(db, user.gameId);
	if (Result.SUCCESS == gamersBox.result) {
		const shuffled = shuffleGamers(gamersBox.contents);
		if (Result.SUCCESS == addTournament(db, user.gameId, shuffled)) {
			shuffled.forEach((gamer, index) => {
				if (index < 2) {
					console.log(`sending play message to ${gamer.nick}`);
					// send up next
					broadcastMessageToClients(fastify, {
						type: MessageType.TOURNAMENT_UPDATE,
						toId: gamer.userId,
						content: tournamentMatchString(shuffled, user)
					});
				}
				else {
					console.log(`sending wait message to ${gamer.userId}`);
					// send wait
					const reversed = [shuffled[2], shuffled[3], shuffled[0], shuffled[1]];
					broadcastMessageToClients(fastify, {
						type: MessageType.TOURNAMENT_UPDATE,
						toId: gamer.userId,
						content: tournamentMatchString(reversed, user)
					});
				}
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
