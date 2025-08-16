import { initChatSocket, sendChat } from "./socket.js";

export async function chatFunctions() {
	window.addEventListener("onLoggedIn", async (e: CustomEvent) => {
		console.log("Logged in!", e.detail);
		try {
			await initChatSocket();
			sendChat();
		} catch (err) {
			console.error("❌ WebSocket failed:", err);
		}
	});
}
