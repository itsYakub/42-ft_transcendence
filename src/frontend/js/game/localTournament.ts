import { Box, Page, Result } from "../../../common/interfaces.js";
import { g_game, GameMode } from "../class/game.js";
import { isLoggedIn, showAlert, showPage } from "./../index.js";

async function generateTournament(names: string[]) {
	const gameId = `t${Date.now().toString(36).substring(5)}`;
	const shuffled = names.sort(() => Math.random() - 0.5);
	const response = await fetch("/tournament/add", {
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
			if (!await isLoggedIn())
				return showPage(Page.AUTH);

			const dialog = document.querySelector("#gameDialog");
			if (dialog) {
				dialog.addEventListener("matchOver", async (e: CustomEvent) => {
					const response = await fetch("/tournament/update", {
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
					//if (Result.SUCCESS == await response.text())
					//navigate(window.location.href, false);
				})
			}
			setTimeout(async () => {
				g_game.setupElements(GameMode.GAMEMODE_PVP, {
					nick: this.dataset.g1
				}, {
					nick: this.dataset.g2
				});
			}, 1000);
		});
	}

	const newTournamentForm = <HTMLFormElement>document.querySelector("#localTournamentForm");
	if (newTournamentForm) {
		newTournamentForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			if (!await isLoggedIn())
				return showPage(Page.AUTH);

			const userBoxResponse = await fetch("/profile/user");
			const userBox = await userBoxResponse.json();
			if (Result.SUCCESS == userBox.result) {
				const names = [
					userBox.contents.nick,
					newTournamentForm.g2Nick.value,
					newTournamentForm.g3Nick.value,
					newTournamentForm.g4Nick.value
				];

				if (4 != names.filter((n, i) => names.indexOf(n) === i).length) {
					showAlert(Result.ERR_UNIQUE);
					return;
				}

				const result = await generateTournament(names);
				//TODO show 403 error
				if (Result.SUCCESS != result) {
					showAlert(result);
					return;
				}
				showPage(Page.GAME);
			}
		});
	}
}
