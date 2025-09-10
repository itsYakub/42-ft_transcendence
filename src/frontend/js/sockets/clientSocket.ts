import { Message, MessageType, Page, Result, ShortUser } from "../../../common/interfaces.js";
import { showPage } from "../index.js";
import { actuallyStartingMatch,	matchFinishing,	startingMatch,	updateMatchDetails,	updateMatchList, updateMatchLobby } from "./remoteMatchesMessages.js";
import { tournamentMatchStart, updateTournamentDetails, updateTournamentLobby } from "./remoteTournamentsMessages.js";
import { userInvite, userSendUserChat } from "./userMessages.js";

let socket: WebSocket;

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

export async function closess() {
	console.log("closing socket");
	socket.close();
	socket = null;
	await fetch("/auth/logout", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({})
	});
	showPage(Page.AUTH);
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
			const userBox = await fetch("/profile/user");
			const json = await userBox.json();
			if (Result.SUCCESS != json.result)
				return;

			const message = JSON.parse(event.data);
			handleServerMessage(message, json.contents);
		};

		socket!.onerror = (err) => {
			console.error("❌ WebSocket error occurred:", err);
			reject(err);
		};

		socket!.onclose = (event) => console.warn(`🔌 WebSocket connection closed ${event}`);
	});
}

/*
	Checkes whether it's safe to use the socket
*/
export function isConnected(): boolean {
	return socket && 1 == socket.readyState;
}

/*
	Sends a message from a client to the server
*/
export async function sendMessageToServer(message: Message) {
	if (1 == socket?.OPEN) {
		socket.send(JSON.stringify(message));
		// const userBox = await fetch("/profile/user");
		// const json = await userBox.json();
		// if (Result.SUCCESS == json.result) {
		// 	message.fromId = json.contents.userId;
		// 	socket.send(JSON.stringify(message));
		// }
	}
}

/*
	Grabs the current page (ACCOUNT, AUTH, CHAT, FOES, FRIENDS, GAME, USERS) from the HTML
*/
export function currentPage(): Page {
	const navBar = <HTMLElement>document.querySelector("#navBar");
	return Page[navBar.dataset.page];
}

/*
	Deals with a socket message from the server
*/
function handleServerMessage(message: Message, user: ShortUser) {
	switch (message.type) {
		case MessageType.USER_INVITE:
			userInvite(message);
			break;
		case MessageType.USER_SEND_USER_CHAT:
			userSendUserChat(message);
			break;

		case MessageType.GAME_LIST_CHANGED:
			updateMatchList(user);
			break;

		case MessageType.MATCH_LOBBY_CHANGED:
			updateMatchLobby(message);
			break;
		case MessageType.MATCH_OVER:
			matchFinishing();
			break;
		case MessageType.MATCH_READY:
			startingMatch();
			break;
		case MessageType.MATCH_START:
			actuallyStartingMatch();
			break;
		case MessageType.MATCH_UPDATE:
		case MessageType.MATCH_GOAL:
		case MessageType.MATCH_RESET:
		case MessageType.MATCH_END:
			updateMatchDetails(message);
			break;

		// Tournament messages
		case MessageType.TOURNAMENT_LOBBY_CHANGED:
			updateTournamentLobby(message);
			break;
		// case MessageType.TOURNAMENT_CHAT:
		// 	tournamentChat(user, message);
		// 	break;
		case MessageType.TOURNAMENT_MATCH_START:
			tournamentMatchStart(message);
			break;
		// case MessageType.TOURNAMENT_OVER:
		// 	tournamentOver(user, message);
		// 	break;
		case MessageType.TOURNAMENT_UPDATE:
			updateTournamentDetails(message);
			break;
	}
}
