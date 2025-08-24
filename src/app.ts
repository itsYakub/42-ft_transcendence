import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "fastify-cookie";
import fastifyWebsocket from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { initFriendsDb } from "./backend/db/friendsDb.js";
import { initMatchResultsDb } from "./backend/db/matchResultsDb.js";
import { devEndpoints } from "./backend/devTools.js";
import { initTournaments } from "./backend/old/tournamentDb.js";
import { homePage } from "./backend/pages/homePage.js";
import { tournamentRoutes } from "./backend/old/tournamentRoutes.js";
import { usersPage } from "./backend/pages/usersPage.js";
import { initUserChatsDb } from "./backend/db/userChatsDb.js";
import { matchRoutes } from "./backend/old/matchRoutes.js";
import { serverSockets } from "./backend/sockets/serverSockets.js";
import { apiEndpoints } from "./backend/api/apiEndpoints.js";
import { gamePage } from "./backend/pages/gamePage.js";
import { initFoesDb } from "./backend/db/foesDb.js";
import { getUser, initUsersDb } from "./backend/db/userDB.js";
import { frameView } from "./backend/views/frameView.js";
import { accountPage } from "./backend/pages/accountPage.js";
import { loggedOutView } from "./backend/views/loggedOutView.js";
import { authEndpoints } from "./backend/api/authEndpoints.js";
import { accountEndpoints } from "./backend/api/accountEndpoints.js";
import { translateBackend } from "./common/translations.js";
import { Result, User } from "./common/interfaces.js";
import { initGameChatsDb } from "./backend/db/gameChatsDb.js";
import { foesEndpoints } from "./backend/api/foesEndpoints.js";
import { friendsEndpoints } from "./backend/api/friendsEndpoints.js";
import { userEndpoints } from "./backend/api/userEndpoints.js";
import { userChatsPage } from "./backend/pages/userChatsPage.js";
import { matchResultsEndpoints } from "./backend/api/matchResultsEndpoints.js";
import { profileEndpoints } from "./backend/api/profileEndpoints.js";

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

const mockData = {
	mockUsers: 5,
	mockMessages: {
		number: 5,
		start: 1,
		end: 6
	},
	mockMatchResults: {
		number: 10,
		start: 1,
		end: 6
	},
	mockFriends: {
		number: 3,
		id: 6
	},
	mockFoes: {
		number: 3,
		id: 6
	},
	mockUserChats: {
		number: 2,
		start: 1,
		end: 2,
		id: 6
	}

}

try {
	initFoesDb(db, mockData.mockFoes);
	initFriendsDb(db, mockData.mockFriends);
	initGameChatsDb(db);
	initMatchResultsDb(db, mockData.mockMatchResults);
	//initTournaments(db);
	initUserChatsDb(db, mockData.mockUserChats);
	initUsersDb(db, mockData.mockUsers);

	accountPage(fastify, db);
	gamePage(fastify, db);
	homePage(fastify, db);
	userChatsPage(fastify, db);
	usersPage(fastify, db);

	matchRoutes(fastify, db);
	tournamentRoutes(fastify, db);

	accountEndpoints(fastify, db);
	apiEndpoints(fastify, db);
	authEndpoints(fastify, db);
	foesEndpoints(fastify, db);
	friendsEndpoints(fastify, db);
	matchResultsEndpoints(fastify, db);
	profileEndpoints(fastify, db);
	userEndpoints(fastify, db);

	serverSockets(fastify, db);

	// Remove!
	devEndpoints(fastify, db);

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
