import { FastifyRequest, FastifyReply } from 'fastify';
import { frameView } from '../views/frameView.js';
import { userChatsView } from '../views/userChatsView.js';
import { hasUnseenChats, incomingChatsList, outgoingChatsList, unseenChats } from '../../db/userChatsDb.js';
import { Page, Result } from '../../common/interfaces.js';
import { readFoes } from '../../db/foesDb.js';

export function getChatPage(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	const language = request.language;

	const booleanBox = hasUnseenChats(request.db, user.userId);
	const chatsWaiting = Result.SUCCESS == booleanBox.result ? booleanBox.contents as boolean : false;

	const outgoingChatsBox = outgoingChatsList(db, user.userId);
	if (Result.SUCCESS != outgoingChatsBox.result)
		return reply.type("text/html").send(frameView({
			language,
			result: outgoingChatsBox.result,
			user
		}, chatsWaiting));

	const incomingChatsBox = incomingChatsList(db, user.userId);
	if (Result.SUCCESS != incomingChatsBox.result)
		return reply.type("text/html").send(frameView({
			language,
			result: incomingChatsBox.result,
			user
		}, chatsWaiting));

	let seen = true;
	incomingChatsBox.contents.forEach(partner => {
		console.log(partner.nick);
		if (null == outgoingChatsBox.contents.find(id => id.userId == partner.userId)) {
			console.log("pushing");
			outgoingChatsBox.contents.push(partner);
		}
	});

	outgoingChatsBox.contents.sort((a, b) => a.nick.localeCompare(b.nick));

	const foesBox = readFoes(db, user.userId);
	if (Result.SUCCESS != foesBox.result)
		return reply.type("text/html").send(frameView({
			language,
			result: foesBox.result,
			user
		}, chatsWaiting));

	const foesChats = foesBox.contents.map(f => f.foeId);
	outgoingChatsBox.contents = outgoingChatsBox.contents.filter(p => !foesChats.includes(p.userId));

	outgoingChatsBox.contents.forEach((partner) => {
		const hasUnseen = unseenChats(db, user.userId, partner.userId)
		console.log(hasUnseen.contents);
		partner.hasUnseen = hasUnseen.contents;
	});


	return reply.type("text/html").send(frameView({ user, language, page: Page.CHAT }, chatsWaiting, userChatsView(outgoingChatsBox.contents)));
}
