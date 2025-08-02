import { startMatch } from "./game.js";

export function playFunctions() {
	const form = <HTMLFormElement>document.getElementById("singleGameForm");
	if (form) {
		form.addEventListener("submit", async (e) => {
			e.preventDefault();

			if (form.p1Name.value == form.p2Name.value) {
				alert("Must be unique!");
				return;
			}

			startMatch(form.p1Name.value, form.p2Name.value);
		})
	}
}
