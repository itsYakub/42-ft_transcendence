import { navigate } from "./index.js";

interface joinedRoomEventDetails {
	userID: number,
	roomID: string
}

interface leftRoomEventDetails {
	userID: number
}

export function userJoinedRoom(detail: joinedRoomEventDetails) {
	const event = new CustomEvent("onRoomJoined", {
		detail
	})

	window.dispatchEvent(event);
}

export function userLeftRoom(detail: leftRoomEventDetails) {
	const event = new CustomEvent("onRoomLeft", {
		detail
	})

	window.dispatchEvent(event);
	// need to delete room chats when room is empty
}

export function registerEvents() {

	/*
		A user has navigated to a room
	*/
	document.addEventListener("onRoomJoined", (e: CustomEvent) => {
		console.log(`${e.detail.userID} has joined room ${e.detail.roomID}`);
	});

	/*
		A user has navigated away from a room
	*/
	document.addEventListener("onRoomleft", (e: CustomEvent) => {
		console.log(`${e.detail.userID} has left the room`);
	});

	/*
		A match has finished with a winner
	*/
	document.addEventListener("matchOver", async (e: CustomEvent) => {
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
