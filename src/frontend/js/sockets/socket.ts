import { handleIncomingUserMessage } from "./userSockets.js";
import { handleIncomingGameMessage } from "./gamesSockets.js";
import { Result, User, WebsocketGameMessage, WebsocketMessage, WebsocketMessageGroup } from "../../../common/interfaces.js";

let socket: WebSocket | null = null;

/**
 * Initialize WebSocket connection.
 */
export function initChatSocket(): Promise<void> {
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
			handleMessage(userBox.user, message);
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
export function sendMessageToServer<Type extends WebsocketMessage>(message: Type) {
	if (1 == socket?.OPEN)
		socket.send(JSON.stringify(message));
}

export function currentPage(): string {
	const split = window.location.pathname.split("/").filter(n => n);
	return split[0];
}

/*
	Deals with the message
*/
function handleMessage(user: User, message: WebsocketMessage) {
	//if (WebsocketMessageGroup.ERROR == message.group)
	//	handleIncomingErrorMessage(user, message);

	if (WebsocketMessageGroup.GAME == message.group)
		handleIncomingGameMessage(user, message as WebsocketGameMessage);

	if (WebsocketMessageGroup.USER == message.group)
		handleIncomingUserMessage(user, message);
}
