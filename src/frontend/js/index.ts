import { navbarFunctions } from "./navbar.js";
import { accountListeners } from "./account.js";
import { devButtons } from "./devButtons.js";
import { gameListeners } from "./game/gamePage.js";
import { authFunctions } from "./auth.js";
import { usersFunctions } from "./users/users.js";
import { localTournamentListeners } from "./game/localTournament.js";
import { translate } from "../../common/translations.js";
import { userChatsFunctions } from "./chat.js";
import { tournamentListeners } from "./game/remoteTournament.js";
import { MessageType, Page, Result } from "../../common/interfaces.js";
import { connectToWS, sendMessageToServer } from "./sockets/clientSocket.js";

/*
	Simulates moving to a new page
*/
export async function showPage(page: Page, add: boolean = true) {
	if (!page)
		page = Page.HOME;
	else
		connectToWS();
	const endpoint = Page.HOME == page ? "/" : `/${page.toLowerCase()}`;
	if (add)
		history.pushState(page, null);

	const response = await fetch(endpoint);
	const body = await response.text();
	const start = body.indexOf("<body>");
	const end = body.indexOf("</body>") + 7;

	document.querySelector('body').innerHTML = body.substring(start, end);
	addListeners();
	const userResponse = await fetch("/profile/user");
			const userBox = await userResponse.json();
	sendMessageToServer({
		fromId: userBox.contents.userId,
		type: MessageType.USER_CONNECT
	});
}

/*
	Hooks up the window events
*/
if (typeof window !== "undefined") {
	/* 
		Changes page on back/forward buttons
	*/
	window.addEventListener
		('popstate', (event) => {
			if (history.state)
				showPage(Page[history.state], false);
		});

	/*
		Registers the functions and also shows an error if Google sign-in/up was unsuccessful
	*/
	window.addEventListener("load", async () => {
		if (-1 != document.cookie.indexOf("googleautherror=true")) {
			showAlert(Result.ERR_GOOGLE);
			document.cookie = `googleautherror=false; expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/;`;
		}
		addListeners();
	});
}

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
