import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { frameView } from '../views/frameView.js';
import { userChatsView } from '../views/userChatsView.js';
import { incomingChatsList, outgoingChatsList } from '../db/userChatsDb.js';
import { Result } from '../../common/interfaces.js';

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
			if (null == outgoingChatsBox.contents.find(id => id.partnerId == partner.partnerId)) {
				outgoingChatsBox.contents.push(partner);
			}
		});

		outgoingChatsBox.contents.sort((a, b) => a.partnerNick.localeCompare(b.partnerNick));

		return reply.type("text/html").send(frameView({ user, language, page }, userChatsView(outgoingChatsBox.contents, user)));
	});	
}
