import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DB } from '../db/db.js';
import { frameAndContentHtml, frameHtml } from './partial/frame.js';

export function profilePage(fastify: FastifyInstance, db: DB): void {
	fastify.get('/profile', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = db.getUser(request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error) {
			return reply.redirect("/");
		}

		if (!request.headers["referer"]) {
			const frame = frameHtml(db, "profile", user);
			if ("db_error" == frame) {
				return reply.code(500);
			}
			return reply.type("text/html").send(frame);
		}
		else {
			const frame = frameAndContentHtml(db, "profile", user);
			if ("db_error" == frame.navbar) {
				return reply.code(500);
			}
			return reply.send(frame);
		}
	});
}

export function profileHtml(db: DB, user: any): string {
	const html = db.getView("profile");

	return injectUser(html, user);
}

function injectUser(html: string, user: any): string {
	html = html.replaceAll("%%NICK%%", user.nick);
	html = html.replaceAll("%%AVATAR%%", user.avatar);
	if (user.google)
		html = html.replaceAll("%%CHANGEPASSWORDVISIBILITY%%", "hidden");
	else
		html = html.replaceAll("%%CHANGEPASSWORDVISIBILITY%%", "visible");

	return html;
}
