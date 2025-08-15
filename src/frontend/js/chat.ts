import { initChatSocket } from "./socket.js";

export async function chatFunctions() {
	try {
		await initChatSocket();
	} catch (err) {
		console.error("❌ WebSocket failed:", err);
	}
	document.addEventListener("onLoggedIn", async (e: CustomEvent) => {
		console.log("Logged in!", e.detail);

	});

	document.addEventListener("onNavigate", async (e: CustomEvent) => {

	});
}
