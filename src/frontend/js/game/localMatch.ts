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

			//TODO change this
			startMatch({
				g1: {
					nick: "abc",
					userId: 1
				},
				g2: {
					nick: "def",
					userId: 2
				},
				matchNumber: 1
			});
		});
	}
}
