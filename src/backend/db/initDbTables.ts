import { DatabaseSync } from "node:sqlite";
import { hashPassword } from "./jwt.js";
import { getNickname } from "./userDB.js";
import { defaultAvatar } from "./defaultAvatar.js";

export function initDbTables(db: DatabaseSync) {
	initFoesTable(db);
	initFriendsTable(db);
	initLocalTournamentsTable(db);
	initMatchesTable(db);
	initMatchResultsTable(db);
	initNotificationsTable(db);
	initTournamentsTable(db);
	initTournamentChatsTable(db);
	initUsersTable(db);
	initUserChatsTable(db);
}

function initFoesTable(db: DatabaseSync) {
	db.exec(`
		CREATE TABLE IF NOT EXISTS foes (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		foe_id INTEGER NOT NULL,
		user_id INTEGER NOT NULL
		);`);

	//TODO remove
	const number: number = 0, id: number = 1
	for (var i = 1; i <= number; i++)
		db.exec(`INSERT INTO foes (user_id, foe_id) VALUES (${id}, ${i});`);
}

function initFriendsTable(db: DatabaseSync) {
	db.exec(`
		CREATE TABLE IF NOT EXISTS friends (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		friend_id INTEGER NOT NULL,
		user_id INTEGER NOT NULL
		);`);

	//TODO remove
	const number: number = 0, id: number = 1
	for (var i = 1; i <= number; i++)
		db.exec(`INSERT INTO friends (user_id, friend_id) VALUES (${id}, ${i});`);
}

function initLocalTournamentsTable(db: DatabaseSync) {
	db.exec(`
		CREATE TABLE IF NOT EXISTS local_tournaments (
		game_id TEXT PRIMARY KEY UNIQUE,
		m1_g1_nick TEXT,
		m1_g2_nick TEXT,
		m2_g1_nick TEXT,
		m2_g2_nick TEXT,
		m3_g1_nick TEXT,
		m3_g2_nick TEXT,
		m1_g1_score INTEGER DEFAULT 0,
		m1_g2_score INTEGER DEFAULT 0,
		m2_g1_score INTEGER DEFAULT 0,
		m2_g2_score INTEGER DEFAULT 0,
		m3_g1_score INTEGER DEFAULT 0,
		m3_g2_score INTEGER DEFAULT 0
		);`);
}

function initMatchesTable(db: DatabaseSync) {
	db.exec(`
		CREATE TABLE IF NOT EXISTS matches (
		game_id TEXT PRIMARY KEY UNIQUE,
		g1_nick TEXT,
		g2_nick TEXT,
		g1_ready INTEGER DEFAULT 0,
		g2_ready INTEGER DEFAULT 0,
		g1_score INTEGER DEFAULT 0,
		g2_score INTEGER DEFAULT 0,
		g1_user_id INTEGER,
		g2_user_id INTEGER,
		tournament_final INTEGER DEFAULT 0
		);`);
}

function initMatchResultsTable(db: DatabaseSync): void {
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

function initNotificationsTable(db: DatabaseSync): void {
	db.exec(`
		CREATE TABLE IF NOT EXISTS notifications (
		from_id INTEGER NOT NULL,
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		notification_type TEXT NOT NULL,
		sent_at TEXT NOT NULL,
		to_id INTEGER NOT NULL
		);`);

	db.exec(`INSERT INTO notifications (from_id, notification_type, to_id, sent_at) VALUES (4, 'NOTIFICATION_INVITE',  11, '${new Date().toISOString()}');`);
	db.exec(`INSERT INTO notifications (from_id, notification_type, to_id, sent_at) VALUES (4, 'NOTIFICATION_TOURNAMENT',  11, '${new Date().toISOString()}');`);
}

function initTournamentsTable(db: DatabaseSync) {
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

function initTournamentChatsTable(db: DatabaseSync) {
	db.exec(`
		CREATE TABLE IF NOT EXISTS tournament_chats (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		chat TEXT NOT NULL,
		from_id INTEGER NOT NULL,
		game_id TEXT NOT NULL,
		sent_at TEXT NOT NULL
		);`);
}

function initUsersTable(db: DatabaseSync) {
	db.exec(`
		CREATE TABLE IF NOT EXISTS users (
		avatar TEXT,
		email TEXT,
		game_id TEXT,
		nick TEXT UNIQUE NOT NULL,
		password TEXT,
		refresh_token TEXT UNIQUE,
		totp_type TEXT,
		totp_secret TEXT,
		type TEXT DEFAULT USER,
		user_id INTEGER PRIMARY KEY AUTOINCREMENT
		);`);

	//TODO remove
	const addUsers: number = 0
	if (addUsers > 0) {
		const pw = hashPassword("12345678");
		for (var i = 1; i <= addUsers; i++)
			db.exec(`INSERT INTO users (nick, email, password, avatar) VALUES ('${getNickname(db).contents}', 'test${i}@test.com', '${pw}', '${defaultAvatar}');`);
	}
}

function initUserChatsTable(db: DatabaseSync): void {
	db.exec(`
		CREATE TABLE IF NOT EXISTS user_chats (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		from_id INTEGER NOT NULL,
		message TEXT NOT NULL,
		sent_at TEXT NOT NULL,
		to_id INTEGER NOT NULL
		);`);

	//TODO remove
	const number = 0, start = 0, end = 0, id = 0;
	for (var i = 1; i <= number; i++) {
		for (var j = start; j <= end; j++) {
			db.exec(`INSERT INTO user_chats (from_id, message, to_id, sent_at) VALUES (${j + 1}, '${j + 1}-to-${id}', ${id}, '${new Date().toISOString()}');`);
			db.exec(`INSERT INTO user_chats (from_id, message, to_id, sent_at) VALUES (${id}, '${id}-to-${j}', ${j}, '${new Date().toISOString()}');`);
		}
	}
}
