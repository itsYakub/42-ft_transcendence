import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addHistory } from './db/historyDB.js';
import { addUser } from './db/userDB.js';
import { Result } from '../common/interfaces.js';

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
				result: Result.ERR_DB
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
				result: Result.ERR_DB
			};
		}
	});
}
