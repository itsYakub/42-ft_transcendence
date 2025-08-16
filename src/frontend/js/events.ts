
import { navigate } from "./index.js";

interface navigatedDetail {
	page: string
}

interface userLoggedInDetail {
	userID: number,
	nick: string
}

interface joinedRoomEventDetail {
	userID: number,
	roomID: string
}

interface leftRoomEventDetail {
	userID: number
}

export async function navigated(detail: navigatedDetail) {
	const userResponse = await fetch("/user/id");
	const json = await userResponse.json();
	if (200 == json.code && 0 == json.online) {
		const params: userLoggedInDetail = {
				userID: json.id,
				nick: json.nick
		}

		const event = new CustomEvent("onLoggedIn", {
			detail: params
		});
		window.dispatchEvent(event);
	}
}

export function userJoinedRoom(detail: joinedRoomEventDetail) {
	const event = new CustomEvent("onRoomJoined", {
		detail
	});

	window.dispatchEvent(event);
}

export function userLeftRoom(detail: leftRoomEventDetail) {
	const event = new CustomEvent("onRoomLeft", {
		detail
	})

	window.dispatchEvent(event);
	// need to delete room chats when room is empty
}

export function registerEvents() {

	/*
		A user has changed the page
	*/
	window.addEventListener("onNavigated", (e: CustomEvent) => {
		// const data = <HTMLElement>document.querySelector("#data");
		// if (data) {
		// 	const userID = parseInt(data.dataset.id);
		// 	const roomID = data.dataset.room;
		// 	if (window.location.pathname.includes("/tournament/") || window.location.pathname.includes("/match/")) {
		// 		userJoinedRoom({
		// 			userID,
		// 			roomID
		// 		});
		// 	}
		// 	else
		// 		userLeftRoom({ userID });
		// }
	});

	/*
		A user has navigated to a room
	*/
	window.addEventListener("onRoomJoined", (e: CustomEvent) => {
		console.log(`${e.detail.userID} has joined room ${e.detail.roomID}`);
	});

	/*
		A user has navigated away from a room
	*/
	window.addEventListener("onRoomleft", (e: CustomEvent) => {
		console.log(`${e.detail.userID} has left the room`);
	});

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
