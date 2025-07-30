import { startMatch } from "./game.js";

export function playFunctions() {
	const startSingleGameButton = document.getElementById("startSingleGameButton");
	if (startSingleGameButton) {
		startSingleGameButton.addEventListener("click", () => {
			startMatch("John", "Ed");
		});
	}
}
