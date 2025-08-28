import { Message, MessageType, Result, User } from "../../../common/interfaces.js";
import { endTournamentMatch, startTournamentMatch, updateTournamentDetails } from "../game/tournament.js";
import { gameReady, userJoinOrLeave, userSendGameChat } from "./gamesMessages.js";
import { userConnectOrDisconnect, userInvite, userReadyorUnready, userSendUserChat } from "./userMessages.js";

let socket: WebSocket | null = null;

/**
 * Initialize WebSocket connection.
 */
export function initClientSocket(): Promise<void> {
	const socketUrl = `wss://${window.location.host}/ws`;
	if (!socket)
		socket = new WebSocket(socketUrl);

	return new Promise(async (resolve, reject) => {
		socket!.onopen = () => resolve();

		socket!.onmessage = async (event) => {
			const userResponse = await fetch("/api/user");
			const userBox = await userResponse.json();
			if (Result.SUCCESS != userBox.result)
				return;

			const message = JSON.parse(event.data);
			handleServerMessage(userBox.user, message);
		};

		socket!.onerror = (err) => {
			console.error("❌ WebSocket error occurred:", err);
			reject(err);
		};

		socket!.onclose = (event) => {
			console.warn(`🔌 WebSocket connection closed ${event}`);
			//setTimeout(initChatSocket, 1000);
		};
	});
}

export function closeSocket() {
	socket.close();
	socket = null;
}

/*
	Checkes whether it's safe to send a message
*/
export function isConnected(): boolean {
	return socket && 1 == socket.OPEN;
}

/*
	Sends a message from a client to the server
*/
export function sendMessageToServer(message: Message) {
	if (1 == socket?.OPEN)
		socket.send(JSON.stringify(message));
}

export function currentPage(): string {
	const split = window.location.pathname.split("/").filter(n => n);
	return split[0];
}

/*
	Deals with a socket message from the server
*/
function handleServerMessage(user: User, message: Message) {
	switch (message.type) {
		case MessageType.USER_CONNECT:
		case MessageType.USER_DISCONNECT:
			userConnectOrDisconnect(user, message);
			break;
		case MessageType.USER_JOIN_GAME:
		case MessageType.USER_LEAVE_GAME:
			userJoinOrLeave(user, message);
			break;
		case MessageType.USER_SEND_GAME_CHAT:
			userSendGameChat(user, message);
			break;
		case MessageType.GAME_READY:
			gameReady(user, message);
			break;
		case MessageType.TOURNAMENT_MATCH_END:
			endTournamentMatch(user, message);
			break;
		case MessageType.TOURNAMENT_MATCH_START:
			startTournamentMatch(user, message);
			break;
		case MessageType.TOURNAMENT_UPDATE:
			updateTournamentDetails(user, message);
			break;
		case MessageType.USER_INVITE:
			userInvite(user, message);
			break;
		case MessageType.USER_LEAVE_TOURNAMENT:
			console.log("Lost game");
			break;
		case MessageType.USER_READY:
		case MessageType.USER_UNREADY:
			userReadyorUnready(user, message);
			break;
		case MessageType.USER_SEND_USER_CHAT:
			userSendUserChat(user, message);
			break;
	}
}
