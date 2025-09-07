import { DatabaseSync } from "node:sqlite";
import { addUserChat } from '../../db/userChatsDb.js';
import { Message, MessageType, Result, ShortUser, User } from '../../common/interfaces.js';

export function userLoginReceived(db: DatabaseSync, user: ShortUser) {
	console.log(`${user.nick} logged in`);
}

export function userSendUserChatReceived(db: DatabaseSync, user: ShortUser, message: Message) {
	message.fromId = user.userId;
	const response = addUserChat(db, message);

	//if (Result.SUCCESS == response.result)
	//	broadcastMessageToClients(message);
}

export function userInviteReceived(db: DatabaseSync, user: ShortUser, message: Message) {
	message.gameId = user.gameId;
	//broadcastMessageToClients(message);
}
