import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addMatchResult } from './db/matchResultsDb.js';
import { Result } from '../common/interfaces.js';

export function devEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get("/dev/add/history", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			addMatchResult(db, 1, "Ed", 5, 10, false);
			addMatchResult(db, 1, "Frank", 10, 5, false);
			addMatchResult(db, 1, "John", 10, 9, true);
			addMatchResult(db, 1, "Ed", 5, 10, true);
			addMatchResult(db, 1, "Ed", 5, 10, false);
			addMatchResult(db, 1, "Frank", 10, 5, false);
			addMatchResult(db, 1, "John", 10, 9, true);
			addMatchResult(db, 1, "Ed", 5, 10, true);
			addMatchResult(db, 1, "Ed", 5, 10, false);
			addMatchResult(db, 1, "Frank", 10, 5, false);
			addMatchResult(db, 1, "John", 10, 9, true);
			addMatchResult(db, 1, "Ed", 5, 10, true);
			return Result.SUCCESS;
		}
		catch (e) {
			return Result.ERR_DB;
		}
	});
}
