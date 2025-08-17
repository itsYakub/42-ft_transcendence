import { startMatch } from "../play/game.js";
import { currentPage } from "./socket.js";

/*

*/
export function handleRoomMessage(user: any, message: any) {
	switch (message.type) {
		case "room-join":
		case "room-leave":
			roomChange(user, message);
			break;
		case "room-player-ready":
			roomPlayerReady(user, message);
			break;
		case "room-chat":
			roomChat(user, message);
			break;
		case "room-ready":
			roomReady(user, message);
			break;
	}
}

/*
	Determines whether the UI should change for the current client only
*/
function shouldRoomUpdateForMe(user: any, message: any): boolean {
	if (user.id == message.userID)
		return false;

	if (user.roomID != message.roomID)
		return false;

	return "play" == currentPage();
}

/*
	Determines whether the UI should change for every client
*/
function shouldRoomUpdateForAll(user: any, message: any): boolean {
	if (user.roomID != message.roomID)
		return false;

	return "play" == currentPage();
}

/*
	A user has entered or left a room (match/tournament)
*/
async function roomChange(user: any, message: any) {
	if (!shouldRoomUpdateForMe(user, message))
		return;

	const playerResponse = await fetch("/api/players");
	const players = await playerResponse.json();
	if (200 == players.code)
		document.querySelector("#playerMatchReadyForm").innerHTML = players.html;
}

/*
	A user has clicked the Ready button
*/
async function roomPlayerReady(user: any, message: any) {
	if (!shouldRoomUpdateForAll(user, message))
		return;

	const playerResponse = await fetch("/api/players");
	const players = await playerResponse.json();
	if (200 == players.code)
		document.querySelector("#playerMatchReadyForm").innerHTML = players.html;
}

/*
	A chat message has been sent to a room (match/tournament)
*/
async function roomChat(user: any, message: any) {
	if (!shouldRoomUpdateForAll(user, message))
		return;

	const messagesResponse = await fetch("/api/messages");
	const messages = await messagesResponse.json();
	if (200 == messages.code) {
		(document.querySelector("#sendMatchMessageForm") as HTMLFormElement).message.value = "";
		document.querySelector("#messagesDiv").innerHTML = messages.html;
	}
}

async function roomReady(user: any, message: any) {
	if (!shouldRoomUpdateForAll(user, message))
		return;

	startMatch("John", "Ed");
}
