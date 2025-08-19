import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addFriend, getFriends, removeFriend } from './friendsDB.js';
import { friendsHtml } from './friendsHtml.js';
import { noUserError } from '../home/homeRoutes.js';
import { getUser, getUserByEmail } from '../../user/userDB.js';
import { frameHtml } from '../../frame/frameHtml.js';

export function friendsRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/friends', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		const friendsResponse = getFriends(db, userResponse.user);
		if (200 != friendsResponse.code) {
			const params = {
				user: userResponse.user,
				language,
				errorCode: friendsResponse.code,
				errorMessage: friendsResponse.error
			};
			return reply.type("text/html").send(frameHtml(params));
		}

		const params = {
			user: userResponse.user,
			language
		};
		const html = friendsHtml(friendsResponse.friends, params);

		const frame = frameHtml(params, html);
		return reply.type("text/html").send(frame);
	});

	fastify.post("/friends/add", async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		const json = request.body as any;
		json["id"] = userResponse.user.id;

		const response = addFriend(db, json);
		return reply.send(response);
	});

	fastify.post("/friends/remove", async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		const json = request.body as any;
		json["id"] = userResponse.user.id;

		const response = removeFriend(db, json);
		return reply.send(response);
	});

	fastify.post("/friends/find", async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		const json = request.body as any;
		if (userResponse.user.email == json.email) {
			return reply.send({
				code: 400,
				error: "ERR_SAME_EMAIL"
			});
		}

		const response = getUserByEmail(db, json.email);
		if (response.error)
			return reply.send(response);

		addFriend(db, {
			"id": userResponse.user.id,
			"friendID": response.id
		});
		return reply.send(response);
	});
}
