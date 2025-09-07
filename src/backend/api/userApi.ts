import { FastifyRequest, FastifyReply } from 'fastify';
import { addUser, allNicknames, getUserByEmail, loginUserdb, updateRefreshtoken } from '../../db/userDB.js';
import { Result, TotpType } from '../../common/interfaces.js';
import { compareSync } from 'bcrypt-ts';
import { accessToken, refreshToken } from '../../db/jwt.js';
import { addTotpEmail, sendTotpEmail } from './totpApi.js';

export function listUsers(request: FastifyRequest, reply: FastifyReply) {
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
}

export function registerUser(request: FastifyRequest, reply: FastifyReply) {
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
}

export async function loginUser(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const { email, password } = request.body as any;

	const userBox = getUserByEmail(db, email);
	if (Result.SUCCESS != userBox.result)
		return reply.send(userBox);

	const user = userBox.contents;

	switch (user.totpType) {
		case TotpType.DISABLED:
			if (compareSync(password, user.password)) {
				const token = refreshToken(user.userId);
				updateRefreshtoken(db, {
					userId: user.userId, refreshToken: token
				});
				user.accessToken = accessToken(user.userId);
				user.refreshToken = token;
				return reply.send({
					result: Result.SUCCESS,
					contents: user
				});
			}

			return reply.send({ result: Result.ERR_BAD_PASSWORD });
		case TotpType.EMAIL:
			const result = await sendTotpEmail(db, user, request.language);
			if (Result.SUCCESS != result)
				return reply.send({ result });

			return reply.send({
				result,
				totpType: TotpType.EMAIL
			});
	}

	// const userBox = loginUserdb(db, request.body as any);
	// if (Result.SUCCESS != userBox.result) {
	// 	const date = "Thu, 01 Jan 1970 00:00:00 UTC";
	// 	return reply.header(
	// 		"Set-Cookie", `accessToken=blank; Path=/; expires=${date}; Secure; HttpOnly;`).header(
	// 			"Set-Cookie", `refreshToken=blank; Path=/; expires=${date}; Secure; HttpOnly;`).send(userBox);
	// }

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
}

export function listNicknames(request: FastifyRequest, reply: FastifyReply) {
	const users = allNicknames(request.db);
	return reply.send(users);
}
