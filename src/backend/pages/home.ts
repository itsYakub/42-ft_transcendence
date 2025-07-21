import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DB } from '../db/db.js';
import { frameAndContentHtml, frameHtml } from './partial/frame.js';

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
export function homePage(fastify: FastifyInstance, db: DB): void {
	fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = db.getUser(request.cookies.accessToken, request.cookies.refreshToken);

		if (!request.headers["referer"]) {
			const frame = frameHtml(db, "home", user);
			if ("db_error" == frame) {
				return reply.code(500);
			}
			return reply.code(200).type("text/html").send(frame);
		}

		const frame = frameAndContentHtml(db, "home", user);
		if ("db_error" == frame.navbar) {
			return reply.code(500);
		}
		return reply.code(200).send(frame);
	});
}

export function homeHtml(db: DB, user: any): string {
	let html = db.getView("home");

	return injectUser(html, user);
}

function injectUser(html: string, user: any): string {
	return html;
}
