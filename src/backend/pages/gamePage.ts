import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameView } from '../views/frameView.js';
import { getGames, gamePlayers } from '../db/gameDb.js';
import { lobbyView } from '../views/lobbyView.js';
import { gameView } from '../views/gameView.js';
import { FrameParams, Result } from '../../common/interfaces.js';
import { gameChatsList } from '../db/gameChatsDb.js';
import { getTournament } from '../db/tournamentDb.js';
import { tournamentDetails, tournamentLobbyView } from '../views/tournamentView.js';

export function gamePage(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/game', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;

		const params: FrameParams = {
			page: request.url,
			language,
			user
		};

		// user is already in a game
		if (user.gameId) {
			const gameId = user.gameId;

			const tournamentBox = getTournament(db, gameId);
			if (Result.SUCCESS == tournamentBox.result) {
				const chatsBox = gameChatsList(db, gameId);
				if (Result.SUCCESS != chatsBox.result) {
					params.result = chatsBox.result;
					return reply.type("text/html").send(frameView(params));
				}
				const frame = frameView(params, tournamentLobbyView(tournamentBox.contents, chatsBox.contents, user));
				return reply.type("text/html").send(frame);
			}

			const gamersBox = gamePlayers(db, gameId);
			if (Result.SUCCESS != gamersBox.result) {
				params.result = gamersBox.result;
				return reply.type("text/html").send(frameView(params));
			}

			const chatsBox = gameChatsList(db, gameId);
			if (Result.SUCCESS != chatsBox.result) {
				params.result = chatsBox.result;
				return reply.type("text/html").send(frameView(params));
			}

			const frame = frameView(params, lobbyView(gamersBox.contents, chatsBox.contents, user));
			return reply.type("text/html").send(frame);
		}

		const gamesBox = getGames(db);
		if (Result.SUCCESS != gamesBox.result) {
			params.result = gamesBox.result;
			return reply.type("text/html").send(frameView(params));
		}

		const frame = frameView(params, gameView(gamesBox.contents, user));
		return reply.type("text/html").send(frame);
	});
}
