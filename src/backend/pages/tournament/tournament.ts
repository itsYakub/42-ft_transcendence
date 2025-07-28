import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameAndContentHtml, frameHtml } from '../frame.js';
import { getUser, markUserOnline } from '../../user/userDB.js';

export function tournamentPage(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/tournament', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		if (user.id)
			markUserOnline(db, user.id);

		const params = { ...user, page: "tournament", language: request.cookies.language ?? "english" };

		if (!request.headers["referer"]) {
			const frame = frameHtml(db, params);
			if (frame.error) {
				return reply.code(frame.code);
			}
			return reply.type("text/html").send(frame);
		}

		const frame = frameAndContentHtml(db, params);
		if (frame.error) {
			return reply.code(frame.code);
		}
		return reply.send(frame);
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
