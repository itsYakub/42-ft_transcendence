import { navigate } from "./index.js";

let socket: WebSocket | null = null;

/**
 * Returns the active WebSocket instance.
 */
export function getSocket(): WebSocket | null {
	return socket;
}

export async function socketFunctions() {
	window.addEventListener("onLoggedIn", async (e: CustomEvent) => {
		console.log("Logged in!", e.detail);
		try {
			await initChatSocket();
		} catch (err) {
			console.error("❌ WebSocket failed:", err);
		}
	});
}

/**
 * Initialize WebSocket connection for chat.
 */
export function initChatSocket(): Promise<void> {
	const socketUrl = `wss://${window.location.host}/ws`;

	if (!socket)
		socket = new WebSocket(socketUrl);

	return new Promise(async (resolve, reject) => {
		socket!.onopen = () => {
			// sendMessageToServer({
			// 	type: "joined",
			// 	message: {}
			// });
			resolve();
		};

		socket!.onmessage = async (event) => {
			const userResponse = await fetch("/user/id");
			const user = await userResponse.json();
			const json = JSON.parse(event.data);
			if (user.id != json.userID) {
				if (user.roomID == json.roomID) {
					switch (json.type) {
						case "room-message":
						case "room-join":
						case "room-ready":
							navigate(window.location.href);
							break;
					}
				}
				else if ("/play" == window.location.pathname) {
					switch (json.type) {
						case "room-join":
							navigate(window.location.href);
							break;
					}
				}
			}
		};

		socket!.onerror = (err) => {
			console.error("❌ WebSocket error occurred:", err);
			reject(err);
		};

		socket!.onclose = (event) => {
			console.warn(`🔌 WebSocket connection closed (code: ${event.code}, reason: ${event.reason})`);
		};
	});
}

/**
 * Send a message to a recipient.
 */
export function sendMessageToServer({ type, message }) {
	const socket = getSocket();
	if (socket)
		socket.send(JSON.stringify({
			type,
			message
		}));
}
