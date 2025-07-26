import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addUser, initUsers } from "./user/userDB.js";
import { readFileSync } from "fs";
import { join } from "path";
import { addFriend, initFriends } from './pages/friends/friendsDB.js';
import { addMatch, initMatches } from './pages/matches/matchesDB.js';

const __dirname = import.meta.dirname;

export function devEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get("/dev/wipe", async (request: FastifyRequest, reply: FastifyReply) => {
		const dropTables = {
			dropUsers: true,
			dropFriends: true,
			dropMatches: true
		};
		initUsers(db, dropTables.dropUsers);
		initFriends(db, dropTables.dropFriends);
		initMatches(db, dropTables.dropMatches);
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

	fastify.get("/dev/add/users", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const avatar = readFileSync(join(__dirname, '../frontend/images/default.jpg'), { encoding: 'base64' });
			addUser(db, {
				nick: "test1",
				password: "12345678",
				email: "test1@test.com",
				avatar: "data:image/jpeg;base64," + avatar,
				online: 1
			});
			addUser(db, {
				nick: "test2",
				password: "12345678",
				email: "test2@test.com",
				avatar: "data:image/jpeg;base64," + avatar,
				online: 0
			});
			addUser(db, {
				nick: "test3",
				password: "12345678",
				email: "test3@test.com",
				avatar: "data:image/jpeg;base64," + avatar,
				online: 1
			});
			addUser(db, {
				nick: "test4",
				password: "12345678",
				email: "test4@test.com",
				avatar: "data:image/jpeg;base64," + avatar,
				online: 1
			});
			addUser(db, {
				nick: "test5",
				password: "12345678",
				email: "test5@test.com",
				avatar: "data:image/jpeg;base64," + avatar,
				online: 0
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
				message: "Lost 10-3 to Ed",
				rating: 0
			});
			addMatch(db, {
				id: 1,
				message: "Beat John 10-0",
				rating: 2
			});
			addMatch(db, {
				id: 1,
				message: "Won a tournament!",
				rating: 3
			});
			addMatch(db, {
				id: 1,
				message: "Came last in a tournament!",
				rating: 0
			});
			addMatch(db, {
				id: 2,
				message: "Won a tournament!",
				rating: 3
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
}
