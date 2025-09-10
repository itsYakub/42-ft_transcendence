import { DatabaseSync } from "node:sqlite";
import { addUserToMatch, removeUserFromMatch, usersByGameId } from '../../db/userDB.js';
import { Message, MessageType, Result, ShortUser } from '../../common/interfaces.js';
import { gamersHtml } from '../views/remoteMatchLobbyView.js';
import { sendMessageToGameIdUsers, sendMessageToOtherUsers, sendMessageToUsers } from "./serverSocket.js";

export function matchJoinReceived(db: DatabaseSync, user: ShortUser, message: Message) {
	const gameId = message.gameId;
	if (Result.SUCCESS == addUserToMatch(db, gameId, user)) {
		const gamers = usersByGameId(db, gameId);
		if (Result.SUCCESS == gamers.result) {
			if (2 == gamers.contents.length) {
				const userIds = gamers.contents.map((gamer) => gamer.userId);
				sendMessageToGameIdUsers({
					type: MessageType.MATCH_READY,
					gameId
				}, userIds);

				setTimeout(() => {
					sendMessageToGameIdUsers({
						type: MessageType.MATCH_START,
						gameId
					}, userIds);
				}, 3000);
			}

			const userIds = gamers.contents.map((gamer) => gamer.userId);
			console.log(userIds);
			sendMessageToGameIdUsers({
				type: MessageType.MATCH_LOBBY_CHANGED,
				content: gamersHtml(gamers.contents)
			}, userIds);
		}

		sendMessageToOtherUsers({
			type: MessageType.GAME_LIST_CHANGED
		}, user.userId);
	}
}

export function matchLeaveReceived(db: DatabaseSync, user: ShortUser) {
	const gameId = user.gameId;
	const response = removeUserFromMatch(db, user.userId);

	if (Result.SUCCESS == response && gameId) {
		const gamers = usersByGameId(db, gameId);
		if (Result.SUCCESS == gamers.result) {
			const userIds = gamers.contents.map((gamer) => gamer.userId).filter((userId) => userId != user.userId);
			sendMessageToGameIdUsers({
				type: MessageType.MATCH_LOBBY_CHANGED,
				gameId,
				content: gamersHtml(gamers.contents)
			}, userIds);
		}

		sendMessageToUsers({
			type: MessageType.GAME_LIST_CHANGED
		});
	}
}

export function matchOverReceived(db: DatabaseSync, user: ShortUser, message: Message) {
	// console.log(message);
	// sendMessageToGameIdUsers(message, user.gameId);
	// // add match-result here, only once per match!
	// const response = removeUsersFromMatch(db, user.gameId);

	// sendMessageToUsers({
	//     type: MessageType.GAME_LIST_CHANGED
	// });
}

export function matchStartReceived(db: DatabaseSync, user: ShortUser, message: Message) {
	// sendMessageToGameIdUsers({
	//     type: MessageType.MATCH_START,
	//     gameId: message.gameId
	// }, message.gameId);
}

/* Forward game updates - handles ball sync, paddle movements, etc. */
export function matchUpdateReceived(db: DatabaseSync, user: ShortUser, message: Message) {
	const id = message.fromId == user.userId ? message.toId : message.fromId;
	sendMessageToGameIdUsers({
		type: MessageType.MATCH_UPDATE,
		gameId: message.gameId,
		fromId: user.userId,
		content: message.content
	}, [id]);
}
