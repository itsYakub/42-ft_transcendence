import { Box, Page, Result } from "../../../common/interfaces.js";
import { g_game, GameMode } from "../class/game.js";
import { isLoggedIn, showAlert, showPage } from "./../index.js";

async function generateTournament(names: string[]) {
	const shuffled = names.sort(() => Math.random() - 0.5);
	const response = await fetch("/tournament/local/add", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			gamers: shuffled
		})
	});

	const text = await response.text();
	if (text.includes("403 Forbidden")) {
		return Result.ERR_FORBIDDEN_NAME;
	}

	return text;
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
					const response = await fetch("/tournament/local/update", {
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
						showPage(Page.GAME);
				})
			}
			setTimeout(async () => {
				g_game.setupElements(GameMode.GAMEMODE_PVP, {
					nick: this.dataset.g1
				}, {
					nick: this.dataset.g2
				});
			}, 500);
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
		
				if (Result.SUCCESS != result) {
					showAlert(result);
					return;
				}
				showPage(Page.GAME);
			}
		});
	}
}
