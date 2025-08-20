import { handleIncomingUserMessage } from "./userSockets.js";
import { handleIncomingGameMessage } from "./gamesSockets.js";

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
			const userResponse = await fetch("/user/id");
			const user = await userResponse.json();
			if (200 != user.code)
				return;

			const message = JSON.parse(event.data);
			handleMessage(user, message);
		};

		socket!.onerror = (err) => {
			console.error("❌ WebSocket error occurred:", err);
			reject(err);
		};

		socket!.onclose = (event) => {
			console.warn(`🔌 WebSocket connection closed (code: ${event.code})`);
			setTimeout(initChatSocket, 1000);
		};
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
export function sendMessageToServer(message: any) {
	if (socket && socket.OPEN)
		socket.send(JSON.stringify(message));
}

export function currentPage(): string {
	const split = window.location.pathname.split("/").filter(n => n);
	return split[0];
}

/*
	Deals with the message
*/
function handleMessage(user: any, message: any) {
	//if (message.type.startsWith("error-"))
	//	handleIncomingErrorMessage(user, message);

	if (message.type.startsWith("game-"))
		handleIncomingGameMessage(user, message);

	if (message.type.startsWith("user-"))
		handleIncomingUserMessage(user, message);
}
