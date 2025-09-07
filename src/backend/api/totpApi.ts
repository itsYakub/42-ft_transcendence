import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import * as OTPAuth from "otpauth";
import nodemailer from 'nodemailer';
import encodeQR from 'qr';
import { Result, User } from '../../common/interfaces.js';
import { translate } from '../../common/translations.js';
import { getUserByEmail, loginUserdb, updateRefreshtoken } from '../../db/userDB.js';
import { DatabaseSync } from 'node:sqlite';
import { updateAppTotp, updateEmailTotp, updateTotp, updateTotpSecret } from '../../db/totpDb.js';
import { accessToken, refreshToken } from '../../db/jwt.js';

export async function addTotpApp(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;

	const secret = new OTPAuth.Secret({ size: 20 });
	const result = updateTotpSecret(db, secret.base32, user.userId);
	if (Result.SUCCESS != result)
		return reply.send({
			result
		});

	let totp = new OTPAuth.TOTP({
		issuer: "Transcendence",
		label: user.email,
		algorithm: "SHA1",
		digits: 6,
		period: 30,
		secret: secret,
	});

	reply.send({
		result: Result.SUCCESS,
		contents: {
			secret: secret.base32,
			qrcode: encodeQR(totp.toString(), 'svg'),
		}
	});
}

export async function addTotpEmail(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;

	const result = await sendTotpEmail(db, user, request.language);
	return reply.send(result);
}

export async function sendTotpEmail(db: DatabaseSync, user: User, language: string): Promise<Result> {
	const secret = Math.floor(100000 + Math.random() * 900000).toString();
	const result = updateTotpSecret(db, secret, user.userId);
	if (Result.SUCCESS != result)
		return result;

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'transcen42dence@gmail.com',
			pass: 'bbzo uhrv uycr cida'
		}
	});

	const text = translate(language, "%%MESSAGE_TOTP%%");

	let mailOptions = {
		host: "smtp.gmail.com",
		port: 587,
		tls: {
			rejectUnauthorized: true,
			minVersion: "TLSv1.2"
		},
		from: '"Transcendence Team" <transcen42dence@gmail.com>',
		to: user.email,
		subject: 'Transcendence TOTP',
		text: `${text}: ${secret}`,
		html: `${text}: <b>${secret}</b>`
	};

	try {
		const sent = await transporter.sendMail(mailOptions);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export async function verifyTotpApp(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;

	let totp = new OTPAuth.TOTP({
		issuer: "Transcendence",
		label: user.email,
		algorithm: "SHA1",
		digits: 6,
		period: 30,
		secret: user.totpSecret,
	});

	const { code } = request.body as any;

	if (null == totp.validate({ token: code, window: 1 }))
		return reply.send(Result.ERR_BAD_TOTP);

	return reply.send(updateAppTotp(db, user.userId));
}

export function verifyEmailTotp(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;

	const { code } = request.body as any;
	if (code != parseInt(user.totpSecret))
		return reply.send(Result.ERR_BAD_TOTP);

	return reply.send(updateEmailTotp(db, user.userId));
}

export function loginWithEmailTotp(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const { code, email } = request.body as any;
	console.log("found", code, email);

	const userBox = getUserByEmail(db, email);
	if (Result.SUCCESS != userBox.result)
		return reply.send(userBox.result);

	const user = userBox.contents;

	if (code != parseInt(user.totpSecret))
		return reply.send(Result.ERR_BAD_TOTP);

	const token = refreshToken(user.userId);
	updateRefreshtoken(db, {
		userId: user.userId, refreshToken: token
	});

	const accessTokenDate = new Date();
	accessTokenDate.setSeconds(accessTokenDate.getSeconds() + 5);
	const refreshTokenDate = new Date();
	refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);

	return reply.header(
		"Set-Cookie", `accessToken=${accessToken(user.userId)}; Path=/; expires=${accessTokenDate}; Secure; HttpOnly;`).header(
			"Set-Cookie", `refreshToken=${token}; Path=/; expires=${refreshTokenDate}; Secure; HttpOnly;`).send(Result.SUCCESS);
}

export function checkTotp(request: FastifyRequest, reply: FastifyReply) {
	const params = request.body as any;
	const userBox = loginUserdb(request.db, params);
	if (Result.SUCCESS != userBox.result)
		return reply.send(userBox);

	const user = userBox.contents;

	let totp = new OTPAuth.TOTP({
		issuer: "Transcendence",
		label: user.email,
		algorithm: "SHA1",
		digits: 6,
		period: 30,
		secret: user.totpSecret,
	});

	if (null == totp.validate({ token: params.code, window: 1 })) {
		return reply.send({
			result: Result.ERR_BAD_TOTP
		});
	}

	const accessTokenDate = new Date();
	accessTokenDate.setSeconds(accessTokenDate.getSeconds() + 5);
	const refreshTokenDate = new Date();
	refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);
	return reply.header(
		"Set-Cookie", `accessToken=${userBox.contents[0]}; Path=/; expires=${accessTokenDate}; Secure; HttpOnly;`).header(
			"Set-Cookie", `refreshToken=${userBox.contents[1]}; Path=/; expires=${refreshTokenDate}; Secure; HttpOnly;`).send({
				result: Result.SUCCESS
			});
}

export function disableTotp(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	return reply.send(updateTotp(db, user.userId));
}

