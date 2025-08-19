import { DatabaseSync } from "node:sqlite";

export function initBlocked(db: DatabaseSync): void {
	db.exec(`
		CREATE TABLE IF NOT EXISTS Blocked (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		UserID INTEGER NOT NULL,
		BlockedID INTEGER NOT NULL
		);`);
}

/*
	Gets all the user's blocked ids
*/
export function blockedList(db: DatabaseSync, { id }): any {
	try {
		const select = db.prepare("SELECT * FROM Blocked INNER JOIN Users ON Users.UserID = Blocked.BlockedID WHERE BLOCKED.UserID = ? ORDER BY Online DESC, Nick");
		const blocked = select.all(id);
		return {
			code: 200,
			blocked
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
	Adds somebody to the block list
*/
export function addBlocked(db: DatabaseSync, { id, blockedID }): any {
	try {
		const select = db.prepare("INSERT INTO Blocked (UserID, BlockedID) VALUES (?, ?)");
		select.run(id, blockedID);
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
	Unblocks someone from a user's list
*/
export function removeBlocked(db: DatabaseSync, { id, blockedID }): any {
	try {
		const select = db.prepare("DELETE FROM Blocked WHERE UserID = ? AND BlockedID = ?");
		select.run(id, blockedID);
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
