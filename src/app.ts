import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "fastify-cookie";
import fastifyWebsocket from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { userEndpoints } from "./backend/api/userEndpoints.js";
import { initFriendsDb } from "./backend/db/friendsDb.js";
import { initHistoryDb } from "./backend/db/historyDB.js";
import { devEndpoints } from "./backend/devTools.js";
import { initTournaments } from "./backend/db/tournamentDb.js";
import { historyRoutes } from "./backend/routes/historyRoutes.js";
import { friendsRoutes } from "./backend/routes/friendsRoutes.js";
import { homeRoutes } from "./backend/routes/homeRoutes.js";
import { tournamentRoutes } from "./backend/routes/tournamentRoutes.js";
import { usersRoutes } from "./backend/routes/usersRoutes.js";
import { initUserChatsDb } from "./backend/db/userChatsDb.js";
import { matchRoutes } from "./backend/routes/matchRoutes.js";
import { serverSockets } from "./backend/sockets/serverSockets.js";
import { apiRoutes } from "./backend/api/apiRoutes.js";
import { gameRoutes } from "./backend/routes/gameRoutes.js";
import { initFoesDb } from "./backend/db/foesDb.js";
import { foesRoutes } from "./backend/routes/foesRoutes.js";
import { getUser, initUsersDb } from "./backend/db/userDB.js";
import { frameView } from "./backend/views/frameView.js";
import { accountRoutes } from "./backend/routes/accountRoutes.js";
import { loggedOutView } from "./backend/views/loggedOutView.js";
import { authEndpoints } from "./backend/api/authEndpoints.js";
import { accountEndpoints } from "./backend/api/accountEndpoints.js";
import { translateBackend } from "./common/translations.js";
import { Result, User } from "./common/interfaces.js";
import { initGameChatsDb } from "./backend/db/gameChatsDb.js";
import { foesEndpoints } from "./backend/api/foesEndpoints.js";
import { friendsEndpoints } from "./backend/api/friendsEndpoints.js";

const __dirname = import.meta.dirname;

const fastify = Fastify({
	ignoreTrailingSlash: true,
	trustProxy: true
});

/*
	Allows the request to access the browser cookies
*/
await fastify.register(fastifyCookie);

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

	// 	// if (request.url.includes(".") || request.url.startsWith("/auth/google"))
	// 	// 	return done();

	const userBox = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
	request.isPage = ["/", "/game", "/account", "/history", "/users", "/friends", "/foes", "/profile"].includes(request.url);
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
				result: translateBackend(language, "%%ERR_FORBIDDEN%%")
			});
	}

	request.user = userBox.user;
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
	initFoesDb(db);
	initFriendsDb(db);
	initGameChatsDb(db);
	initHistoryDb(db);
	//initTournaments(db);
	initUserChatsDb(db);
	initUsersDb(db);

	accountRoutes(fastify, db);
	apiRoutes(fastify, db);
	friendsRoutes(fastify, db);
	foesRoutes(fastify, db);
	gameRoutes(fastify, db);
	historyRoutes(fastify, db);
	homeRoutes(fastify, db);
	usersRoutes(fastify, db);

	matchRoutes(fastify, db);
	tournamentRoutes(fastify, db);

	accountEndpoints(fastify, db);
	authEndpoints(fastify, db);
	foesEndpoints(fastify, db);
	friendsEndpoints(fastify, db);
	userEndpoints(fastify, db);

	serverSockets(fastify, db);

	// Remove!
	devEndpoints(fastify, db);

	// Start listening
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
