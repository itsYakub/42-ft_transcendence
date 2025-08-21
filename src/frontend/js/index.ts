import { friendsFunctions } from "./account/friends.js";
import { navbarFunctions } from "./navbar.js";
import { accountFunctions } from "./account/account.js";
import { devButtons } from "./devButtons.js";
import { translateFrontend, translationFunctions } from "./user/translations.js";
import { localMatchFunctions } from "./game/localMatch.js";
import { gameFunctions } from "./game/game.js";
import { authFunctions } from "./user/auth.js";
import { usersFunctions } from "./account/users.js";
import { matchFunctions } from "./game/match.js";
import { registerEvents, navigated } from "./events.js";
import { localTournamentFunctions } from "./game/localTournament.js";
import { tournamentFunctions } from "./game/tournament.js";
import { blockedFunctions } from "./account/blocked.js";

/*
	Simulates moving to a new page
*/
export async function navigate(url: string, updateHistory: boolean = true): Promise<void> {
	if (updateHistory)
		history.pushState(null, null, url);

	const response = await fetch(url);
	const body = await response.text();
	const start = body.indexOf("<body>");
	const end = body.indexOf("</body>") + 7;

	document.querySelector('body').innerHTML = body.substring(start, end);
	addFunctions();
	navigated({ page: url });
}

/*
	Hooks up the window events
*/
registerEvents();

/*
	Sets up all the listeners after navigating to a new page
*/
export function addFunctions() {
	navbarFunctions();
	tournamentFunctions();
	localTournamentFunctions();
	translationFunctions();
	accountFunctions();
	usersFunctions();
	friendsFunctions();
	blockedFunctions();
	gameFunctions();
	localMatchFunctions();
	matchFunctions();
	authFunctions();

	// remove!
	devButtons();
}

/*
	Shows the (improved?) alert dialog
*/
export function showAlert(message: string) {
	const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
	if (alertDialog) {
		const closeAlertButton = document.querySelector("#closeAlertButton");
		closeAlertButton.addEventListener("click", () => {
			alertDialog.close();
		});
		const content = translateFrontend(message);
		document.querySelector("#alertContent").textContent = content;
		alertDialog.showModal();
	}
}
