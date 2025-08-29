import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, Friend, Result } from "../../common/interfaces.js";

export function initFriendsDb(db: DatabaseSync, number: number = 0, id: number = 1) {
	db.exec(`DROP TABLE IF EXISTS friends;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS friends (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		friend_id INTEGER NOT NULL,
		user_id INTEGER NOT NULL
		);`);

	for (var i = 1; i <= number; i++)
		db.exec(`INSERT INTO friends (user_id, friend_id) VALUES (${id}, ${i});`);
}

/*
	Gets all the user's friends
*/
export function friendsList(db: DatabaseSync, userId: number): Box<Friend[]> {
	try {
		const select = db.prepare("SELECT *, nick, game_id, online FROM friends INNER JOIN users ON users.user_id = friends.friend_id WHERE friends.user_id = ? ORDER BY online DESC, nick");
		const friends = select.all(userId).map(friend => sqlToFriend(friend));
		return {
			result: Result.SUCCESS,
			contents: friends
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

/*
	Adds a friend to a user's list
*/
export function addFriend(db: DatabaseSync, userId: number, friendId: number): Result {
	try {
		console.log(`inserting ${userId} ${friendId}`);
		const select = db.prepare("INSERT INTO friends (user_id, friend_id) VALUES (?, ?)");
		select.run(userId, friendId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

/*
	Removes a friend from a user's list
*/
export function removeFriend(db: DatabaseSync, userId: number, friendId: number): Result {
	try {
		const select = db.prepare("DELETE FROM friends WHERE user_id = ? AND friend_id = ?");
		select.run(userId, friendId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function sqlToFriend(friend: Record<string, SQLOutputValue>): Friend {
	return {
		friendId: friend.friend_id as number,
		nick: friend.nick as string,
		online: Boolean(friend.online as number),
		userId: friend.user_id as number
	};
}
