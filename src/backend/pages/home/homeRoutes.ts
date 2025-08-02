import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frame.js';
import { getUser, markUserOnline } from '../../user/userDB.js';
import { homeHtml } from './homeHtml.js';

/*
	Handles the home page route
*/
export function homeRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (500 == user.code) {
			const params = {
				page: "home",
				language: request.cookies.language ?? "english",
				errorCode: user.code,
				errorMessage: user.error
			};
			return reply.type("text/html").send(frameHtml(params));
		}
		
		if (!user.error)
			markUserOnline(db, user.id);

		const params = {
			user,
			page: "home",
			language: request.cookies.language ?? "english"
		};

		const frame = frameHtml(params, homeHtml(params));
		return reply.type("text/html").send(frame);
	});
}
