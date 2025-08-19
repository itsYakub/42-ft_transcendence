import { DatabaseSync } from "node:sqlite";

export function initFriends(db: DatabaseSync): void {
	db.exec(`
		CREATE TABLE IF NOT EXISTS Friends (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		UserID INTEGER NOT NULL,
		FriendID INTEGER NOT NULL
		);`);
}

/*
	Gets all the user's friends
*/
export function getFriends(db: DatabaseSync, { id }): any {
	try {
		const select = db.prepare("SELECT FriendID, Nick, GameID, Online, Playing FROM Friends INNER JOIN Users ON Users.UserID = Friends.FriendID WHERE Friends.UserID = ? ORDER BY Online DESC, Nick");
		const friends = select.all(id);
		return {
			code: 200,
			friends
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

/*
	Adds a friend to a user's list
*/
export function addFriend(db: DatabaseSync, { id, friendID }): any {
	try {
		const select = db.prepare("INSERT INTO Friends (UserID, FriendID) VALUES (?, ?)");
		select.run(id, friendID);
		return {
			code: 200,
			message: "SUCCESS"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

/*
	Removes a friend from a user's list
*/
export function removeFriend(db: DatabaseSync, json: any): any {
	try {
		const select = db.prepare("DELETE FROM Friends WHERE UserID = ? AND FriendID = ?");
		select.run(json.id, json.friendID);
		return {
			code: 200,
			message: "SUCCESS"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}
