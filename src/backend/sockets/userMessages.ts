import { DatabaseSync } from "node:sqlite";
import { addUserChat } from '../../db/userChatsDb.js';
import { Message, MessageType, Result, ShortUser, User } from '../../common/interfaces.js';
import { sendMessageToGameIdUsers } from "./serverSocket.js";

export function userLoginReceived(db: DatabaseSync, user: ShortUser) {
	console.log(`${user.nick} logged in`);
}

export function userSendUserChatReceived(db: DatabaseSync, message: Message) {
	console.log(message);
	const response = addUserChat(db, message);

	sendMessageToGameIdUsers({
		type: MessageType.USER_SEND_USER_CHAT,
		fromId: message.fromId,
		toId: message.toId,
		chat: message.chat
	}, [message.fromId, message.toId]);
}

export function userInviteReceived(db: DatabaseSync, message: Message) {
	//message.gameId = user.gameId;
	//broadcastMessageToClients(message);
}
