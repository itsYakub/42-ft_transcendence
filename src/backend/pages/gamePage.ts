import { FastifyRequest, FastifyReply } from 'fastify';
import { frameView } from '../views/frameView.js';
import { getGames, gamePlayers } from '../db/gameDb.js';
import { remoteMatchLobbyView } from '../views/remoteMatchLobbyView.js';
import { gameView } from '../views/gameView.js';
import { FrameParams, LocalTournament, Result, Tournament } from '../../common/interfaces.js';
import { readTournamentChats } from '../db/TournamentChatsDb.js';
import { readTournament } from '../db/tournamentsDb.js';
import { remoteTournamentView } from '../views/remoteTournamentView.js';
import { remoteTournamentLobbyView } from '../views/remoteTournamentLobbyView.js';
import { localTournamentView } from '../views/localTournamentView.js';
import { getLocalTournament } from '../db/localTournamentsDb.js';
import { removeUserFromMatch } from '../db/userDB.js';

export function getGamePage(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	const language = request.language;

	// user is already in a game
	if (user.gameId) {
		const gameId = user.gameId;

		const tournamentBox = readTournament(db, gameId);
		if (Result.SUCCESS == tournamentBox.result)
			return (remoteTournament(tournamentBox.contents, request, reply));

		const localTournamentBox = getLocalTournament(db, gameId);
		if (Result.SUCCESS == localTournamentBox.result)
			return localTournament(localTournamentBox.contents, request, reply);

		return lobby(request, reply);
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

	const frame = frameView(params, gameView(gamesBox.contents));
	return reply.type("text/html").send(frame);
}

function localTournament(tournament: LocalTournament, request: FastifyRequest, reply: FastifyReply): FastifyReply {
	const db = request.db;
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

function lobby(request: FastifyRequest, reply: FastifyReply): FastifyReply {
	const db = request.db;
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
		return reply.type("text/html").send(frameView(params, remoteMatchLobbyView(gamersBox.contents, user)));

	const chatsBox = readTournamentChats(db, user.gameId);
	if (Result.SUCCESS != chatsBox.result) {
		params.result = chatsBox.result;
		return reply.type("text/html").send(frameView(params));
	}

	return reply.type("text/html").send(frameView(params, remoteTournamentLobbyView(gamersBox.contents, chatsBox.contents, user)));
}

function remoteTournament(tournament: Tournament, request: FastifyRequest, reply: FastifyReply): FastifyReply {
	const db = request.db;
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

	const chatsBox = readTournamentChats(db, user.gameId);
	if (Result.SUCCESS != chatsBox.result) {
		params.result = chatsBox.result;
		return reply.type("text/html").send(frameView(params));
	}
	const frame = frameView(params, remoteTournamentView(tournament, chatsBox.contents, user));
	return reply.type("text/html").send(frame);

}
