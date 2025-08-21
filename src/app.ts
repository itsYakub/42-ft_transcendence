import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "fastify-cookie";
import fastifyWebsocket from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { userEndpoints } from "./backend/api/userEndpoints.js";
import { initFriends } from "./backend/db/friendsDB.js";
import { initHistory } from "./backend/db/historyDB.js";
import { devEndpoints } from "./backend/devTools.js";
import { initTournaments } from "./backend/db/tournamentDB.js";
import { historyRoutes } from "./backend/routes/historyRoutes.js";
import { friendsRoutes } from "./backend/routes/friendsRoutes.js";
import { homeRoutes } from "./backend/routes/homeRoutes.js";
import { tournamentRoutes } from "./backend/routes/tournamentRoutes.js";
import { usersRoutes } from "./backend/routes/usersRoutes.js";
import { initPrivateMessages } from "./backend/db/messagesDB.js";
import { matchRoutes } from "./backend/routes/matchRoutes.js";
import { serverSockets } from "./backend/sockets/serverSockets.js";
import { apiRoutes } from "./backend/api/apiRoutes.js";
import { initGameMessages } from "./backend/db/gameDB.js";
import { gameRoutes } from "./backend/routes/gameRoutes.js";
import { initFoes } from "./backend/db/foesDB.js";
import { foesRoutes } from "./backend/routes/foesRoutes.js";
import { getUser, initUsers } from "./backend/db/userDB.js";
import { frameView } from "./backend/views/frameView.js";
import { accountRoutes } from "./backend/routes/accountRoutes.js";
import { loggedOutView } from "./backend/views/loggedOutView.js";
import { authEndpoints } from "./backend/api/authEndpoints.js";
import { accountEndpoints } from "./backend/api/accountEndpoints.js";
import { translateBackend } from "./common/translations.js";
import { User } from "./common/interfaces.js";

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
	// 	// if (request.url.includes(".") || request.url.startsWith("/auth/google"))
	// 	// 	return done();

	const userBox = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
	request.isPage = ["/", "/game", "/account", "/history", "/users", "/friends", "/foes", "/profile"].includes(request.url);
	const language = request.cookies.language ?? "english";
	//request.user = userBox.user;
	// console.log("hook");
	// 	// if ("ERR_DB" == userBox.result) {
	// 	// 	if (request.isPage) {
	// 	// 		const params = {
	// 	// 			page: request.url,
	// 	// 			language,
	// 	// 			result: userBox.result
	// 	// 		};
	// 	// 		return reply.type("text/html").send(frameView(params));
	// 	// 	}
	// 	// 	else
	// 	// 		return reply.send({
	// 	// 			result: userBox.code
	// 	// 		});
	// 	// }

	// 	// if ("ERR_NO_USER" == userBox.result) {
	// 	// 	if (request.isPage)
	// 	// 		return reply.type("text/html").send(frameView({ language }, loggedOutView()));
	// 	// 	else if (request.url.startsWith("/api/"))
	// 	// 		return reply.send({
	// 	// 			result: translateBackend({
	// 	// 				language,
	// 	// 				html: "%%ERR_FORBIDDEN%%"
	// 	// 			})
	// 	// 		});
	// 	// 	else
	// 	// 		return done();
	// 	// }

	request.user = userBox.user;
	request.language = language;
	done();
});

/*
	Handles all incorrect URLs
*/
// fastify.setNotFoundHandler(async (request: FastifyRequest, reply: FastifyReply) => {
// 	const params = {
// 		user: request.user,
// 		result: "ERR_NOT_FOUND",
// 		language: request.cookies.language ?? "english"
// 	};

// 	const frame = frameView(params);
// 	return reply.type("text/html").send(frame);
// });

const db = new DatabaseSync("../data/transcendence.db");

try {
	initUsers(db);
	initFoes(db);
	initFriends(db);
	//initHistory(db);
	//initTournaments(db);
	initPrivateMessages(db);
	initGameMessages(db);

	apiRoutes(fastify, db);
	homeRoutes(fastify, db);
	gameRoutes(fastify, db);
	accountRoutes(fastify, db);
	historyRoutes(fastify, db);
	usersRoutes(fastify, db);
	friendsRoutes(fastify, db);
	foesRoutes(fastify, db);

	matchRoutes(fastify, db);
	tournamentRoutes(fastify, db);

	authEndpoints(fastify, db);
	accountEndpoints(fastify, db);
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
