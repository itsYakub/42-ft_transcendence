import { showAlert } from "../index.js";
import { startMatch } from "./game.js";

export function localMatchFunctions() {
	const form = <HTMLFormElement>document.querySelector("#localGameForm");
	if (form) {
		form.addEventListener("submit", async (e) => {
			e.preventDefault();

			if (form.p1Name.value == form.p2Name.value) {
				showAlert("ERR_SAME_NAME");
				return;
			}

			startMatch(form.p1Name.value, form.p2Name.value);
		});
	}
}
