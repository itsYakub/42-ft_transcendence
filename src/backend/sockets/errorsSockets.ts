import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { broadcastMessageToClients } from './serverSockets.js';

export function handleIncomingErrorMessage(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	switch (message.type) {
		case "error-not-online":
			notOnlineError(fastify, db, user, message);
			break;
	}
}

function notOnlineError(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {

}
