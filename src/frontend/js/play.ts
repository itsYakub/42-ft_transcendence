import { join } from "path";
import { navigate, showAlert } from "./index.js";

export function PlayFunctions() {
	const localMatchButton = document.querySelector("#localMatchButton");
	if (localMatchButton) {
		localMatchButton.addEventListener("click", () => {
			navigate("/match/local")
		});
	}

	const aiMatchButton = document.querySelector("#aiMatchButton");
	if (aiMatchButton) {
		aiMatchButton.addEventListener("click", () => {
			//navigate("/match/local")
		});
	}
	
	const remoteMatchButton = document.querySelector("#remoteMatchButton");
	if (remoteMatchButton) {
		remoteMatchButton.addEventListener("click", async () => {
			const roomID = `m${Date.now().toString(36).substring(5)}`;
			const response = await fetch(`/play/new`, {
				method: "POST",
				body: JSON.stringify({
					roomID
				})
			});
			const json = await response.json();
			if (200 == json.code)
				navigate(`/match/${roomID}`);
			else
				showAlert("ERR_DB");
		});
	}

	const localTournamentButton = document.querySelector("#localTournamentButton");
	if (localTournamentButton) {
		localTournamentButton.addEventListener("click", () => {
			navigate("/tournament/local")
		});
	}

	const remoteTournamentButton = document.querySelector("#remoteTournamentButton");
	if (remoteTournamentButton) {
		remoteTournamentButton.addEventListener("click", async () => {
			const roomID = `t${Date.now().toString(36).substring(5)}`;
			const response = await fetch(`/play/new`, {
				method: "POST",
				body: JSON.stringify({
					roomID
				})
			});
			const json = await response.json();
			if (200 == json.code)
				navigate(`/tournament/${roomID}`);
			else
				showAlert("ERR_DB");
		});
	}

	const joinRoomButtons = document.getElementsByClassName("joinRoomButton");
	for (var i = 0; i < joinRoomButtons.length; i++) {
		joinRoomButtons[i].addEventListener("click", async function() {
			this.dataset.type == "tournament" ? navigate(`/tournament/${this.dataset.id}`) : navigate(`/match/${this.dataset.id}`);
		})
	}
}
