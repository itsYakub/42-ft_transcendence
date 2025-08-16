let socket: WebSocket | null = null;

/**
 * Returns the active WebSocket instance.
 */
function getSocket(): WebSocket | null {
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

	return new Promise((resolve, reject) => {
		socket!.onopen = () => {
			sendMessageToServer({
				type: "joined"
			});
			resolve();
		};

		socket!.onmessage = (event) => {
			const json = JSON.parse(event.data);
			console.log("Received message", json);
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
export function sendMessageToServer({ type }) {
	const socket = getSocket();
	if (socket)
		socket.send(JSON.stringify({
			type
		}));
}
