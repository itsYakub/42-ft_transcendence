import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addUserChat } from '../db/userChatsDb.js';
import { Message, MessageType, Result, ShortUser, User } from '../../common/interfaces.js';
import { gamePlayers } from '../db/gameDb.js';
import { generateTournament } from './tournamentMessages.js';
import { gamersHtml } from '../views/remoteMatchLobbyView.js';
import { translate } from '../../common/translations.js';
import { getMatch, markMatchGamerReady } from '../db/matchesDb.js';
import { addInviteNotification } from '../db/notificationsDb.js';

export function notificationInviteReceived(db: DatabaseSync, user: ShortUser, message: Message) {
	message.fromId = user.userId;
	const result = addInviteNotification(db, message);

	// if (Result.SUCCESS == result)
	// 	broadcastMessageToClients(message);
}
