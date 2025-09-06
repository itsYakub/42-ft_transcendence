import { navbarFunctions } from "./navbar.js";
import { accountListeners } from "./user/account.js";
import { devButtons } from "./devButtons.js";
import { gameListeners } from "./game/gamePage.js";
import { authFunctions } from "./user/loggedOut.js";
import { usersFunctions } from "./users/users.js";
import { registerEvents, navigated } from "./events.js";
import { localTournamentListeners } from "./game/localTournament.js";
import { translate } from "../../common/translations.js";
import { userChatsFunctions } from "./user/userChats.js";
import { tournamentListeners } from "./game/remoteTournament.js";

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
	addListeners();
	navigated();
}

export function showHomePage() {

}

export async function showFoesPage(add: boolean = true) {
	if (add) {
		history.pushState("foes", null);
	}
	const response = await fetch("/foes");
	const body = await response.text();
	const start = body.indexOf("<body>");
	const end = body.indexOf("</body>") + 7;

	document.querySelector('body').innerHTML = body.substring(start, end);
	addListeners();
}

export async function showFriendsPage(add: boolean = true) {
	if (add) {
		history.pushState("friends", null);
	}
	const response = await fetch("/friends");
	const body = await response.text();
	const start = body.indexOf("<body>");
	const end = body.indexOf("</body>") + 7;

	document.querySelector('body').innerHTML = body.substring(start, end);
	addListeners();
}

export async function showUsersPage(add: boolean = true) {
	if (add) {
		history.pushState("users", null);
	}
	const response = await fetch("/users");
	const body = await response.text();
	const start = body.indexOf("<body>");
	const end = body.indexOf("</body>") + 7;

	document.querySelector('body').innerHTML = body.substring(start, end);
	addListeners();
}

/*
	Hooks up the window events
*/
registerEvents();

/*
	Sets up all the listeners after navigating to a new page
*/
export function addListeners() {
	accountListeners();
	authFunctions();
	gameListeners();
	navbarFunctions();
	localTournamentListeners();
	tournamentListeners();
	userChatsFunctions();
	usersFunctions();

	// remove!
	devButtons();
}

/*
	Shows the (improved?) alert dialog
*/
export function showAlert(text: string, shouldTranslate: boolean = true) {
	const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
	if (alertDialog) {
		const closeAlertButton = document.querySelector("#closeAlertButton");
		closeAlertButton.addEventListener("click", () => {
			alertDialog.close();
		});

		const content = shouldTranslate ? translate(getLanguage(), `%%${text}%%`) : text;
		document.querySelector("#alertContent").textContent = content;
		alertDialog.showModal();
	}
}

export function getLanguage(): string {
	let language = document?.cookie
		.split("; ")
		.find((row) => row.startsWith("language="))
		?.split("=")[1];
	if (!language)
		language = "english";
	return language;
}
