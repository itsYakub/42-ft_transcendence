import { DatabaseSync } from "node:sqlite";

export function initFriends(db: DatabaseSync, dropFriends: boolean): void {
	if (dropFriends)
		db.exec(`DROP TABLE IF EXISTS Friends;`);

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
export function getFriends(db: DatabaseSync, id: number) {
	try {
		const select = db.prepare("SELECT * FROM Friends INNER JOIN Users ON Users.UserID = Friends.FriendID WHERE Friends.UserID = ? ORDER BY Online DESC, Nick");
		const friends = select.all(id);
		return friends;
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
export function addFriend(db: DatabaseSync, json: any): any {
	try {
		const select = db.prepare("INSERT INTO Friends (UserID, FriendID) VALUES (?, ?)");
		select.run(json.id, json.friendID);
		return {
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
