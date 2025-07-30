import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameAndContentHtml, frameHtml } from '../frame.js';
import { getUser, markUserOnline } from '../../user/userDB.js';
import { gameHtmlString } from '../game/game.js';

export function playPage(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/play', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		if (user.id)
			markUserOnline(db, user.id);

		const params = { user, page: "play", language: request.cookies.language ?? "english" };

		if (!request.headers["referer"]) {
			const frame = frameHtml(db, params);
			if (frame.error) {
				return reply.code(500);
			}
			return reply.type("text/html").send(frame);
		}

		const frame = frameAndContentHtml(db, params);
		if (frame.error) {
			return reply.code(500);
		}
		return reply.send(frame);
	});
}

export function playHtml(db: DatabaseSync, { user, language }): string {
	const html = playHtmlString + gameHtmlString;

	return html;
}

const playHtmlString: string = `
	<div class="w-full h-full bg-gray-900 m-auto text-center content-center ">
		<h1 class="text-white">Single game</h1>
		<button id="startSingleGameButton" class="text-white mt-4 bg-gray-800 block mx-auto cursor-pointer text-center p-2 rounded-lg hover:bg-gray-700">Start single game</button>
	</div>`;
