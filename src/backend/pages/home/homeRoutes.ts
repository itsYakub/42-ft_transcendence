import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { getUser } from '../../user/userDB.js';
import { homeHtml } from './homeHtml.js';
import { frameHtml } from '../../frame/frameHtml.js';
import { userHtml } from '../../user/userHtml.js';

/*
	Handles the home page route
*/
export function homeRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language, "home"));

		const params = {
			user: userResponse.user,
			page: request.url,
			language
		};

		const frame = frameHtml(params, homeHtml(params));
		return reply.type("text/html").send(frame);
	});
}

/*
	If there is no user logged in/guest or a DB error
*/
export function noUserError(response: any, language: string, page: string = null) {
	if (404 == response.code) {
		const params = {
			language
		};

		return frameHtml(params, userHtml());
	}

	const params = {
		page,
		language,
		errorCode: response.code,
		errorMessage: response.error
	};
	return frameHtml(params);
}

/*
	If there is a user logged in/guest but some other error
*/
export function userError(response: any, language: string, page: string = null) {
	if (404 == response.code) {
		const params = {
			language
		};

		return frameHtml(params, userHtml());
	}

	const params = {
		page,
		language,
		errorCode: response.code,
		errorMessage: response.error
	};
	return frameHtml(params);
}
