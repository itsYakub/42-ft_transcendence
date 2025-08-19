import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "fastify-cookie";
import fastifyWebsocket from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { userEndpoints } from "./backend/user/userEndpoints.js";
import { googleAuth } from "./backend/user/googleAuth.js";
import { initFriends } from "./backend/pages/friends/friendsDB.js";
import { initHistory } from "./backend/pages/history/historyDB.js";
import { devEndpoints } from "./backend/devTools.js";
import { initTournaments } from "./backend/pages/tournament/tournamentDB.js";
import { historyRoutes } from "./backend/pages/history/historyRoutes.js";
import { friendsRoutes } from "./backend/pages/friends/friendsRoutes.js";
import { homeRoutes } from "./backend/pages/home/homeRoutes.js";
import { tournamentRoutes } from "./backend/pages/tournament/tournamentRoutes.js";
import { profileRoutes } from "./backend/pages/profile/profileRoutes.js";
import { messageRoutes } from "./backend/pages/messages/messagesRoutes.js";
import { initPrivateMessages } from "./backend/pages/messages/messagesDB.js";
import { matchRoutes } from "./backend/pages/match/matchRoutes.js";
import { serverSockets } from "./backend/sockets/serverSockets.js";
import { apiRoutes } from "./backend/api/apiRoutes.js";
import { initGameMessages } from "./backend/pages/game/gameDB.js";
import { gameRoutes } from "./backend/pages/game/gameRoutes.js";
import { getUser, initUsers } from "./backend/user/userDB.js";
import { frameHtml } from "./backend/frame/frameHtml.js";

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
	Handles all incorrect URLs
*/
fastify.setNotFoundHandler(async (request: FastifyRequest, reply: FastifyReply) => {
	const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
	const params = {
		user: user.user,
		errorCode: 404,
		errorMessage: "ERR_NOT_FOUND",
		language: request.cookies.language ?? "english"
	};

	const frame = frameHtml(params);
	return reply.type("text/html").send(frame);
});

// Turn these on to wipe and re-create specific tables on startup
const dropTables = {
	dropUsers: false,
	dropFriends: false,
	dropHistory: false,
	dropTournaments: false,
	dropChats: false,
	dropPrivateMessages: false,
	dropRoomMessages: false
};

const db = new DatabaseSync("../data/transcendence.db");

try {
	initUsers(db, dropTables.dropUsers);
	//initFriends(db, dropTables.dropFriends);
	//initHistory(db, dropTables.dropHistory);
	//initTournaments(db, dropTables.dropTournaments);
	//initChats(db, dropTables.dropChats);
	initPrivateMessages(db, dropTables.dropPrivateMessages);
	initGameMessages(db, dropTables.dropRoomMessages);

	apiRoutes(fastify, db);
	homeRoutes(fastify, db);
	gameRoutes(fastify, db);
	matchRoutes(fastify, db);
	tournamentRoutes(fastify, db);
	profileRoutes(fastify, db);
	historyRoutes(fastify, db);
	friendsRoutes(fastify, db);
	messageRoutes(fastify, db);

	googleAuth(fastify, db);
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
