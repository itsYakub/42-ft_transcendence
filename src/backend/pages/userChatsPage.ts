import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameView } from '../views/frameView.js';
import { userChatsView } from '../views/userChatsView.js';
import { incomingChatsList, outgoingChatsList } from '../db/userChatsDb.js';
import { Result } from '../../common/interfaces.js';

export function userChatsPage(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/chat', async (request: FastifyRequest, reply: FastifyReply) => {
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

		incomingChatsBox.partners.forEach(partner => {
			if (null == outgoingChatsBox.partners.find(id => id.partnerId == partner.partnerId)) {
				outgoingChatsBox.partners.push(partner);
			}
		});

		outgoingChatsBox.partners.sort((a, b) => a.partnerNick.localeCompare(b.partnerNick));

		return reply.type("text/html").send(frameView({ user, language, page }, userChatsView(outgoingChatsBox.partners, user)));
	});
}
