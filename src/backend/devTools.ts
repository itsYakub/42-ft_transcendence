import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addUser } from "./user/userDB.js";
import { addFriend } from './pages/friends/friendsDB.js';
import { addHistory } from './pages/history/historyDB.js';
import { addPrivateMessage } from './pages/users/messagesDB.js';

export function devEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {
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

	fastify.get("/dev/add/history", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			addHistory(db, {
				id: 1,
				p2Name: "Ed",
				score: 5,
				p2Score: 10,
				tournamentWin: false
			});
			addHistory(db, {
				id: 1,
				p2Name: "Frank",
				score: 10,
				p2Score: 5,
				tournamentWin: false
			});
			addHistory(db, {
				id: 1,
				p2Name: "Ed",
				score: 7,
				p2Score: 10,
				tournamentWin: false
			});
			addHistory(db, {
				id: 1,
				p2Name: "John",
				score: 10,
				p2Score: 9,
				tournamentWin: true
			});
			addHistory(db, {
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
			addPrivateMessage(db, {
				toID: 1,
				fromID: 2,
				message: "Hello"
			});
			addPrivateMessage(db, {
				toID: 2,
				fromID: 1,
				message: "Hello back"
			});
			addPrivateMessage(db, {
				toID: 1,
				fromID: 3,
				message: "I'm John."
			});
			addPrivateMessage(db, {
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
