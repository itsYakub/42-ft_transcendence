import { DatabaseSync } from "node:sqlite";
import { addUserToMatch, removeUserFromMatch, removeUsersFromMatch, usersByGameId } from '../../db/userDB.js';
import { Message, MessageType, Result, ShortUser } from '../../common/interfaces.js';
import { gamersHtml } from '../views/remoteMatchLobbyView.js';
import { sendMessageToGameIdUsers, sendMessageToOtherGameIdUsers, sendMessageToUsers } from "./serverSocket.js";

export function matchJoinReceived(db: DatabaseSync, user: ShortUser, message: Message) {
    const gameId = message.gameId;
    if (Result.SUCCESS == addUserToMatch(db, gameId, user)) {
        const gamers = usersByGameId(db, gameId);
        if (Result.SUCCESS == gamers.result) {
            if (2 == gamers.contents.length) {
                sendMessageToGameIdUsers({
                    type: MessageType.MATCH_READY,
                    gameId
                }, gameId);

                setTimeout(() => {
                    sendMessageToGameIdUsers({
                        type: MessageType.MATCH_START,
                        gameId
                    }, gameId);
                }, 3000);
            }

            sendMessageToGameIdUsers({
                type: MessageType.MATCH_LOBBY_CHANGED,
                gameId,
                content: gamersHtml(gamers.contents)
            }, gameId);
        }

        sendMessageToUsers({
            type: MessageType.GAME_LIST_CHANGED
        });
    }
}

export function matchLeaveReceived(db: DatabaseSync, user: ShortUser) {
    const gameId = user.gameId;
    const response = removeUserFromMatch(db, user.userId);

    if (Result.SUCCESS == response && gameId) {
        const gamers = usersByGameId(db, gameId);
        if (Result.SUCCESS == gamers.result) {
            sendMessageToGameIdUsers({
                type: MessageType.MATCH_LOBBY_CHANGED,
                gameId,
                content: gamersHtml(gamers.contents)
            }, gameId);
        }

        sendMessageToUsers({
            type: MessageType.GAME_LIST_CHANGED
        });
    }
}

export function matchOverReceived(db: DatabaseSync, user: ShortUser, message: Message) {
    console.log(message);
    sendMessageToGameIdUsers(message, user.gameId);
    // add match-result here, only once per match!
    const response = removeUsersFromMatch(db, user.gameId);

    sendMessageToUsers({
        type: MessageType.GAME_LIST_CHANGED
    });
}

export function matchStartReceived(db: DatabaseSync, user: ShortUser, message: Message) {
    sendMessageToGameIdUsers({
        type: MessageType.MATCH_START,
        gameId: message.gameId
    }, message.gameId);
}

/* Forward game updates - handles ball sync, paddle movements, etc. */
export function matchUpdateReceived(db: DatabaseSync, user: ShortUser, message: Message) {
    if (message.gameId && user.gameId === message.gameId) {
        // Use the new sendMessageToOtherGameIdUsers to avoid echoing back to sender
        sendMessageToOtherGameIdUsers({
            type: MessageType.MATCH_UPDATE,
            gameId: message.gameId,
            fromId: user.userId,
            content: message.content
        }, message.gameId);
    }
}
