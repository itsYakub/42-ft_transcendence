import { Gamer, Result, WebsocketMessageGroup, WebsocketMessageType } from "../../../common/interfaces.js";
import { navigate, showAlert } from "../index.js";
import { sendMessageToServer } from "../sockets/socket.js";

export async function generateTournament() {
	const response = await fetch("/api/tournament/gamers");
	const json = await response.json();
	if (Result.SUCCESS == json.result) {
		const gamers = shuffleGamers(json.contents);
		await fetch("/api/tournament/add", {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify({
				gamers
			})
		});
	}
}

function shuffleGamers(gamers: Gamer[]): Gamer[] {
	let players = [
		0, 1, 2, 3
	];

	players = players.sort(() => Math.random() - 0.5);
	return [
		gamers[players[0]],
		gamers[players[1]],
		gamers[players[2]],
		gamers[players[3]]
	];
}
