import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { frameView } from '../views/frameView.js';
import { userChatsView } from '../views/userChatsView.js';
import { incomingChatsList, outgoingChatsList } from '../db/userChatsDb.js';
import { Result } from '../../common/interfaces.js';
import { foesList } from '../db/foesDb.js';

export function userChatsPage(fastify: FastifyInstance): void {
	fastify.get('/chat', async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;
		const language = request.language;
		const page = request.url;

		const outgoingChatsBox = outgoingChatsList(db, user.userId);
		if (Result.SUCCESS != outgoingChatsBox.result)
			return reply.type("text/html").send(frameView({
				user,
				language,
				result: outgoingChatsBox.result
			}));

		const incomingChatsBox = incomingChatsList(db, user.userId);
		if (Result.SUCCESS != incomingChatsBox.result)
			return reply.type("text/html").send(frameView({
				user,
				language,
				result: incomingChatsBox.result
			}));

		incomingChatsBox.contents.forEach(partner => {
			if (null == outgoingChatsBox.contents.find(id => id.userId == partner.userId)) {
				outgoingChatsBox.contents.push(partner);
			}
		});

		outgoingChatsBox.contents.sort((a, b) => a.nick.localeCompare(b.nick));

		const foesBox = foesList(db, user.userId);
		if (Result.SUCCESS != foesBox.result)
			return reply.type("text/html").send(frameView({
				user,
				language,
				result: foesBox.result
			}));

		const foesChats = foesBox.contents.map(f => f.foeId);
		outgoingChatsBox.contents = outgoingChatsBox.contents.filter(p => !foesChats.includes(p.userId));

		return reply.type("text/html").send(frameView({ user, language, page }, userChatsView(outgoingChatsBox.contents, user)));
	});	
}
