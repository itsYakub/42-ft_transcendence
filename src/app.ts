import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "fastify-cookie";
import fastifyWebsocket from "@fastify/websocket";
import { userEndpoints } from "./backend/user/userEndpoints.js";
import { readFileSync } from "fs";
import { join } from "path";
import { DatabaseSync } from "node:sqlite";
import { googleAuth } from "./backend/user/googleAuth.js";
import { getUser, initUsers } from "./backend/user/userDB.js";
import { initFriends } from "./backend/pages/friends/friendDB.js";
import { initMatches } from "./backend/pages/matches/matchDB.js";
import { devEndpoints } from "./backend/devTools.js";
import { initTournaments } from "./backend/pages/play/tournamentDB.js";
import { frameHtml } from "./backend/pages/frameHtml.js";
import { matchRoutes } from "./backend/pages/matches/matchRoutes.js";
import { friendRoutes } from "./backend/pages/friends/friendRoutes.js";
import { homeRoutes } from "./backend/pages/home/homeRoutes.js";
import { tournamentRoutes } from "./backend/pages/play/tournamentRoutes.js";
import { profileRoutes } from "./backend/pages/profile/profileRoutes.js";
import { playRoutes } from "./backend/pages/play/playRoutes.js";
import { initChats } from "./backend/pages/chat/chatDB.js";
import { chatRoutes } from "./backend/pages/chat/chatRoutes.js";

const __dirname = import.meta.dirname;

const fastify = Fastify({
	ignoreTrailingSlash: true,
	https: {
		key: readFileSync(join(__dirname, 'transcendence.key')),
		cert: readFileSync(join(__dirname, 'transcendence.crt'))
	}
});

/*
	Allows the request to access the browser cookies
*/
await fastify.register(fastifyCookie);

/*
	Allows websocket connections (chat, remote players)
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
	Handles all incorrect URLs
*/
fastify.setNotFoundHandler(async (request: FastifyRequest, reply: FastifyReply) => {
	const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
	const params = {
		user,
		errorCode: 404,
		errorMessage: "ERR_NOT_FOUND",
		page: "home",
		language: request.cookies.language ?? "english"
	};

	const frame = frameHtml(params);
	return reply.type("text/html").send(frame);
});

// Turn these on to wipe and re-create specific tables on startup
const dropTables = {
	dropUsers: false,
	dropFriends: false,
	dropMatches: false,
	dropTournaments: false,
	dropChats: false
};

const db = new DatabaseSync(process.env.DB);

try {
	initUsers(db, dropTables.dropUsers);
	initFriends(db, dropTables.dropFriends);
	initMatches(db, dropTables.dropMatches);
	initTournaments(db, dropTables.dropTournaments);
	initChats(db, dropTables.dropChats);

	homeRoutes(fastify, db);
	playRoutes(fastify, db);
	tournamentRoutes(fastify, db);
	profileRoutes(fastify, db);
	matchRoutes(fastify, db);
	friendRoutes(fastify, db);
	chatRoutes(fastify, db);

	googleAuth(fastify, db);
	userEndpoints(fastify, db);

	// Remove!
	devEndpoints(fastify, db);

	// Start listening
	fastify.listen({ host: "0.0.0.0", port: parseInt(process.env.PORT ?? "3000") }, (err, address) => {
		if (err) {
			console.log(err);
			process.exit(1);
		}
	});
}
catch (e) {
	console.log("Fatal error - exiting!");
}

