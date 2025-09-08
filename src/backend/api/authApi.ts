import { FastifyRequest, FastifyReply } from 'fastify';
import { addGoogleUser, addGuest, addUser, getUserByEmail, removeUserFromMatch, updateRefreshtoken } from '../../db/userDB.js';
import { MessageType, Result, TotpType } from '../../common/interfaces.js';
import { compareSync } from 'bcrypt-ts';
import { refreshToken, accessToken } from '../../db/jwt.js';
import { sendTotpEmail } from './totpApi.js';
import { handleClientMessage } from '../sockets/serverSocket.js';

export async function googleSignIn(request: FastifyRequest, reply: FastifyReply) {
	const code: string = request.query["code"];

	const redirectUrl = (`https://${request.host}:3000/auth/google`);

	const params = {
		client_id: process.env.GOOGLE_CLIENT,
		client_secret: process.env.GOOGLE_SECRET,
		code: code,
		grant_type: "authorization_code",
		redirect_uri: redirectUrl
	}

	const response = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify(params)
	});

	if (200 != response.status)
		return reply.header("Set-Cookie", `googleautherror=true; Path=/;`).redirect("/");

	const json = await response.json();
	const idToken: string = json.id_token;
	const googlePayload = idToken.split(".")[1];
	const decoded: string = atob(googlePayload);
	const user = JSON.parse(decoded);
	const avatar = await convertFile(user.picture);

	const userJSON = {
		email: user.email,
		avatar: avatar,
	}

	const googleBox = addGoogleUser(request.db, userJSON);
	if (Result.SUCCESS != googleBox.result)
		return reply.header("Set-Cookie", `googleautherror=true; Path=/;`).redirect("/");

	const accessTokenDate = new Date();
	accessTokenDate.setSeconds(accessTokenDate.getSeconds() + 5);
	const refreshTokenDate = new Date();
	refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);
	return reply.header(
		"Set-Cookie", `accessToken=${googleBox.contents[0]}; Path=/; expires=${accessTokenDate}; Secure; HttpOnly;`).header(
			"Set-Cookie", `refreshToken=${googleBox.contents[1]}; Path=/; expires=${refreshTokenDate}; Secure; HttpOnly;`).redirect("/");
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


export function logoutUser(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;

	console.log(`logging out ${user.nick} ${user.userId}`);
	const result = removeUserFromMatch(db, user.userId);
	if (Result.SUCCESS != result)
		return reply.send(result);
	const date = "Thu, 01 Jan 1970 00:00:00 UTC";
	handleClientMessage(db, user, {
		type: MessageType.USER_LOGOUT,
		fromId: user.userId
	});
	return reply.header(
		"Set-Cookie", `accessToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).header(
			"Set-Cookie", `refreshToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).send(Result.SUCCESS);
}

export function registerGuest(request: FastifyRequest, reply: FastifyReply) {
	const guestBox = addGuest(request.db);
	if (Result.SUCCESS != guestBox.result)
		return reply.send(guestBox);

	return reply.header(
		"Set-Cookie", `accessToken=${guestBox.contents}; Path=/; Secure; HttpOnly;`).send(Result.SUCCESS);
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

/* Converts the image blob into base64 */
async function convertFile(avatarURL: string): Promise<string> {
	const response = await fetch(avatarURL);
	const img = await response.blob();
	const buffer = Buffer.from(await img.arrayBuffer());
	const converted = "data:" + img.type + ';base64,' + buffer.toString('base64');
	return converted;
}
