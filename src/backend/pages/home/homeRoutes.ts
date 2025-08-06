
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frameHtml.js';
import { getUser, markUserOnline } from '../user/userDB.js';
import { homeHtml } from './homeHtml.js';
import { userHtml } from '../user/userHtml.js';

/*
	Handles the home page route
*/
export function homeRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const response = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != response.code)
			return reply.type("text/html").send(noUser(response, language, "home"));

		markUserOnline(db, response.user.id);

		const params = {
			user: response.user,
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
