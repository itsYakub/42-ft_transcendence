import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DB } from '../db/db.js';
import { frameAndContentHtml, frameHtml } from './partial/frame.js';

export function matchesPage(fastify: FastifyInstance, db: DB): void {
	fastify.get('/matches', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = db.getUser(request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error) {
			return reply.redirect("/");
		}

		if (!request.headers["referer"]) {
			const frame = frameHtml(db, "matches", user);
			if ("db_error" == frame) {
				return reply.code(500);
			}
			return reply.code(200).type("text/html").send(frame);
		}
		else {
			const frame = frameAndContentHtml(db, "matches", user);
			if ("db_error" == frame.navbar) {
				return reply.code(500);
			}
			return reply.code(200).send(frame);
		}
	});
}

export function matchesHtml(db: DB, user: any): string {
	const html = db.getView("matches");

	return injectUser(html, user);
}

function injectUser(html: string, user: any): string {
	html = html.replaceAll("%%NICK%%", user.nick);
	html = html.replaceAll("%%AVATAR%%", user.avatar);

	return html;
}
