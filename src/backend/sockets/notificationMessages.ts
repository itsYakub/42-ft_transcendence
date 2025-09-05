import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addUserChat } from '../db/userChatsDb.js';
import { broadcastMessageToClients } from './serverSocket.js';
import { markUserOnline } from '../db/userDB.js';
import { Message, MessageType, Result, User } from '../../common/interfaces.js';
import { gamePlayers } from '../db/gameDb.js';
import { generateTournament } from './tournamentMessages.js';
import { gamersHtml } from '../views/remoteMatchLobbyView.js';
import { translate } from '../../common/translations.js';
import { getMatch, markMatchGamerReady } from '../db/matchesDb.js';
import { addInviteNotification } from '../db/notificationsDb.js';

export function notificationInviteReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	message.fromId = user.userId;
	const result = addInviteNotification(db, message);

	if (Result.SUCCESS == result)
		broadcastMessageToClients(fastify, message);
}
