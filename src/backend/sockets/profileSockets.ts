import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { markUserOnline } from '../user/userDB.js';
import { addPrivateMessage } from '../pages/users/messagesDB.js';
import { broadcastMessageToClients } from './serverSockets.js';

export function handleProfileMessage(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	switch (message.type) {
		case "profile-online-changed":
			profileOnlineChanged(fastify, db, user, message);
			break;
	}
}

function profileOnlineChanged(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	
}
