import { navigate } from "./index.js";
import { getSocket } from "./socket.js";

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
	if (200 == json.code) {
		if (0 == json.online) {
			const params: userLoggedInDetail = {
				userID: json.id,
				nick: json.nick
			}

			const event = new CustomEvent("onLoggedIn", {
				detail: params
			});
			window.dispatchEvent(event);
		}

		const split = detail.page.split("/").filter(n => n);
		if (2 == split.length && 4 == split[1].length) {
			if (("match" == split[0] && split[1].startsWith("m")) || ("tournament" == split[0] && split[1].startsWith("t"))) {
				const event = new CustomEvent("onRoomJoined", {
					detail: {
						userID: json.id,
						roomID: split[1]
					}
				});
				window.dispatchEvent(event);
				const socket = getSocket();
				if (socket)
					socket.send(JSON.stringify({
						type: "room-join",
						userID: json.id,
						roomID: split[1]
					}));

				return;
			}
		}
		// if (json.roomID)
		// 	await fetch("/user/leave", {
		// 		method: "POST"
		// 	});
	}
}

export function registerEvents() {
	/*
		A match has finished with a winner
	*/
	window.addEventListener("matchOver", async (e: CustomEvent) => {
		if (document.location.href.includes("tournament")) {
			const response = await fetch("/tournament/update", {
				method: "POST",
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
		else if (document.location.href.includes("3000/play")) {
			const response = await fetch("/match/add", {
				method: "POST",
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
