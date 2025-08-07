import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addUser, initUsers } from "./pages/user/userDB.js";
import { addFriend, initFriends } from './pages/friends/friendsDB.js';
import { addMatch, initMatches } from './pages/matches/matchesDB.js';
import { initTournaments } from './pages/tournament/tournamentDB.js';
import { addMessage, initMessages } from './pages/messages/messagesDB.js';

const __dirname = import.meta.dirname;

export function devEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get("/dev/wipe", async (request: FastifyRequest, reply: FastifyReply) => {
		const dropTables = {
			dropUsers: true,
			dropFriends: true,
			dropMatches: true,
			dropTournaments: true,
			dropMessages: true,
			dropChats: true
		};
		initUsers(db, dropTables.dropUsers);
		initFriends(db, dropTables.dropFriends);
		initMatches(db, dropTables.dropMatches);
		initTournaments(db, dropTables.dropTournaments);
		initMessages(db, dropTables.dropMessages);
		return reply.redirect("/user/logout");
	});

	fastify.get("/dev/wipe/users", async (request: FastifyRequest, reply: FastifyReply) => {
		initUsers(db, true);
		return reply.redirect("/user/logout");
	});

	fastify.get("/dev/wipe/matches", async (request: FastifyRequest, reply: FastifyReply) => {
		initMatches(db, true);
	});

	fastify.get("/dev/wipe/friends", async (request: FastifyRequest, reply: FastifyReply) => {
		initFriends(db, true);
	});

	fastify.get("/dev/wipe/tournaments", async (request: FastifyRequest, reply: FastifyReply) => {
		initTournaments(db, true);
	});

	fastify.get("/dev/wipe/messages", async (request: FastifyRequest, reply: FastifyReply) => {
		initMessages(db, true);
	});

	fastify.get("/dev/add/users", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			addUser(db, {
				password: "12345678",
				email: "test1@test.com"
			});
			addUser(db, {
				password: "12345678",
				email: "test2@test.com"
			});
			addUser(db, {
				password: "12345678",
				email: "test3@test.com"
			});
			addUser(db, {
				password: "12345678",
				email: "test4@test.com"
			});
			addUser(db, {
				password: "12345678",
				email: "test5@test.com"
			});
		}
		catch (e) {
			return {
				code: 500,
				error: "ERR_DB"
			};
		}
	});

	fastify.get("/dev/add/matches", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			addMatch(db, {
				id: 1,
				p2Name: "Ed",
				score: 5,
				p2Score: 10,
				tournamentWin: false
			});
			addMatch(db, {
				id: 1,
				p2Name: "Frank",
				score: 10,
				p2Score: 5,
				tournamentWin: false
			});
			addMatch(db, {
				id: 1,
				p2Name: "Ed",
				score: 7,
				p2Score: 10,
				tournamentWin: false
			});
			addMatch(db, {
				id: 1,
				p2Name: "John",
				score: 10,
				p2Score: 9,
				tournamentWin: true
			});
			addMatch(db, {
				id: 2,
				p2Name: "Ed",
				score: 5,
				p2Score: 10,
				tournamentWin: true
			});
		}
		catch (e) {
			return {
				code: 500,
				error: "ERR_DB"
			};
		}
	});

	fastify.get("/dev/add/friends", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			addFriend(db, {
				id: 1,
				friendID: 3
			});
			addFriend(db, {
				id: 1,
				friendID: 2
			});
			addFriend(db, {
				id: 1,
				friendID: 7
			});
			addFriend(db, {
				id: 2,
				friendID: 3
			});
			addFriend(db, {
				id: 2,
				friendID: 1
			});
		}
		catch (e) {
			return {
				code: 500,
				error: "ERR_DB"
			};
		}
	});

	fastify.get("/dev/add/messages", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			addMessage(db, {
				toID: 1,
				fromID: 2,
				message: "Hello"
			});
			addMessage(db, {
				toID: 2,
				fromID: 1,
				message: "Hello back"
			});
			addMessage(db, {
				toID: 1,
				fromID: 3,
				message: "I'm John."
			});
			addMessage(db, {
				toID: 3,
				fromID: 1,
				message: "Pleased to meet you!"
			});
		}
		catch (e) {
			return {
				code: 500,
				error: "ERR_DB"
			};
		}
	});
}
