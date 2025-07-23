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

	fastify.get("/dev/users", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const avatar = readFileSync(join(__dirname, '../frontend/images/default.jpg'), { encoding: 'base64' });
			addUser(db, {
				"nick": "test",
				"password": "12345678",
				"email": "test@test.com",
				"avatar": "data:image/jpeg;base64," + avatar,
				"online": 1
			});
			addUser(db, {
				"nick": "test1",
				"password": "12345678",
				"email": "test1@test.com",
				"avatar": "data:image/jpeg;base64," + avatar,
				"online": 0
			});
			addUser(db, {
				"nick": "test2",
				"password": "12345678",
				"email": "test2@test.com",
				"avatar": "data:image/jpeg;base64," + avatar,
				"online": 0
			});
			addUser(db, {
				"nick": "test3",
				"password": "12345678",
				"email": "test3@test.com",
				"avatar": "data:image/jpeg;base64," + avatar,
				"online": 1
			});
			addUser(db, {
				"nick": "test4",
				"password": "12345678",
				"email": "test4@test.com",
				"avatar": "data:image/jpeg;base64," + avatar,
				"online": 1
			});
		}
		catch (e) {
			console.log(e);
			reply.code(500);
		}
	});

	fastify.get("/dev/matches", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			addMatch(db, {
				"p1ID": 1,
				"p2Name": "Ed",
				"p1Score": 3,
				"p2Score": 10
			});
			addMatch(db, {
				"p1ID": 1,
				"p2Name": "John",
				"p1Score": 10,
				"p2Score": 7
			});
			addMatch(db, {
				"p1ID": 2,
				"p2Name": "John",
				"p1Score": 10,
				"p2Score": 2
			});
		}
		catch (e) {
			console.log(e);
			reply.code(500);
		}
	});

	fastify.get("/dev/friends", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			addFriend(db, {
				"id": 1,
				"friendID": 3
			});
			addFriend(db, {
				"id": 1,
				"friendID": 2
			});
			addFriend(db, {
				"id": 1,
				"friendID": 7
			});
			addFriend(db, {
				"id": 2,
				"friendID": 3
			});
			addFriend(db, {
				"id": 2,
				"friendID": 1
			});
		}
		catch (e) {
			console.log(e);
			reply.code(500);
		}
	});
}
