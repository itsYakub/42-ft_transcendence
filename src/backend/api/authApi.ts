import { FastifyRequest, FastifyReply } from 'fastify';
import { addGoogleUser, addGuest } from '../../db/userDB.js';
import { Result } from '../../common/interfaces.js';

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

export function registerGuest(request: FastifyRequest, reply: FastifyReply) {
	const guestBox = addGuest(request.db);
	if (Result.SUCCESS != guestBox.result)
		return reply.send(guestBox);

	return reply.header(
		"Set-Cookie", `accessToken=${guestBox.contents}; Path=/; Secure; HttpOnly;`).send(Result.SUCCESS);
}

/* Converts the image blob into base64 */
async function convertFile(avatarURL: string): Promise<string> {
	const response = await fetch(avatarURL);
	const img = await response.blob();
	const buffer = Buffer.from(await img.arrayBuffer());
	const converted = "data:" + img.type + ';base64,' + buffer.toString('base64');
	return converted;
}
