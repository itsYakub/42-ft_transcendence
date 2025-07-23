import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameAndContentHtml, frameHtml } from '../frame.js';
import { getUser } from '../../user/userDB.js';

export function tournamentPage(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/tournament', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

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

export function tournamentHtml(db: DatabaseSync, user: any): string {
	const html = tournamentHtmlString;

	return injectUser(html, user);
}

function injectUser(html: string, user: any): string {
	return html;
}

const tournamentHtmlString: string = `
	Tournament`;
