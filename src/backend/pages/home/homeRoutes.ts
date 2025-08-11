
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frameHtml.js';
import { getUser, leaveRoom, markUserOnline } from '../user/userDB.js';
import { homeHtml } from './homeHtml.js';
import { userHtml } from '../user/userHtml.js';

/*
	Handles the home page route
*/
export function homeRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUser(userResponse, language, "home"));

		markUserOnline(db, userResponse.user.id);
		leaveRoom(db, userResponse);

		const params = {
			user: userResponse.user,
			page: "home",
			language
		};

		const frame = frameHtml(params, homeHtml(params));
		return reply.type("text/html").send(frame);
	});

	// fastify.get('/hello-ws', { websocket: true }, (connection, req) => {
	// 	connection.socket.on('message', message => {
	// 		connection.socket.send('Hello Fastify WebSockets');
	// 	});
	// });
}

/*
	If there is no user logged in/guest or a DB error
*/
export function noUser(response: any, language: string, page: string = null) {
	if (404 == response.code) {
		const params = {
			language
		};

		return frameHtml(params, userHtml(params));
	}

	const params = {
		page,
		language,
		errorCode: response.code,
		errorMessage: response.error
	};
	return frameHtml(params);
}
