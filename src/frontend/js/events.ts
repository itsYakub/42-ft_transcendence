import { result } from "../../common/interfaces.js";
import { addFunctions, navigate, showAlert } from "./index.js";
import { initChatSocket, isConnected, sendMessageToServer } from "./sockets/socket.js";

interface navigatedDetail {
	page: string
}

interface userLoggedInDetail {
	userID: number,
	nick: string
}

export interface messageDetail {
	toID: string,
	fromID: number,
	message: string
}

export async function navigated(detail: navigatedDetail) {
	const userResponse = await fetch("/user/id");
	const json = await userResponse.json();
	if (result.SUCCESS == json.result) {
		if (!isConnected()) {
			try {
				await initChatSocket();
				sendMessageToServer({
					type: "user-log-in"
				});
			} catch (err) {
				console.error("❌ WebSocket failed:", err);
			}
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
			const date = new Date();
			date.setDate(date.getDate() - 3);

			showAlert("ERR_GOOGLE");
			document.cookie = `googleautherror=false; expires=${date}; Path=/;`;
		}
		addFunctions();
		navigated({ page: window.location.pathname });
	});

	/*
		A match has finished with a winner
	*/
	window.addEventListener("matchOver", async (e: CustomEvent) => {
		if (document.location.href.includes("tournament")) {
			const response = await fetch("/tournament/update", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					code: document.location.href.substring(document.location.href.lastIndexOf('/') + 1),
					p1Score: e.detail.p1Score,
					p2Score: e.detail.p2Score
				})
			});
			const json = await response.json();
			if (!json.error)
				navigate(document.location.href);
		}
		else if (document.location.href.includes("3000/game")) {
			const response = await fetch("/match/add", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					score: e.detail.p1Score,
					p2Score: e.detail.p2Score,
					p2Name: e.detail.p2Name
				})
			});
			const json = await response.json();
			if (!json.error)
				navigate(document.location.href);
		}
	});
}
