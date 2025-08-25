import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { MatchResult, MatchResultBox, Result } from "../../common/interfaces.js";

export function initMatchResultsDb(db: DatabaseSync, { number, start, end }): void {
	db.exec(`
		CREATE TABLE IF NOT EXISTS match_results (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		opponent TEXT NOT NULL,
		opponent_score INTEGER NOT NULL,
		played_at TEXT NOT NULL,
		score INTEGER NOT NULL,
		tournament_win INTEGER NOT NULL,
		user_id INTEGER NOT NULL
		);`);
}

/*
	Gets all the user's matches
*/
export function matchResultsList(db: DatabaseSync, userId: number): MatchResultBox {
	try {
		const select = db.prepare("SELECT * FROM match_results WHERE user_id = ? ORDER BY played_at DESC");
		const matchResults = select.all(userId).map(mathResult => sqlToMatchResult(mathResult));
		return {
			result: Result.SUCCESS,
			matchResults
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function addMatchResult(db: DatabaseSync, userId: number, opponent: string, score: number, opponentScore: number, tournamentWin: boolean, date: Date = new Date()): any {
	try {
		const select = db.prepare("INSERT INTO match_results (user_id, opponent, score, opponent_score, tournament_win, played_at) VALUES (?, ?, ?, ?, ?, ?)");
		select.run(userId, opponent, score, opponentScore, Number(tournamentWin), date.toISOString());
		return {
			result: Result.SUCCESS
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

function sqlToMatchResult(matchResult: Record<string, SQLOutputValue>): MatchResult {
	return {
		opponent: matchResult.opponent as string,
		opponentScore: matchResult.opponent_score as number,
		playedAt: new Date(matchResult.played_at as string),
		score: matchResult.score as number,
		tournamentWin: Boolean(matchResult.tournament_win as number),
		userId: matchResult.user_id as number
	};
}
