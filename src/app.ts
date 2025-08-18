import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "fastify-cookie";
import fastifyWebsocket from "@fastify/websocket";
import { userEndpoints } from "./backend/pages/user/userEndpoints.js";
import { DatabaseSync } from "node:sqlite";
import { googleAuth } from "./backend/auth/googleAuth.js";
import { getUser, initUsers } from "./backend/pages/user/userDB.js";
import { initFriends } from "./backend/pages/friends/friendsDB.js";
import { initHistory } from "./backend/pages/history/historyDB.js";
import { devEndpoints } from "./backend/devTools.js";
import { initTournaments } from "./backend/pages/tournament/tournamentDB.js";
import { frameHtml } from "./backend/pages/frameHtml.js";
import { historyRoutes } from "./backend/pages/history/historyRoutes.js";
import { friendsRoutes } from "./backend/pages/friends/friendsRoutes.js";
import { homeRoutes } from "./backend/pages/home/homeRoutes.js";
import { tournamentRoutes } from "./backend/pages/tournament/tournamentRoutes.js";
import { profileRoutes } from "./backend/pages/profile/profileRoutes.js";
import { playRoutes } from "./backend/pages/play/playRoutes.js";
import { initChats } from "./backend/pages/chat/chatDB.js";
import { chatRoutes } from "./backend/pages/chat/chatRoutes.js";
import { userRoutes } from "./backend/pages/user/userRoutes.js";
import { messageRoutes } from "./backend/pages/messages/messagesRoutes.js";
import { initMessages } from "./backend/pages/messages/messagesDB.js";
import { matchRoutes } from "./backend/pages/match/matchRoutes.js";
import { socketRoutes } from "./backend/pages/socketRoutes.js";

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
	dropMessages: false
};

const db = new DatabaseSync(process.env.DB);

try {
	initUsers(db, dropTables.dropUsers);
	initFriends(db, dropTables.dropFriends);
	initHistory(db, dropTables.dropHistory);
	initTournaments(db, dropTables.dropTournaments);
	initChats(db, dropTables.dropChats);
	initMessages(db, dropTables.dropMessages);

	homeRoutes(fastify, db);
	userRoutes(fastify, db);
	playRoutes(fastify, db);
	matchRoutes(fastify, db);
	tournamentRoutes(fastify, db);
	profileRoutes(fastify, db);
	historyRoutes(fastify, db);
	friendsRoutes(fastify, db);
	messageRoutes(fastify, db);
	chatRoutes(fastify, db);

	googleAuth(fastify, db);
	userEndpoints(fastify, db);
	socketRoutes(fastify, db);

	// Remove!
	devEndpoints(fastify, db);

	const port = parseInt(process.env.PORT ?? "3000");

	// Start listening
	fastify.listen({
		host: "0.0.0.0",
		port: port
	}, (err, address) => {
		if (err) {
			console.log(err);
			process.exit(1);
		}
		console.log(`Listening on https://transcendence.nip.io:${port}`);
	});
}
catch (e) {
	console.log("Fatal error - exiting!");
}
