import { Box, Result } from "../../../common/interfaces.js";
import { g_game, GameMode } from "../class/game.js";
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

	return await response.text();
}

export function localTournamentListeners() {

	const nextTournamentMatchButton = <HTMLButtonElement>document.querySelector("#nextTournamentMatchButton");
	if (nextTournamentMatchButton) {
		nextTournamentMatchButton.addEventListener("click", async function () {
			const dialog = document.querySelector("#gameDialog");
			if (dialog) {
				dialog.addEventListener("matchOver", async (e: CustomEvent) => {
					const response = await fetch("/api/tournament/update", {
						method: "POST",
						headers: {
							"content-type": "application/json"
						},
						body: JSON.stringify({
							g1Nick: this.dataset.g1,
							g2Nick: this.dataset.g2,
							g1Score: e.detail["g1Score"],
							g2Score: e.detail["g2Score"],
							matchNumber: this.dataset.match
						})
					});
					if (Result.SUCCESS == await response.text())
						navigate("/game");
				})
			}
			setTimeout(async () => {
				g_game.setupElements(GameMode.GAMEMODE_PVP, {
					nick: "John"
				});
			}, 1000);
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

				if (Result.SUCCESS != await generateTournament(names)) {
					showAlert(Result.ERR_BAD_TOURNAMENT);
					return;
				}
				navigate("/game");
			}
		});
	}
}
