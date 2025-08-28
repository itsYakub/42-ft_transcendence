import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, Gamer, Match, MatchGamer, MatchStatus, Result, Tournament, TournamentGamer, User } from "../../common/interfaces.js";

export function initTournamentsDb(db: DatabaseSync) {
	db.exec(`DROP TABLE IF EXISTS tournaments;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS tournaments (
		game_id TEXT PRIMARY KEY UNIQUE,
		m1_g1_nick TEXT,
		m1_g2_nick TEXT,
		m2_g1_nick TEXT,
		m2_g2_nick TEXT,
		m3_g1_nick TEXT,
		m3_g2_nick TEXT,
		m1_g1_ready INTEGER DEFAULT 0,
		m1_g2_ready INTEGER DEFAULT 0,
		m2_g1_ready INTEGER DEFAULT 0,
		m2_g2_ready INTEGER DEFAULT 0,
		m3_g1_ready INTEGER DEFAULT 0,
		m3_g2_ready INTEGER DEFAULT 0,
		m1_g1_score INTEGER DEFAULT 0,
		m1_g2_score INTEGER DEFAULT 0,
		m2_g1_score INTEGER DEFAULT 0,
		m2_g2_score INTEGER DEFAULT 0,
		m3_g1_score INTEGER DEFAULT 0,
		m3_g2_score INTEGER DEFAULT 0,
		m1_g1_user_id INTEGER,
		m1_g2_user_id INTEGER,
		m2_g1_user_id INTEGER,
		m2_g2_user_id INTEGER,
		m3_g1_user_id INTEGER,
		m3_g2_user_id INTEGER
		);`);
}

