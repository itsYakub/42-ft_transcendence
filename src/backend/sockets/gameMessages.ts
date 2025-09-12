import { DatabaseSync } from "node:sqlite";
import { Message, MessageType, Result, ShortUser, User } from '../../common/interfaces.js';
import { removeUserFromMatch } from '../../db/userDB.js';
import { onlineUsers, sendMessageToUsers } from "./serverSocket.js";

export function userLogoutReceived(db: DatabaseSync, user: ShortUser, message: Message) {
	message.gameId = user.gameId;
	const response = removeUserFromMatch(db, user.userId);

	if (Result.SUCCESS == response) {
		onlineUsers.delete(user.userId.toString());
		sendMessageToUsers({
			type: MessageType.GAME_LIST_CHANGED
		});
	}
}

export function tournamentChatReceived(db: DatabaseSync, message: Message) {
	//message.fromId = user.userId;
	//message.gameId = user.gameId;

	// if (Result.SUCCESS == addGameChat(db, message))
	// 	broadcastMessageToClients(fastify, message);
}
