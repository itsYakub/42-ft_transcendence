import { DatabaseSync } from "node:sqlite";
import { result } from "../../common/interfaces.js";

export function initFriends(db: DatabaseSync): void {
	db.exec(`
		CREATE TABLE IF NOT EXISTS friends (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		friend_id INTEGER NOT NULL
		);`);
}

/*
	Gets all the user's friends
*/
export function friendsList(db: DatabaseSync, { userId }): any {
	try {
		const select = db.prepare("SELECT friend_id, nick, gameId, online, playing FROM friends INNER JOIN users ON users.user_id = friends.friend_id WHERE friends.user_id = ? ORDER BY online DESC, nick");
		const friends = select.all(userId);
		return {
			result: result.SUCCESS,
			friends
		};
	}
	catch (e) {
		return {
			result: result.ERR_DB
		};
	}
}

/*
	Adds a friend to a user's list
*/
export function addFriend(db: DatabaseSync, { userId, friendId }): any {
	try {
		const select = db.prepare("INSERT INTO friends (user_id, friend_id) VALUES (?, ?)");
		select.run(userId, friendId);
		return {
			result: result.SUCCESS
		};
	}
	catch (e) {
		return {
			result: result.ERR_DB
		};
	}
}

/*
	Removes a friend from a user's list
*/
export function removeFriend(db: DatabaseSync, { userId, friendId }): any {
	try {
		const select = db.prepare("DELETE FROM friends WHERE user_id = ? AND friend_id = ?");
		select.run(userId, friendId);
		return {
			result: result.SUCCESS
		};
	}
	catch (e) {
		return {
			result: result.ERR_DB
		};
	}
}
