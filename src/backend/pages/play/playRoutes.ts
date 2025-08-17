import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frameHtml.js';
import { getUser } from '../user/userDB.js';
import { playHtml } from './playHtml.js';
import { noUserError, userError } from '../home/homeRoutes.js';
import { getRooms, markReady, roomPlayers } from './playDB.js';
import { broadcastMessageToClients } from '../../sockets/serverSockets.js';
import { roomMessages } from '../messages/messagesDB.js';
import { matchHtml } from '../match/matchHtml.js';

export function playRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/play', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language, "play"));

		const user = userResponse.user;

		if (user.roomID) {
			const roomID = user.roomID;

			const playersResponse = roomPlayers(db, { roomID });
			const messagesResponse = roomMessages(db, { roomID });

			const params = {
				players: playersResponse.players,
				user,
				page: "play",
				messages: messagesResponse.messages,
				language
			};

			// determine if match or tournament from roomID
			const frame = frameHtml(params, matchHtml(params));
			return reply.type("text/html").send(frame);
		}

		const roomsResponse = getRooms(db);
		if (200 != roomsResponse.code) {
			const params = {
				language,
				user: user,
				errorCode: roomsResponse.code,
				errorMessage: roomsResponse.error
			};
			return reply.type("text/html").send(frameHtml(params));
		}

		const params = {
			user: user,
			page: "play",
			language
		};

		const frame = frameHtml(params, playHtml(roomsResponse.rooms, params));
		return reply.type("text/html").send(frame);
	});
}
