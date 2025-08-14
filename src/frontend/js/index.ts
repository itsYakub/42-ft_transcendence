import { friendsFunctions } from "./friends.js";
import { navbarFunctions } from "./navbar.js";
import { profileFunctions } from "./profile.js";
import { devButtons } from "./devButtons.js";
import { translateFrontend, translationFunctions } from "./translations.js";
import { tournamentFunctions } from "./tournament.js";
import { localMatchFunctions } from "./localMatch.js";
import { PlayFunctions } from "./play.js";
import { chatFunctions } from "./chat.js";
import { userFunctions } from "./user.js";
import { MessagesFunctions } from "./messages.js";
import { matchFunctions } from "./match.js";

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
	if (url.includes("/tournament/") || url.includes("/match/"))
		fetch("/user/leave", {
			method: "POST"
		});
	addFunctions();
}

/* 
	Changes page on back/forward buttons
*/
window.addEventListener('popstate', function (event) {
	console.log(event);
	navigate(window.location.pathname, false);
});

/*
	Sets up all the listeners after navigating to a new page
*/
export function addFunctions() {
	navbarFunctions();
	tournamentFunctions();
	translationFunctions();
	profileFunctions();
	friendsFunctions();
	MessagesFunctions();
	PlayFunctions();
	localMatchFunctions();
	matchFunctions();

	userFunctions();

	// sockets
	// chatFunctions();

	// remove!
	devButtons();
}

/*
	Registers the functions and also shows an error if Google sign-in/up was unsuccessful
*/
document.addEventListener("DOMContentLoaded", () => {
	if (-1 != document.cookie.indexOf("googleautherror=true")) {
		const date = new Date();
		date.setDate(date.getDate() - 3);

		showAlert("ERR_GOOGLE");
		document.cookie = `googleautherror=false; expires=${date}; Path=/;`;
	}
	addFunctions();
});

/*
	Marks the user as offline when the url changes
*/
document.addEventListener("beforeunload", (event) => {
	fetch("/user/leave", {
		method: "POST"
	});
});


export function showAlert(message: string) {
	//const alertBanner = document.querySelector("#alertBanner");
	//alertBanner.classList += " hidden";
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

/*
	A match has finished with a winner
*/
document.addEventListener("matchOver", async (e: CustomEvent) => {
	if (document.location.href.includes("tournament")) {
		const response = await fetch("/tournament/update", {
			method: "POST",
			body: JSON.stringify({
				code: document.location.href.substring(document.location.href.lastIndexOf('/') + 1),
				p1Score: e.detail.p1Score,
				p2Score: e.detail.p2Score
			})
		});
		const json = await response.json();
		if (!json.error)
			navigate(document.location.href);
	}
	else if (document.location.href.includes("3000/play")) {
		const response = await fetch("/match/add", {
			method: "POST",
			body: JSON.stringify({
				score: e.detail.p1Score,
				p2Score: e.detail.p2Score,
				p2Name: e.detail.p2Name
			})
		});
		const json = await response.json();
		if (!json.error)
			navigate(document.location.href);
	}
});
