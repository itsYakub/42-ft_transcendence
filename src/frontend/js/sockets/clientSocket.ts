import { Message, MessageType, Result, ShortUser, User } from "../../../common/interfaces.js";
import {
	actuallyStartingMatch,
	matchFinishing,
	startingMatch,
	updateMatchDetails,
	updateMatchList,
	updateMatchLobby
} from "./remoteMatchesMessages.js";
import { joinOrLeaveTournament, tournamentChat, tournamentMatchStart, tournamentOver, updateTournamentDetails } from "./remoteTournamentsMessages.js";
import { userConnectOrDisconnect, userInvite, userSendUserChat } from "./userMessages.js";

let socket: WebSocket | null = null;

export async function connectToWS() {
	if (!isConnected()) {
		try {
			await initClientSocket();
			console.log("connected");
		} catch (err) {
			console.error("❌ WebSocket failed:", err);
		}
	}
}

/**
 * Initialize WebSocket connection.
 */
function initClientSocket(): Promise<void> {
	const socketUrl = `wss://${window.location.host}/ws`;
	if (!socket)
		socket = new WebSocket(socketUrl);

	return new Promise(async (resolve, reject) => {
		socket!.onopen = () => resolve();

		socket!.onmessage = async (event) => {
			const userResponse = await fetch("/profile/user");
			const userBox = await userResponse.json();
			if (Result.SUCCESS != userBox.result)
				return;

			const message = JSON.parse(event.data);
			handleServerMessage(userBox.contents, message);
		};

		socket!.onerror = (err) => {
			console.error("❌ WebSocket error occurred:", err);
			reject(err);
		};

		socket!.onclose = (event) => console.warn(`🔌 WebSocket connection closed ${event}`);
	});
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
	return split[0] ?? "/";
}

/*
	Deals with a socket message from the server
*/
function handleServerMessage(user: ShortUser, message: Message) {
	switch (message.type) {
		case MessageType.USER_CONNECT:
		case MessageType.USER_DISCONNECT:
			userConnectOrDisconnect(user, message);
			break;
		case MessageType.USER_INVITE:
			userInvite(user, message);
			break;
		case MessageType.USER_SEND_USER_CHAT:
			userSendUserChat(user, message);
			break;

		case MessageType.GAME_LIST_CHANGED:
			updateMatchList(user);
			break;

		case MessageType.MATCH_LOBBY_CHANGED:
			updateMatchLobby(user, message);
			break;
		case MessageType.MATCH_OVER:
			matchFinishing(user, message);
			break;
		case MessageType.MATCH_READY:
			startingMatch(user);
			break;
		case MessageType.MATCH_START:
			actuallyStartingMatch(user, message);
			break;
		case MessageType.MATCH_UPDATE:
			updateMatchDetails(user, message);
			break;
		case MessageType.MATCH_GOAL:
			updateMatchDetails(user, message);
			break;
		case MessageType.MATCH_RESET:
			updateMatchDetails(user, message);
			break;
		case MessageType.MATCH_END:
			updateMatchDetails(user, message);
			break;

		// Tournament messages
		case MessageType.TOURNAMENT_CHAT:
			tournamentChat(user, message);
			break;
		case MessageType.TOURNAMENT_JOIN:
			joinOrLeaveTournament(user, message);
			break;
		case MessageType.TOURNAMENT_LEAVE:
			joinOrLeaveTournament(user, message);
			break;
		case MessageType.TOURNAMENT_MATCH_START:
			tournamentMatchStart(user, message);
			break;
		case MessageType.TOURNAMENT_OVER:
			tournamentOver(user, message);
			break;
		case MessageType.TOURNAMENT_UPDATE:
			updateTournamentDetails(user, message);
			break;
	}
}
