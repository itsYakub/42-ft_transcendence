import { DatabaseSync } from "node:sqlite";

export function initRooms(db: DatabaseSync, dropRooms: boolean): void {
	if (dropRooms)
		db.exec(`DROP TABLE IF EXISTS Rooms;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS Rooms (
		RoomID TEXT PRIMARY KEY,
		Players INTEGER NOT NULL DEFAULT 0,
		MaxPlayers INTEGER NOT NULL
		);`);
}

export function getRooms(db: DatabaseSync) {
	try {
		const select = db.prepare("SELECT * FROM Rooms");
		const rooms = select.all();
		return {
			code: 200,
			rooms
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function addRoom(db: DatabaseSync, { maxPlayers, userID }) {
	try {
		const roomID = Date.now().toString(36).substring(4);
		const select = db.prepare("INSERT INTO ROOMS (RoomID, MaxPlayers) VALUES (?, ?)");
		select.run(roomID, maxPlayers);
		return {
			code: 200,
			message: "SUCCESS",
			roomID
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function joinRoom(db: DatabaseSync, { roomID, userID }) {
	try {
		let select = db.prepare(`SELECT Players, MaxPlayers FROM Rooms WHERE RoomID = ?`);
		const count = select.get(roomID);
		if (count.Players == count.MaxPlayers)
			return {
				code: 423,
				message: "ERR_FULL"
			}

		select = db.prepare(`UPDATE Users SET RoomID = ? WHERE UserID = ?;`);
		select.run(roomID, userID);
		select = db.prepare(`UPDATE Rooms SET Players = Players + 1 WHERE RoomID = ?;`);
		select.run(roomID);
		return {
			code: 200,
			message: "SUCCESS",
			roomID
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function leaveRoom(db: DatabaseSync, { userID }) {
	try {
		const select = db.prepare(`UPDATE Users SET RoomID = NULL WHERE UserID = ?;`);
		select.run(userID);
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
