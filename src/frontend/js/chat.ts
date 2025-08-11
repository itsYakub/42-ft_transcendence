import { initChatSocket, sendChat } from "./socket.js";

export async function chatFunctions() {
	const sendBtn = document.getElementById("sendMessageButton");
	if (sendBtn) {
		sendBtn.addEventListener("click", () => {
			sendChat("John", "hello");
		});
	}

	try {
		await initChatSocket("Ed");
	} catch (err) {
		console.error("❌ WebSocket failed:", err);
	}
	
}
