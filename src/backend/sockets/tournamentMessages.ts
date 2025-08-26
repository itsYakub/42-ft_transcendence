import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { broadcastMessageToClients } from './serverSocket.js';
import { gamePlayers, joinGame, leaveGame, } from '../db/gameDb.js';
import { Gamer, Result, User } from '../../common/interfaces.js';
import { addGameChat } from '../db/gameChatsDb.js';
import { addTournament } from '../db/tournamentDb.js';

export function generateTournament(fastify: FastifyInstance, db: DatabaseSync, user: User) {
	const gamersBox = gamePlayers(db, user.gameId);
	if (Result.SUCCESS == gamersBox.result) {
		const shuffled = shuffleGamers(gamersBox.contents);
		console.log(shuffled);
		if (Result.SUCCESS == addTournament(db, user.gameId, shuffled)) {
			shuffled.forEach((gamer, index) => {
				if (index < 2) {
					// send up next
				}
				else {
					// send wait
				}
			});
		}
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
