import { friendsFunctions } from "./account/friends.js";
import { navbarFunctions } from "./navbar.js";
import { accountFunctions } from "./account/account.js";
import { devButtons } from "./devButtons.js";
import { localMatchFunctions } from "./game/localMatch.js";
import { gameFunctions } from "./game/game.js";
import { authFunctions } from "./user/auth.js";
import { usersFunctions } from "./users/users.js";
import { matchFunctions } from "./game/match.js";
import { registerEvents, navigated } from "./events.js";
import { localTournamentFunctions } from "./game/localTournament.js";
import { tournamentFunctions } from "./game/tournament.js";
import { foesFunctions } from "./account/foes.js";
import { translateAlert } from "../../common/translations.js";

/*
	Simulates moving to a new page
*/
export async function navigate(page: string, updateHistory: boolean = true): Promise<void> {
	if (updateHistory)
		history.pushState(null, null, page);

	const response = await fetch(page);
	const body = await response.text();
	const start = body.indexOf("<body>");
	const end = body.indexOf("</body>") + 7;

	document.querySelector('body').innerHTML = body.substring(start, end);
	addFunctions();
	navigated();
}

/*
	Hooks up the window events
*/
registerEvents();

/*
	Sets up all the listeners after navigating to a new page
*/
export function addFunctions() {
	accountFunctions();
	authFunctions();
	foesFunctions();
	friendsFunctions();
	gameFunctions();
	matchFunctions();
	navbarFunctions();
	localMatchFunctions();
	localTournamentFunctions();
	tournamentFunctions();
	usersFunctions();

	// remove!
	devButtons();
}

/*
	Shows the (improved?) alert dialog
*/
export function showAlert(text: string) {
	const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
	if (alertDialog) {
		const closeAlertButton = document.querySelector("#closeAlertButton");
		closeAlertButton.addEventListener("click", () => {
			alertDialog.close();
		});
		const content = translateAlert(getLanguage(), text);
		document.querySelector("#alertContent").textContent = content;
		alertDialog.showModal();
	}
}

function getLanguage(): string {
	let language = document.cookie
		.split("; ")
		.find((row) => row.startsWith("language="))
		?.split("=")[1];
	if (!language)
		language = "english";
	return language;
}
