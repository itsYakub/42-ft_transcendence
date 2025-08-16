let socket: WebSocket | null = null;

/**
 * Returns the active WebSocket instance.
 */
function getSocket(): WebSocket | null {
	return socket;
}

/**
 * Initialize WebSocket connection for chat.
 */
export function initChatSocket(): Promise<void> {
	//const socketUrl = `wss://transcendence.nip.io:3000/ws`;
const socketUrl = `wss://${window.location.host}/ws`;

	if (!socket)
		socket = new WebSocket(socketUrl);

	return new Promise((resolve, reject) => {
		socket!.onopen = () => {
			console.log("✅ WebSocket connection opened (state: OPEN)");
			resolve();
		};

		socket!.onmessage = (event) => {
			console.log("client message received");
			let msg;
			try {
				msg = JSON.parse(event.data);
			} catch (err) {
				console.warn("⚠️ Failed to parse WebSocket message:", event.data);
				return;
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
 * Send a chat message to a recipient.
 */
export function sendChat() {
	const s = getSocket();
	s.send(JSON.stringify({ type: 'chat'}));
}
