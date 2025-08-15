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
	const socketUrl = `wss://${window.location.host}/ws`;

	if (!socket)
		socket = new WebSocket(socketUrl);

	return new Promise((resolve, reject) => {
		socket!.onopen = () => {
			console.log("✅ WebSocket connection opened (state: OPEN)");
			(window as any).socket = socket; // ✅ attach to global for DevTools
			resolve();
		};

		socket!.onmessage = (event) => {
			let msg;
			try {
				msg = JSON.parse(event.data);
			} catch (err) {
				console.warn("⚠️ Failed to parse WebSocket message:", event.data);
				return;
			}

			if (msg.type === 'chat') {
				displayMessage(msg.from, msg.text);
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
export function sendChat(to: string, text: string) {
	const s = getSocket();
	if (!s) {
		console.warn("❌ Cannot send message — WebSocket not initialized");
		return;
	}
	console.log("📤 Sending chat message:", { to, text });
	s.send(JSON.stringify({ type: 'chat', to, text }));
}

// /**
//  * Send a game invite.
//  */
// export function inviteToGame() {
// 	const s = getSocket();
// 	if (!s) {
// 		console.warn("❌ Cannot send invite — WebSocket not initialized");
// 		return;
// 	}
// 	if (s.readyState !== WebSocket.OPEN) {
// 		console.warn(`❌ Cannot send invite — WebSocket not open (state: ${s.readyState})`);
// 		return;
// 	}
// 	console.log("📤 Sending Pong invite");
// 	s.send(JSON.stringify({ type: 'invite' }));
// }

/**
 * Append a message to the chat box.
 */
function displayMessage(from: string, text: string) {
	const chatBox = document.getElementById("chats");
	if (chatBox) {
		const p = document.createElement("p");
		p.textContent = `${from}: ${text}`;
		p.classList = "text-white";
		chatBox.appendChild(p);
		chatBox.scrollTop = chatBox.scrollHeight;
	}
}
