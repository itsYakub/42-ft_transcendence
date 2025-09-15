import { DatabaseSync } from "node:sqlite";
import { addUserToMatch, removeUserFromMatch, usersByGameId } from '../../db/userDB.js';
import { Message, MessageType, Result, ShortUser } from '../../common/interfaces.js';
import { gamersHtml } from '../views/remoteMatchLobbyView.js';
import { sendMessageToGameIdUsers, sendMessageToOtherUsers, sendMessageToUser, sendMessageToUsers } from "./serverSocket.js";
import { tournamentMatchEndReceived } from "./tournamentMessages.js";

export function matchJoinReceived(db: DatabaseSync, message: Message) {
	const { gameId, fromId } = message;
	if (Result.SUCCESS == addUserToMatch(db, gameId, fromId)) {
		const gamers = usersByGameId(db, gameId);
		if (Result.SUCCESS == gamers.result) {
			if (2 == gamers.contents.length) {
				const userIds = gamers.contents.map((gamer) => gamer.userId);
				sendMessageToGameIdUsers({
					type: MessageType.MATCH_READY,
					gameId,
					match: {
						g1: {
							nick: gamers.contents[0].nick,
							userId: gamers.contents[0].userId,
						},
						g2: {
							nick: gamers.contents[1].nick,
							userId: gamers.contents[1].userId,
						}
					}
				}, userIds);
			}

			const userIds = gamers.contents.map((gamer) => gamer.userId).filter((userId) => userId != fromId);
			sendMessageToGameIdUsers({
				type: MessageType.MATCH_LOBBY_CHANGED,
				content: gamersHtml(gamers.contents)
			}, userIds);

		}

		sendMessageToOtherUsers({
			type: MessageType.GAME_LIST_CHANGED
		}, fromId);
	}
}

export function matchLeaveReceived(db: DatabaseSync, gameId: string, fromId: number) {
	const response = removeUserFromMatch(db, fromId);

	if (Result.SUCCESS == response && gameId) {
		const gamers = usersByGameId(db, gameId);
		if (Result.SUCCESS == gamers.result) {
			const userIds = gamers.contents.map((gamer) => gamer.userId).filter((userId) => userId != fromId);
			sendMessageToGameIdUsers({
				type: MessageType.MATCH_LOBBY_CHANGED,
				gameId,
				content: gamersHtml(gamers.contents)
			}, userIds);
		}

		sendMessageToOtherUsers({
			type: MessageType.GAME_LIST_CHANGED
		}, fromId);
	}
}

export function matchOverReceived(db: DatabaseSync, message: Message) {
	// console.log(message);
	// sendMessageToGameIdUsers(message, user.gameId);
	// // add match-result here, only once per match!
	// const response = removeUsersFromMatch(db, user.gameId);

	// sendMessageToUsers({
	//     type: MessageType.GAME_LIST_CHANGED
	// });
}

// export function matchStartReceived(db: DatabaseSync, message: Message) {
// 	// sendMessageToGameIdUsers({
// 	//     type: MessageType.MATCH_START,
// 	//     gameId: message.gameId
// 	// }, message.gameId);
// }

/* Forward game updates - handles ball sync, paddle movements, etc. */
export function matchUpdateReceived(db: DatabaseSync, message: Message) {
	if (MessageType.MATCH_END == message.type) {
		const gamersBox = usersByGameId(db, message.gameId);
		if (Result.SUCCESS == gamersBox.result) {
			const gamers = gamersBox.contents;
			//removeUserFromMatch(db, gamers[0].userId);
			//removeUserFromMatch(db, gamers[1].userId);
			sendMessageToGameIdUsers({
				type: MessageType.MATCH_OVER
			}, [gamers[0].userId, gamers[1].userId])
		}
	}
	sendMessageToUser({
		type: MessageType.MATCH_UPDATE,
		gameId: message.gameId,
		fromId: message.fromId,
		matchContent: message.matchContent
	}, message.toId);
}
