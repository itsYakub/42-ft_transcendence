import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, GameChatMessage, Message, Result } from "../common/interfaces.js";

/*
	Gets all the game's messages
*/
export function readTournamentChats(db: DatabaseSync, gameId: string): Box<GameChatMessage[]> {
	try {
		const select = db.prepare("SELECT from_id, chat, nick FROM game_chats INNER JOIN users ON users.user_id = game_chats.from_id WHERE game_chats.game_id = ? ORDER BY sent_at DESC");
		const chats: GameChatMessage[] = select.all(gameId).map(sqlChat => sqlToTournamentChatMessage(sqlChat));
		return {
			result: Result.SUCCESS,
			contents: chats
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

/*
	Adds a message to the game (lobby)
*/
export function createTournamentChat(db: DatabaseSync, message: Message): Result {
	try {
		const select = db.prepare("INSERT INTO game_chats (game_id, from_id, chat, sent_at) VALUES (?, ?, ?, ?)");
		select.run(message.gameId, message.fromId, message.chat, new Date().toISOString());
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function sqlToTournamentChatMessage(sqlChat: Record<string, SQLOutputValue>): GameChatMessage {
	return {
		chat: sqlChat.chat as string,
		fromId: sqlChat.from_id as number,
		nick: sqlChat.nick as string,
	}
}
