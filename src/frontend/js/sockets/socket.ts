import { handlePrivateChatMessage } from "./private_chats.js";
import { handleRoomMessage } from "./rooms.js";

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
	if (socket && 1 === socket.OPEN)
		socket.send(JSON.stringify(message));
}

/*
	Deals with the message
*/
function handleMessage(user: any, message: any) {
	if (message.type.startsWith("room-"))
		handleRoomMessage(user, message);

	if (message.type.startsWith("user-"))
		handlePrivateChatMessage(user, message);
}

export function currentPage(): string {
	const split = window.location.pathname.split("/").filter(n => n);
	return split[0];
}
