import { FastifyRequest, FastifyReply } from 'fastify';
import { gamePlayers, updateGameId } from '../../db/gameDb.js';
import { Box, Result } from '../../common/interfaces.js';
import { createRemoteTournament, readRemoteTournament } from '../../db/remoteTournamentsDb.js';
import { remoteTournamentDetails } from '../views/remoteTournamentView.js';
import { createLocalTournament, updateLocalTournament } from '../../db/localTournamentsDb.js';
import { generateNickname } from '../../db/userDB.js';
import { createMatchResult } from '../../db/matchResultsDb.js';
import { readTournamentChats } from '../../db/TournamentChatsDb.js';
import { remoteTournamentLobbyView, remoteTournamentMessagesHtml } from '../views/remoteTournamentLobbyView.js';

export function getTournamentGamers(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const gamersBox = gamePlayers(db, request.user.gameId);
	return reply.send(gamersBox);
}

export function matchNicks(request: FastifyRequest, reply: FastifyReply) {
	let nicks = [
		request.user.nick,
		generateNickname()
	];

	while (2 != nicks.filter((n, i) => nicks.indexOf(n) === i).length) {
		nicks = [
			request.user.nick,
			generateNickname()
		];
	}
	return {
		result: Result.SUCCESS,
		contents: nicks
	};
}

export function tournamentNicks(request: FastifyRequest, reply: FastifyReply) {
	let nicks = [
		request.user.nick,
		generateNickname(),
		generateNickname(),
		generateNickname()
	];

	while (4 != nicks.filter((n, i) => nicks.indexOf(n) === i).length) {
		nicks = [
			request.user.nick,
			generateNickname(),
			generateNickname(),
			generateNickname()
		];
	}
	return {
		result: Result.SUCCESS,
		contents: nicks
	};
}

export function matchGamers(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const gamersBox = gamePlayers(db, request.user.gameId);
	return reply.send(gamersBox);
}

export async function getTournament(request: FastifyRequest, reply: FastifyReply): Promise<Box<string>> {
	const db = request.db;
	const gamersBox = readRemoteTournament(db, request.user.gameId);
	if (Result.SUCCESS != gamersBox.result)
		return reply.send({
			result: gamersBox.result
		});

	return reply.send({
		result: Result.SUCCESS,
		contents: remoteTournamentDetails(gamersBox.contents, request.user)
	});
}

export async function createTournamentLobby(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	const gameId = `t${Date.now().toString(36).substring(5)}`;
	user.gameId = gameId;
	return reply.send(updateGameId(db, user));
}

export async function getTournamentLobby(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	user.gameId = (request.params as any).gameId;
	const result = updateGameId(db, user);
	if (Result.SUCCESS != result)
		return reply.send({ result });

	return reply.send({
		result,
		contents: remoteTournamentLobbyView([user], [], user)
	});
}

export async function addLocalTournament(request: FastifyRequest, reply: FastifyReply): Promise<Box<string>> {
	const db = request.db;
	const user = request.user;
	const gameId = `t${Date.now().toString(36).substring(5)}`;
	const { gamers } = request.body as any;

	if (Result.SUCCESS == createLocalTournament(db, gameId, gamers))
		user.gameId = gameId;
	return reply.send(updateGameId(db, user));
}

export async function addRemoteTournament(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	const gameId = `l${Date.now().toString(36).substring(5)}`;

	user.gameId = gameId;
	return reply.send(updateGameId(db, user));
}

export function updateLocalTournment(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const { g1Nick, g1Score, g2Nick, g2Score, matchNumber } = request.body as any;
	const user = request.user;
	const match = {
		g1: {
			nick: g1Nick,
			score: g1Score
		},
		g2: {
			nick: g2Nick,
			score: g2Score
		},
		matchNumber
	};
	if (g1Nick == user.nick) {
		const tournamentWin = 3 == matchNumber && g1Score > g2Score;
		const result = createMatchResult(db, user.userId, g2Nick, g1Score, g2Score, tournamentWin);
		if (Result.SUCCESS != result)
			return reply.send(result);
	}
	else if (g2Nick == user.nick) {
		const tournamentWin = 3 == matchNumber && g2Score > g1Score;
		const result = createMatchResult(db, user.userId, g1Nick, g2Score, g1Score, tournamentWin);
		if (Result.SUCCESS != result)
			return reply.send(result);
	}
	return reply.send(updateLocalTournament(db, user.gameId, match));
}

export function tournamentChats(request: FastifyRequest, reply: FastifyReply) {
	const messagesBox = readTournamentChats(request.db, request.user.gameId);
	if (Result.SUCCESS == messagesBox.result) {
		const html = remoteTournamentMessagesHtml(messagesBox.contents, request.user);
		return reply.send({
			result: Result.SUCCESS,
			value: html
		});
	}
	else
		return reply.send({
			result: Result.ERR_NOT_FOUND,
		});
}

// fastify.get('/gamers', async (request: FastifyRequest, reply: FastifyReply) => {
// 	const gamersBox = gamePlayers(db, request.user.gameId);
// 	if (Result.SUCCESS == gamersBox.result) {
// 		let text = gamersString(gamersBox.contents, request.user);
// 		text = translate(request.language, text);

// 		return reply.send({
// 			result: Result.SUCCESS,
// 			value: text
// 		});
// 	}
// 	else
// 		return reply.send({
// 			result: Result.ERR_NOT_FOUND
// 		});
// });
