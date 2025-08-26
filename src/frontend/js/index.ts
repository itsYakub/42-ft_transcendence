import { navbarFunctions } from "./navbar.js";
import { accountFunctions } from "./user/account.js";
import { devButtons } from "./devButtons.js";
import { gameFunctions } from "./game/game.js";
import { authFunctions } from "./user/loggedOut.js";
import { usersFunctions } from "./users/users.js";
import { lobbyFunctions } from "./game/lobby.js";
import { registerEvents, navigated } from "./events.js";
import { localTournamentFunctions } from "./game/localTournament.js";
import { translate } from "../../common/translations.js";
import { userChatsFunctions } from "./user/userChats.js";

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
	gameFunctions();
	lobbyFunctions();
	navbarFunctions();
	localTournamentFunctions();
	userChatsFunctions();
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
		const content = translate(getLanguage(), text);
		document.querySelector("#alertContent").textContent = content;
		alertDialog.showModal();
	}
}

export function getLanguage(): string {
	let language = document.cookie
		.split("; ")
		.find((row) => row.startsWith("language="))
		?.split("=")[1];
	if (!language)
		language = "english";
	return language;
}
