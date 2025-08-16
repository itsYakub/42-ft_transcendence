import { DatabaseSync } from "node:sqlite";

export function getRooms(db: DatabaseSync) {
	try {
		const select = db.prepare("SELECT RoomID, GROUP_CONCAT(Nick) AS Nicks FROM USERS WHERE NOT RoomID IS NULL GROUP BY RoomID");
		const result = select.all();
		return {
			code: 200,
			rooms: result
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function roomPlayers(db: DatabaseSync, { roomID }) {
	try {
		const select = db.prepare("SELECT UserID, Nick, Ready FROM USERS WHERE RoomID IS ?");
		const players = select.all(roomID);
		return {
			code: 200,
			message: "SUCCESS",
			players
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function addToRoom(db: DatabaseSync, { roomID, user }) {
	try {
		if (user.roomID != roomID) {
			const select = db.prepare(`UPDATE Users SET RoomID = ? WHERE UserID = ?;`);
			select.run(roomID, user.id);
		}
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

export function joinRoom(db: DatabaseSync, { roomID, user }) {
	try {
		let select = db.prepare(`SELECT COUNT(RoomID) AS count FROM Users WHERE RoomID = ?`);
		const result = select.get(roomID);
		if (0 == result.count)
			return {
				code: 404,
				error: "ERR_NOT_FOUND"
			};
		
		if (user.roomID != roomID && (2 == result.count && roomID.startsWith("m") || 4 == result.count && roomID.startsWith("t")))
			return {
				code: 423,
				error: "ERR_FULL"
			};

		return addToRoom(db, {
			roomID,
			user
		});
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function leaveRoom(db: DatabaseSync, { id, roomID }) {
	try {
		let select = db.prepare(`UPDATE Users SET RoomID = NULL, Ready = 0 WHERE UserID = ?`);
		select.run(id);
		select = db.prepare("SELECT COUNT(RoomID) as roomCount FROM Users WHERE RoomID = ?");
		const { roomCount } = select.get(roomID);
		// if (0 == roomCount) {
		// 	select = db.prepare("DELETE FROM Messages Where ToID = ?");
		// 	select.run(roomID);
		// }
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

export function makeReady(db: DatabaseSync, { id }) {
	try {
		const select = db.prepare(`UPDATE Users SET Ready = 1 WHERE UserID = ?`);
		select.run(id);
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
