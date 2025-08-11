import { startMatch } from "./game.js";
import { navigate, showAlert } from "./index.js";

async function generateTournament(names: string[]): Promise<string> {
	const code = Date.now().toString(36).substring(4);
	const shuffled = names.sort(() => Math.random() - 0.5);
	const response = await fetch("/tournament/add", {
		method: "POST",
		body: JSON.stringify({
			code,
			m1p1: shuffled[0],
			m1p2: shuffled[1],
			m2p1: shuffled[2],
			m2p2: shuffled[3]
		})
	});

	const json = await response.json();
	if (!json.error)
		return code;
	else
		return "ERR_BAD_TOURNAMENT";
}

export function tournamentFunctions() {

	const nextMatchButton = <HTMLButtonElement>document.querySelector("#nextMatchButton");
	if (nextMatchButton) {
		nextMatchButton.addEventListener("click", async () => {
			startMatch(nextMatchButton.dataset.p1, nextMatchButton.dataset.p2);
		});
	}

	const form = <HTMLFormElement>document.querySelector("#newTournamentForm");
	if (form) {
		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			const names = [
				form.p1Name.value,
				form.p2Name.value,
				form.p3Name.value,
				form.p4Name.value
			];

			if(4 != names.filter((n, i) => names.indexOf(n) === i).length) {
				alert("Must be unique!");
				return;
			}
	
			const code = await generateTournament(names);
			if ("ERR_BAD_TOURNAMENT" == code) {
				showAlert("ERR_BAD_TOURNAMENT");
				return;
			}
			navigate(`/tournament/${code}`);
		})
	}
}
