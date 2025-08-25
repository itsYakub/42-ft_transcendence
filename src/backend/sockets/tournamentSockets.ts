import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { broadcastMessageToClients } from './serverSockets.js';
import { joinGame, leaveGame, } from '../db/gameDb.js';
import { Result, User, WebsocketMessage, WebsocketMessageType } from '../../common/interfaces.js';
import { addGameChat } from '../db/gameChatsDb.js';

export function handleIncomingTournamentMessage(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketMessage) {
	switch (message.type) {
		case WebsocketMessageType.READY:
			//gameJoinReceived(fastify, db, user, message);
			break;
	}
}
