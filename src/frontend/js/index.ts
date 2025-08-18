import { friendsFunctions } from "./friends.js";
import { navbarFunctions } from "./navbar.js";
import { profileFunctions } from "./profile.js";
import { devButtons } from "./devButtons.js";
import { translateFrontend, translationFunctions } from "./translations.js";
import { localMatchFunctions } from "./localMatch.js";
import { PlayFunctions } from "./play.js";
import { userFunctions } from "./user.js";
import { MessagesFunctions } from "./messages.js";
import { matchFunctions } from "./match.js";
import { registerEvents, navigated } from "./events.js";
import { socketFunctions } from "./socket.js";
import { localTournamentFunctions } from "./localTournament.js";
import { tournamentFunctions } from "./tournament.js";

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
	//raiseNavigationEvent();
	addFunctions();
	navigated({ page: url });
}

// function raiseNavigationEvent() {
// 	const data = <HTMLElement>document.querySelector("#data");
// 	if (data) {
// 		const userID = parseInt(data.dataset.id);
// 		const roomID = data.dataset.room;
// 		if (window.location.pathname.includes("/tournament/") || window.location.pathname.includes("/match/")) {
// 			userJoinedRoom({
// 				userID,
// 				roomID: "abc"
// 			});
// 		}
// 		else
// 			userLeftRoom({ userID });
// 	}
// }

/* 
	Changes page on back/forward buttons
*/
window.addEventListener('popstate', function (event) {
	navigate(window.location.pathname, false);
});

registerEvents();
socketFunctions();

/*
	Sets up all the listeners after navigating to a new page
*/
export function addFunctions() {
	navbarFunctions();
	tournamentFunctions();
	localTournamentFunctions();
	translationFunctions();
	profileFunctions();
	friendsFunctions();
	MessagesFunctions();
	PlayFunctions();
	localMatchFunctions();
	matchFunctions();

	userFunctions();

	// sockets

	// remove!
	devButtons();
}

/*
	Registers the functions and also shows an error if Google sign-in/up was unsuccessful
*/
window.addEventListener("DOMContentLoaded", () => {
	if (-1 != document.cookie.indexOf("googleautherror=true")) {
		const date = new Date();
		date.setDate(date.getDate() - 3);

		showAlert("ERR_GOOGLE");
		document.cookie = `googleautherror=false; expires=${date}; Path=/;`;
	}
	//raiseNavigationEvent();
	addFunctions();
	navigated({ page: window.location.pathname });
});

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

