import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DB } from '../db/db.js';
import { frameAndContentHtml, frameHtml } from './partial/frame.js';

export function tournamentPage(fastify: FastifyInstance, db: DB): void {
	fastify.get('/tournament', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = db.getUser(request.cookies.accessToken, request.cookies.refreshToken);

		if (!request.headers["referer"]) {
			const frame = frameHtml(db, "tournament", user);
			if ("db_error" == frame) {
				return reply.code(500);
			}
			return reply.code(200).type("text/html").send(frame);
		}

		const frame = frameAndContentHtml(db, "tournament", user);
		if ("db_error" == frame.navbar) {
			return reply.code(500);
		}
		return reply.code(200).send(frame);
	});
}

export function tournamentHtml(db: DB, user: any): string {
	const html = db.getView("tournament");

	return injectUser(html, user);
}

function injectUser(html: string, user: any): string {
	return html;
}
