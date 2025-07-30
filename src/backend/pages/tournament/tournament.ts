import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameAndContentHtml, frameHtml } from '../frame.js';
import { getUser, markUserOnline } from '../../user/userDB.js';
import { addTournament, updateTournament } from './tournamentDB.js';

export function tournamentPage(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/tournament', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		if (user.id)
			markUserOnline(db, user.id);

		const params = { user, page: "tournament", language: request.cookies.language ?? "english" };

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

	fastify.post('/tournament/add', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		const params = JSON.parse(request.body as string);

		addTournament(db, params);
	});

	fastify.post('/tournament/update', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		const params = JSON.parse(request.body as string);

		const response = updateTournament(db, params);

		if (response.error)
			return reply.code(response.code).send(response);

		return reply.send(response);
	});
}

export function tournamentHtml(db: DatabaseSync, { user, language }): string {
	const html = tournamentHtmlString;

	return html;
}

const tournamentHtmlString: string = `
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<h1 class="text-white pt-4 mb-4 text-4xl">New tournament</h1>
		<div class="flex flex-col w-300 mx-auto text-center items-center content-center">
			<form id="newTournamentForm">
				<input type="text" name="p1Name" required="true" placeholder="Player 1" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
				<input type="text" name="p2Name" required="true" placeholder="Player 2" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
				<input type="text" name="p3Name" required="true" placeholder="Player 3" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
				<input type="text" name="p4Name" required="true" placeholder="Player 4" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
				<button type="submit" id="startTournamentButton" class="text-white mt-4 bg-gray-800 block mx-auto cursor-pointer text-center p-2 rounded-lg hover:bg-gray-700">Start</button>
			</form>
		</div>
	</div>`;
