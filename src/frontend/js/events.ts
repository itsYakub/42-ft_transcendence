import { MessageType, Result } from "../../common/interfaces.js";
import { addListeners, navigate, showAlert } from "./index.js";
import { currentPage, initClientSocket, isConnected, sendMessageToServer } from "./sockets/clientSocket.js";

export async function navigated() {
	const userResponse = await fetch("/api/user");
	const json = await userResponse.json();
	if (Result.SUCCESS == json.result) {
		if (!isConnected()) {
			try {
				await initClientSocket();
				sendMessageToServer({
					type: MessageType.USER_CONNECT,
				});
			} catch (err) {
				console.error("❌ WebSocket failed:", err);
			}
		}

		if ("game" != currentPage()) {
			if (json.user.gameId?.startsWith("m"))
				sendMessageToServer({
					type: MessageType.MATCH_LEAVE
				});
			sendMessageToServer({
				type: MessageType.USER_UNREADY
			});
		}
	}
}

export function registerEvents() {
	/* 
		Changes page on back/forward buttons
	*/
	window.addEventListener('popstate', function (event) {
		navigate(window.location.pathname, false);
	});

	/*
		Registers the functions and also shows an error if Google sign-in/up was unsuccessful
	*/
	window.addEventListener("DOMContentLoaded", () => {
		if (-1 != document.cookie.indexOf("googleautherror=true")) {
			//const date = new Date();
			//date.setDate(date.getDate() - 3);

			showAlert("ERR_GOOGLE");
			//document.cookie = `googleautherror=false; expires=${date}; Path=/;`;
			document.cookie = `googleautherror=false; expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/;`;
		}
		addListeners();
		navigated();
	});

	/*
		A match has finished with a winner
	*/
	// window.addEventListener("matchOver", async (e: CustomEvent) => {
	// 	if (document.location.href.includes("tournament")) {
	// 		const response = await fetch("/tournament/update", {
	// 			method: "POST",
	// 			headers: {
	// 				"content-type": "application/json"
	// 			},
	// 			body: JSON.stringify({
	// 				code: document.location.href.substring(document.location.href.lastIndexOf('/') + 1),
	// 				p1Score: e.detail.p1Score,
	// 				p2Score: e.detail.p2Score
	// 			})
	// 		});
	// 		const json = await response.json();
	// 		if (!json.error)
	// 			navigate(document.location.href);
	// 	}
	// 	else if (document.location.href.includes("3000/game")) {
	// 		const response = await fetch("/match/add", {
	// 			method: "POST",
	// 			headers: {
	// 				"content-type": "application/json"
	// 			},
	// 			body: JSON.stringify({
	// 				score: e.detail.p1Score,
	// 				p2Score: e.detail.p2Score,
	// 				p2Name: e.detail.p2Name
	// 			})
	// 		});
	// 		const json = await response.json();
	// 		if (!json.error)
	// 			navigate(document.location.href);
	// 	}
	// });
}
