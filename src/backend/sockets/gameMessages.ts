import { DatabaseSync } from "node:sqlite";
import { Message, MessageType, Result, ShortUser, User } from '../../common/interfaces.js';
import { createTournamentChat } from '../../db/TournamentChatsDb.js';
import { removeUserFromMatch } from '../../db/userDB.js';

export function userGameLeaveReceived(db: DatabaseSync, user: ShortUser, message: Message) {
	message.gameId = user.gameId;
	const response = removeUserFromMatch(db, user.userId);

	if (Result.SUCCESS == response) {
		// message.fromId = user.userId;
		// broadcastMessageToClients(fastify, message);
	}
}

export function tournamentChatReceived(db: DatabaseSync, user: ShortUser, message: Message) {
	message.fromId = user.userId;
	message.gameId = user.gameId;

	// if (Result.SUCCESS == addGameChat(db, message))
	// 	broadcastMessageToClients(fastify, message);
}
