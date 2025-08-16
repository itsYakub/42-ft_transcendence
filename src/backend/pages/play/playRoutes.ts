import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frameHtml.js';
import { getUser, markUserOnline } from '../user/userDB.js';
import { playHtml } from './playHtml.js';
import { noUserError, userError } from '../home/homeRoutes.js';
import { addToRoom, getRooms, leaveRoom, makeReady } from './playDB.js';

export function playRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/play', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language, "play"));

		//markUserOnline(db, userResponse.user.id);
		//leaveRoom(db, userResponse.user);

		const roomsResponse = getRooms(db);
		if (200 != roomsResponse.code) {
			const params = {
				language,
				user: userResponse.user,
				errorCode: roomsResponse.code,
				errorMessage: roomsResponse.error
			};
			return reply.type("text/html").send(frameHtml(params));
		}

		const params = {
			user: userResponse.user,
			page: "play",
			language
		};

		const frame = frameHtml(params, playHtml(roomsResponse.rooms, params));
		return reply.type("text/html").send(frame);
	});

	fastify.post('/play/new', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		const params = JSON.parse(request.body as string);
		params["user"] = userResponse.user;
		const roomResponse = addToRoom(db, params);
		return reply.send(roomResponse);
	});

	fastify.post('/play/ready', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		const roomResponse = makeReady(db, userResponse.user);
		return reply.send(roomResponse);
	});
}