export function getTournament(db: DatabaseSync, gameId: string): Box<Tournament> {
	try {
		const select = db.prepare("SELECT * FROM tournaments WHERE game_id = ?");
		const tournament = sqlToTournament(select.get(gameId));
		return {
			result: Result.SUCCESS,
			contents: tournament
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function addTournament(db: DatabaseSync, gameId: string, gamers: Gamer[]): Result {
	try {
		const select = db.prepare("INSERT INTO tournaments (game_id, m1_g1_user_id, m1_g2_user_id, m2_g1_user_id, m2_g2_user_id, m1_g1_nick, m1_g2_nick, m2_g1_nick, m2_g2_nick) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
		select.run(gameId, gamers[0].userId, gamers[1].userId, gamers[2].userId, gamers[3].userId, gamers[0].nick, gamers[1].nick, gamers[2].nick, gamers[3].nick);
		return Result.SUCCESS;
	}
	catch (e) {
		console.log(e);
		return Result.ERR_DB;
	}
}

export function markTournamentGamerReady(db: DatabaseSync, tournament: Tournament, user: User): Result {
	const match = whichMatchIsUserIn(tournament, user);
	const player = match.g1.userId == user.userId ? 1 : 2;
	try {
		const select = db.prepare(`UPDATE tournaments SET m${match.matchNumber}_g${player}_ready = 1 WHERE game_id = ?;`);
		select.run(user.gameId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function updateTournamentMatchResult(db: DatabaseSync, gameId: string, match: Match): Result {
	try {
		const select = db.prepare(`UPDATE tournaments SET m${match.matchNumber}_g1_score = ?, m${match.matchNumber}_g2_score = ? WHERE game_id = ?;`);
		select.run(match.g1.score, match.g2.score, gameId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function updateTournamentFinal(db: DatabaseSync, gameId: string, matches: Match[]): Result {
	try {
		console.debug("updating", matches);
		if ((matches[0].g1.score + matches[0].g2.score > 0) && (matches[0].g1.score + matches[0].g2.score > 0)) {
			const g1 = matches[0].g1.score > matches[0].g2.score ? matches[0].g1 : matches[0].g2;
			const g2 = matches[1].g1.score > matches[1].g2.score ? matches[1].g1 : matches[1].g2;
			const select = db.prepare(`UPDATE tournaments SET m1_g1_nick = NULL, m1_g2_nick = NULL,
				m2_g1_nick = NULL, m2_g2_nick = NULL, m1_g1_user_id = NULL, m1_g2_user_id = NULL,
				m2_g1_user_id = NULL, m2_g2_user_id = NULL,
				m3_g1_nick = ?, m3_g2_nick = ?, m3_g1_user_id = ?, m3_g2_user_id = ? WHERE game_id = ?;`);
			select.run(g1.nick, g2.nick, g1.userId, g2.userId, gameId);
			return Result.SUCCESS;
		}
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function whichMatchIsUserIn(tournament: Tournament, user: User): Match {
	return tournament.matches.find(match => match.g1.userId == user.userId || match.g2.userId == user.userId);
}

function whichGamerIsUser(match: Match, user: User): MatchGamer {
	return match.g1.userId == user.userId ? match.g1 : match.g2;
}

function sqlToTournament(tournament: Record<string, SQLOutputValue>): Tournament {
	return {
		matches: [
			sqlToMatch(tournament, 1),
			sqlToMatch(tournament, 2),
			sqlToMatch(tournament, 3)
		]
	}
}

function sqlToMatch(tournament: Record<string, SQLOutputValue>, matchNumber: number): Match {
	return {
		g1: sqlToMatchGamer(tournament, matchNumber, 1),
		g2: sqlToMatchGamer(tournament, matchNumber, 2),
		matchNumber
	}
}

function sqlToMatchGamer(tournament: Record<string, SQLOutputValue>, matchNumber: number, gamerNumber: number): MatchGamer {
	return {
		nick: tournament[`m${matchNumber}_g${gamerNumber}_nick`] as string,
		ready: Boolean(tournament[`m${matchNumber}_g${gamerNumber}_ready`] as number),
		score: tournament[`m${matchNumber}_g${gamerNumber}_score`] as number,
		userId: tournament[`m${matchNumber}_g${gamerNumber}_user_id`] as number
	}
}

// function sqlToTournament(tournament: Record<string, SQLOutputValue>, user: User): Tournament {
// 	const isPrimaryMatch = user.userId == tournament.g1_id as number || user.userId == tournament.g2_id as number;

// 	return isPrimaryMatch ?
// 		{
// 			primaryMatch: {
// 				gamer1: sqlToGamer(tournament, 1),
// 				gamer2: sqlToGamer(tournament, 2),
// 				matchStatus: tournament.primary_match_status as number
// 			},
// 			secondaryMatch: {
// 				gamer1: sqlToGamer(tournament, 3),
// 				gamer2: sqlToGamer(tournament, 4),
// 				matchStatus: tournament.secondary_match_status as number
// 			}
// 		}
// 		:
// 		{
// 			primaryMatch: {
// 				gamer1: sqlToGamer(tournament, 3),
// 				gamer2: sqlToGamer(tournament, 4),
// 				matchStatus: tournament.primary_match_status as number
// 			},
// 			secondaryMatch: {
// 				gamer1: sqlToGamer(tournament, 1),
// 				gamer2: sqlToGamer(tournament, 2),
// 				matchStatus: tournament.secondary_match_status as number
// 			}
// 		};
// }

// function sqlToGamer(tournament: Record<string, SQLOutputValue>, index: number): TournamentGamer {
// 	switch (index) {
// 		case 1:
// 			return {
// 				index,
// 				nick: tournament.g1_nick as string,
// 				opponentId: tournament.g2_id as number,
// 				opponentIndex: 2,
// 				opponentNick: tournament.g2_nick as string,
// 				opponentReady: Boolean(tournament.g2_ready as number),
// 				ready: Boolean(tournament.g1_ready as number),
// 				userId: tournament.g1_id as number,
// 			}
// 		case 2:
// 			return {
// 				index,
// 				nick: tournament.g2_nick as string,
// 				opponentId: tournament.g1_id as number,
// 				opponentIndex: 1,
// 				opponentNick: tournament.g1_nick as string,
// 				opponentReady: Boolean(tournament.g1_ready as number),
// 				ready: Boolean(tournament.g2_ready as number),
// 				userId: tournament.g2_id as number,
// 			}
// 		case 3:
// 			return {
// 				index,
// 				nick: tournament.g3_nick as string,
// 				opponentId: tournament.g4_id as number,
// 				opponentIndex: 4,
// 				opponentNick: tournament.g4_nick as string,
// 				opponentReady: Boolean(tournament.g4_ready as number),
// 				ready: Boolean(tournament.g3_ready as number),
// 				userId: tournament.g3_id as number,
// 			}
// 		default:
// 			return {
// 				index,
// 				nick: tournament.g4_nick as string,
// 				opponentId: tournament.g3_id as number,
// 				opponentIndex: 3,
// 				opponentNick: tournament.g3_nick as string,
// 				opponentReady: Boolean(tournament.g3_ready as number),
// 				ready: Boolean(tournament.g4_ready as number),
// 				userId: tournament.g4_id as number,
// 			}
// 	}
// }
