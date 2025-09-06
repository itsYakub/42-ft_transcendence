import { FastifyRequest, FastifyReply } from 'fastify';
import { Result } from '../../common/interfaces.js';
import { incomingChatsList, outgoingChatsList, partnerChats } from '../db/userChatsDb.js';
import { userChatsMessages } from '../../common/dynamicElements.js';
import { allChattableUsers, getUserById } from '../db/userDB.js';
import { readNotifications } from '../db/notificationsDb.js';
import { readFoes } from '../db/foesDb.js';

export function notificationsList(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;

	const notificationsBox = readNotifications(db, user.userId);
	return reply.send(notificationsBox);
}

export function getChats(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	const { partnerId } = request.body as any;

	const chatsBox = partnerChats(db, user.userId, partnerId);
	if (Result.SUCCESS != chatsBox.result)
		return reply.send(chatsBox);

	const userBox = getUserById(db, partnerId);
	if (Result.SUCCESS != userBox.result)
		return reply.send(userBox);

	return reply.send({
		result: Result.SUCCESS,
		contents: {
			messages: userChatsMessages(chatsBox.contents, partnerId),
			partner: userBox.contents
		}
	});
}

export function chatsList(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;

	// const notificationsBox = notificationsList(db, user.userId);
	// if (Result.SUCCESS != notificationsBox.result)
	// 	return reply.send(notificationsBox.result);

	const incomingChatsBox = incomingChatsList(db, user.userId);
	if (Result.SUCCESS != incomingChatsBox.result)
		return reply.send(incomingChatsBox.result);

	const outgoingChatsBox = outgoingChatsList(db, user.userId);
	if (Result.SUCCESS != outgoingChatsBox.result)
		return reply.send(outgoingChatsBox.result);

	const foesBox = readFoes(db, user.userId);
	if (Result.SUCCESS != foesBox.result)
		return reply.send(foesBox.result);

	const incomingChats = incomingChatsBox.contents.map(c => c.userId);
	const outgoingChats = outgoingChatsBox.contents.map(c => c.userId);
	const foesChats = foesBox.contents.map(f => f.foeId);

	const chattableUsers = allChattableUsers(db, user);
	if (Result.SUCCESS != chattableUsers.result)
		return reply.send(chattableUsers.result);

	const output = chattableUsers.contents.filter(c => !incomingChats.includes(c.userId) && !outgoingChats.includes(c.userId) && !foesChats.includes(c.userId))

	return reply.send({
		result: Result.SUCCESS,
		contents: output
	});
}

export function userChats(request: FastifyRequest, reply: FastifyReply) {
	// const user = request.user;
	// const { otherUserId } = request.params as any;

	// const usersResponse = allOtherUsers(db, user.userId);
	// const messagesResponse = userMessages(db, {
	// 	userId: user.userId,
	// 	otherUserId
	// });

	// const messageSendersResponse = getMessageSenders(db, user);
	// if (Result.SUCCESS == messagesResponse.result) {
	// 	const usersHtml = userListString(usersResponse.users, [], messageSendersResponse.ids, otherUserId);
	// 	const messagesHtml = privateMessageListString(user.userId, messagesResponse.messages, otherUserId);

	// 	return reply.send({
	// 		result: Result.SUCCESS,
	// 		usersHtml,
	// 		messagesHtml
	// 	});
	// }
	// else
	// 	return reply.send({
	// 		result: Result.ERR_NOT_FOUND,
	// 	});
}
