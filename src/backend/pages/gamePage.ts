import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameView } from '../views/frameView.js';
import { getGames, gamePlayers } from '../db/gameDb.js';
import { matchLobbyView } from '../views/matchLobbyView.js';
import { gameView } from '../views/gameView.js';
import { FrameParams, LocalTournament, Result, Tournament } from '../../common/interfaces.js';
import { gameChatsList } from '../db/gameChatsDb.js';
import { getTournament } from '../db/tournamentsDb.js';
import { tournamentView } from '../views/tournamentView.js';
import { tournamentLobbyView } from '../views/tournamentLobbyView.js';
import { localTournamentView } from '../views/localTournamentView.js';
import { getLocalTournament } from '../db/localTournamentsDb.js';
import { removeUserFromMatch } from '../db/userDB.js';

export function gamePage(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/game', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;

		// user is already in a game
		if (user.gameId) {
			const gameId = user.gameId;

			const tournamentBox = getTournament(db, gameId);
			if (Result.SUCCESS == tournamentBox.result)
				return (remoteTournament(db, tournamentBox.contents, request, reply));

			const localTournamentBox = getLocalTournament(db, gameId);
			if (Result.SUCCESS == localTournamentBox.result)
				return localTournament(db, localTournamentBox.contents, request, reply);

			return lobby(db, request, reply);
		}

		const gamesBox = getGames(db);

		const params: FrameParams = {
			page: request.url,
			language,
			user
		};

		if (Result.SUCCESS != gamesBox.result) {
			params.result = gamesBox.result;
			return reply.type("text/html").send(frameView(params));
		}

		const frame = frameView(params, gameView(gamesBox.contents, user));
		return reply.type("text/html").send(frame);
	});
}

function localTournament(db: DatabaseSync, tournament: LocalTournament, request: FastifyRequest, reply: FastifyReply): FastifyReply {
	const user = request.user;
	const language = request.language;

	const params: FrameParams = {
		page: request.url,
		language,
		user
	};

	if (tournament.finished) {
		const result = removeUserFromMatch(db, user.userId);
		if (Result.SUCCESS != result)
			return reply.type("text/html").send(frameView(params));
	}

	return reply.type("text/html").send(frameView(params, localTournamentView(tournament, user)));
}

function lobby(db: DatabaseSync, request: FastifyRequest, reply: FastifyReply): FastifyReply {
	const user = request.user;
	const language = request.language;

	const params: FrameParams = {
		page: request.url,
		language,
		user
	};

	const gamersBox = gamePlayers(db, user.gameId);
	if (Result.SUCCESS != gamersBox.result) {
		params.result = gamersBox.result;
		return reply.type("text/html").send(frameView(params));
	}

	if (user.gameId.startsWith("m"))
		return reply.type("text/html").send(frameView(params, matchLobbyView(gamersBox.contents, user)));

	const chatsBox = gameChatsList(db, user.gameId);
	if (Result.SUCCESS != chatsBox.result) {
		params.result = chatsBox.result;
		return reply.type("text/html").send(frameView(params));
	}

	return reply.type("text/html").send(frameView(params, tournamentLobbyView(gamersBox.contents, chatsBox.contents, user)));
}

function remoteTournament(db: DatabaseSync, tournament: Tournament, request: FastifyRequest, reply: FastifyReply): FastifyReply {
	const user = request.user;
	const language = request.language;

	const params: FrameParams = {
		page: request.url,
		language,
		user
	};

	if (tournament.finished) {
		const result = removeUserFromMatch(db, user.userId);
		if (Result.SUCCESS != result)
			return reply.type("text/html").send(frameView(params));
	}

	const chatsBox = gameChatsList(db, user.gameId);
	if (Result.SUCCESS != chatsBox.result) {
		params.result = chatsBox.result;
		return reply.type("text/html").send(frameView(params));
	}
	const frame = frameView(params, tournamentView(tournament, chatsBox.contents, user));
	return reply.type("text/html").send(frame);

}
