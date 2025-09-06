import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyStatic from "@fastify/static";
import cookie from '@fastify/cookie'
import fastifyWebsocket from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { getUser } from "./backend/db/userDB.js";
import { loggedOutView } from "./backend/views/loggedOutView.js";
import { translate } from "./common/translations.js";
import { Result, User, UserType } from "./common/interfaces.js";
import { frameView } from "./backend/views/frameView.js";
import { registerEndpoints } from "./backend/endpoints.js";
import { initDbTables } from "./backend/db/initDbTables.js";

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
		isPage: boolean,
		user: User,
		language: string
	}
}

/*
	Checks for a logged in user before every request, adding it if found
*/
fastify.addHook('preHandler', (request: FastifyRequest, reply: FastifyReply, done) => {
	const publicApiEndpoints = [
		"/api/guest/register",
		"/api/user/login",
		"/api/user/register"
	];

	const userBox = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
	request.isPage = ["/", "/game", "/account", "/users", "/chat"].includes(request.url);
	const language = request.cookies.language ?? "english";

	if (Result.ERR_DB == userBox.result) {
		if (request.isPage) {
			const params = {
				page: request.url,
				language,
				result: userBox.result
			};
			return reply.type("text/html").send(frameView(params));
		}
		else
			return reply.send({
				result: userBox.result
			});
	}

	if (Result.ERR_NO_USER == userBox.result) {
		if (request.isPage)
			return reply.type("text/html").send(frameView({ language }, loggedOutView()));
		else if (request.url.startsWith("/api/") && !publicApiEndpoints.includes(request.url))
			return reply.send({
				result: translate(language, "%%ERR_FORBIDDEN%%")
			});
	}

	if (UserType.GUEST == userBox.contents?.userType && request.isPage && "/" != request.url) {
		const params = {
			page: request.url,
			language,
			result: Result.ERR_NOT_FOUND
		};
		return reply.type("text/html").send(frameView(params));
	}

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
