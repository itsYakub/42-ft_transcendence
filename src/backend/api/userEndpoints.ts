import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { addUser, getUserByEmail, loginUser } from '../db/userDB.js';
import { Result } from '../../common/interfaces.js';

export function userEndpoints(fastify: FastifyInstance) {
	fastify.get("/api/user", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;

		// Don't send all details to the frontend
		return reply.send({
			result: Result.SUCCESS,
			contents: {
				userId: user.userId,
				nick: user.nick,
				gameId: user.gameId,
				totpType: user.totpType,
				userType: user.userType,
			}
		});
	});

	fastify.post("/api/user/register", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const checkResponse = getUserByEmail(db, (request.body as any).email);
		if (Result.ERR_NO_USER != checkResponse.result)
			return reply.send({
				result: Result.ERR_EMAIL_IN_USE
			});

		const response = addUser(db, request.body as any);
		if (Result.SUCCESS != response.result)
			return reply.send(response);

		const accessTokenDate = new Date();
		accessTokenDate.setSeconds(accessTokenDate.getSeconds() + 5);
		const refreshTokenDate = new Date();
		refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);
		return reply.header(
			"Set-Cookie", `accessToken=${response.contents[0]}; expires=${accessTokenDate}; Path=/; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=${response.contents[1]}; expires=${refreshTokenDate}; Path=/; Secure; HttpOnly;`).send({
					result: Result.SUCCESS
				});
	});

	fastify.post("/api/user/login", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const userBox = loginUser(db, request.body as any);
		if (Result.SUCCESS != userBox.result) {
			const date = "Thu, 01 Jan 1970 00:00:00 UTC";
			return reply.header(
				"Set-Cookie", `accessToken=blank; Path=/; expires=${date}; Secure; HttpOnly;`).header(
					"Set-Cookie", `refreshToken=blank; Path=/; expires=${date}; Secure; HttpOnly;`).send(userBox);
		}

		// if (userBox.contents.totpEnabled) {
		// 	return reply.send({
		// 		result: Result.SUCCESS,
		// 		totpEnabled: true
		// 	});
		// }

		const accessTokenDate = new Date();
		accessTokenDate.setSeconds(accessTokenDate.getSeconds() + 5);
		const refreshTokenDate = new Date();
		refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);

		return reply.header(
			"Set-Cookie", `accessToken=${userBox.contents.accessToken}; Path=/; expires=${accessTokenDate}; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=${userBox.contents.refreshToken}; Path=/; expires=${refreshTokenDate}; Secure; HttpOnly;`).send({
					result: Result.SUCCESS,
					totpEnabled: false
				});
	});
}
