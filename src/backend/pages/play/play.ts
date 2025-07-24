import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameAndContentHtml, frameHtml } from '../frame.js';
import { getUser, markUserOnline } from '../../user/userDB.js';

export function playPage(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/play', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		if (user.id)
			markUserOnline(db, user.id);

		if (!request.headers["referer"]) {
			const frame = frameHtml(db, "play", user);
			if ("db_error" == frame) {
				return reply.code(500);
			}
			return reply.code(200).type("text/html").send(frame);
		}

		const frame = frameAndContentHtml(db, "play", user);
		if ("db_error" == frame.navbar) {
			return reply.code(500);
		}
		return reply.code(200).send(frame);
	});
}

export function playHtml(db: DatabaseSync, user: any): string {
	const html = playHtmlString;

	return injectUser(html, user);
}

function injectUser(html: string, user: any): string {
	return html;
}

const playHtmlString: string = `
	<button onclick="setupGame()">Setup</button>
	<button onclick="startGame()">Start</button>
	<div class="text-center m-4" style="margin:16px;">
		<canvas id='pongCanvas'></canvas>
	</div>`;
