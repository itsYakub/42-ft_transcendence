import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { noUserError } from '../home/homeRoutes.js';
import { getUser } from '../../user/userDB.js';
import { frameHtml } from '../../frame/frameHtml.js';
import { addBlocked, blockedList, removeBlocked } from './blockedDB.js';
import { blockedHtml } from './blockedHtml.js';

export function blockedRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/blocked', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		const blockedResponse = blockedList(db, userResponse.user);
		if (200 != blockedResponse.code) {
			const params = {
				user: userResponse.user,
				language,
				errorCode: blockedResponse.code,
				errorMessage: blockedResponse.error
			};
			return reply.type("text/html").send(frameHtml(params));
		}

		const params = {
			user: userResponse.user,
			language
		};
		const html = blockedHtml(blockedResponse.blocked, params);

		const frame = frameHtml(params, html);
		return reply.type("text/html").send(frame);
	});

	fastify.post("/blocked/add", async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		const json = request.body as any;
		json["id"] = userResponse.user.id;

		const response = addBlocked(db, json);
		return reply.send(response);
	});

	fastify.post("/blocked/remove", async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		const json = request.body as any;
		json["id"] = userResponse.user.id;

		const response = removeBlocked(db, json);
		return reply.send(response);
	});
}
