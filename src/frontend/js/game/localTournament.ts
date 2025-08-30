import { Box, Result } from "../../../common/interfaces.js";
import { navigate, showAlert } from "./../index.js";

async function generateTournament(names: string[]) {
	const gameId = `t${Date.now().toString(36).substring(5)}`;
	const shuffled = names.sort(() => Math.random() - 0.5);
	const response = await fetch("/api/tournament/add", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			gameId,
			gamers: shuffled
		})
	});

	const json = await response.text();
	console.log(json);
	return json;
}

export function localTournamentListeners() {

	const nextMatchButton = <HTMLButtonElement>document.querySelector("#nextMatchButton");
	if (nextMatchButton) {
		nextMatchButton.addEventListener("click", async () => {
			//TODO change this
			//startMatch(null);//nextMatchButton.dataset.p1, nextMatchButton.dataset.p2);
		});
	}

	const newTournamentForm = <HTMLFormElement>document.querySelector("#localTournamentForm");
	if (newTournamentForm) {
		newTournamentForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const userBoxResponse = await fetch("/api/user");
			const userBox = await userBoxResponse.json();
			if (Result.SUCCESS == userBox.result) {
				const names = [
					userBox.user.nick,
					newTournamentForm.g2Name.value,
					newTournamentForm.g3Name.value,
					newTournamentForm.g4Name.value
				];

				if (4 != names.filter((n, i) => names.indexOf(n) === i).length) {
					showAlert(Result.ERR_UNIQUE);
					return;
				}

				const code = await generateTournament(names);
				if (Result.SUCCESS != code) {
					showAlert(Result.ERR_BAD_TOURNAMENT);
					return;
				}
				navigate("/game");
			}
		});
	}
}
