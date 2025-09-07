import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyStatic from "@fastify/static";
import cookie from '@fastify/cookie'
import fastifyWebsocket from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { getUser } from "./db/userDB.js";
import { loggedOutView } from "./backend/views/authView.js";
import { translate } from "./common/translations.js";
import { Page, Result, User, UserType } from "./common/interfaces.js";
import { frameView } from "./backend/views/frameView.js";
import { registerEndpoints } from "./backend/endpoints.js";
import { initDbTables } from "./db/initDbTables.js";

const __dirname = import.meta.dirname;

const fastify = Fastify({
	routerOptions: {
		ignoreTrailingSlash: true
	},
	trustProxy: true
});

/*
	Allows the request to access the browser cookies
*/
await fastify.register(cookie);

/*
	Allows websocket connections (chat, remote gamers)
*/
await fastify.register(fastifyWebsocket);

/*
	Allows all the static files (css, js, etc.) to be served automatically
*/
await fastify.register(fastifyStatic, {
	root: __dirname + "/frontend",
	prefix: "/",
	index: false,
});

/*
	Makes user and language visible on every request
*/
declare module 'fastify' {
	interface FastifyRequest {
		db: DatabaseSync
		user: User,
		language: string
	}
}

/*
	Checks for a logged in user before every request, adding it if found
*/
fastify.addHook('preHandler', (request: FastifyRequest, reply: FastifyReply, done) => {
	// ignore static files
	if (request.url.includes("."))
		return done();

	const publicApiEndpoints = [
		"/auth/guest",
		"/auth/login",
		"/auth/register",
		"/totp/app/login",
		"/totp/email/login"
	];

	const userBox = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
	const isPage = "/"== request.url;
	const language = request.cookies.language ?? "english";

	if (Result.ERR_DB == userBox.result) {
		if (isPage) {
			const params = {
				language,
				result: userBox.result
			};
			return reply.type("text/html").send(frameView(params));
		}
		else
			return reply.send({ result: userBox.result });
	}

	if (Result.ERR_NO_USER == userBox.result) {
		if (isPage)
			return reply.type("text/html").send(frameView({ language }, loggedOutView()));
		else if (!publicApiEndpoints.includes(request.url))
			return reply.send({
				result: translate(language, "%%ERR_FORBIDDEN%%")
			});
	}

	// if (UserType.GUEST == userBox.contents?.userType && request.isPage && "/" != request.url) {
	// 	const params = {
	// 		page: request.url,
	// 		language,
	// 		result: Result.ERR_NOT_FOUND
	// 	};
	// 	return reply.type("text/html").send(frameView(params));
	// }

	request.db = db;
	request.user = userBox.contents;
	request.language = language;
	done();
});

/*
	Handles all incorrect URLs
*/
fastify.setNotFoundHandler(async (request: FastifyRequest, reply: FastifyReply) => {
	const params = {
		user: request.user,
		result: Result.ERR_NOT_FOUND,
		language: request.cookies.language ?? "english"
	};

	const frame = frameView(params);
	return reply.type("text/html").send(frame);
});

const db = new DatabaseSync("../data/transcendence.db");

try {
	initDbTables(db);
	registerEndpoints(fastify);

	fastify.listen({
		host: "0.0.0.0",
		port: 3000
	}, (err, address) => {
		if (err) {
			console.log(err);
			process.exit(1);
		}
		console.log(`Listening on https://transcendence.nip.io:3000`);
	});
}
catch (e) {
	console.log("Fatal error - exiting!");
}
