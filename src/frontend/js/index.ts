import { friendsFunctions } from "./friends.js";
import { googleFunctions } from "./googleAuth.js";
import { loginFunctions } from "./login.js";
import { pageButtons } from "./pages.js";
import { profileFunctions } from "./profile.js";
import { registerFunctions } from "./register.js";
import { devButtons } from "./devButtons.js";
import { translateFrontend, translations } from "./translations.js";
import { tournamentFunctions } from "./tournament.js";
import { playFunctions } from "./play.js";

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
}

/* 
	Changes page on back/forward buttons
*/
window.addEventListener('popstate', function (event) {
	navigate(window.location.pathname, false);
});

/*
	Sets up all the listeners after navigating to a new page
*/
export function addFunctions() {
	pageButtons();
	tournamentFunctions();
	translations();
	profileFunctions();
	friendsFunctions();
	loginFunctions();
	registerFunctions();
	googleFunctions();
	playFunctions();

	// remove!
	devButtons();
}

/*
	Registers the functions and also shows an error if Google sign-in/up was unsuccessful
*/
window.addEventListener("DOMContentLoaded", () => {
	addFunctions();
	if (-1 != document.cookie.indexOf("googleautherror=true")) {
		const date = new Date();
		date.setDate(date.getDate() - 3);

		showAlert("ERR_GOOGLE");
		document.cookie = `googleautherror=false; expires=${date}; Path=/;`;
	}
});

/*
	Marks the user as offline when the url changes
*/
window.addEventListener("beforeunload", (event) => {
	fetch("/user/leave", {
		method: "POST"
	});
});

export function showAlert(message: string) {
	const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
	if (alertDialog) {
		const closeAlertButton = document.querySelector("#closeAlertButton");
		closeAlertButton.addEventListener("click", () => {
			alertDialog.close();
		});
		const alertShim = <HTMLDialogElement>document.getElementById("alertShim");
		const content = translateFrontend(message);
		document.querySelector("#alertContent").textContent = content;
		alertDialog.addEventListener("close", (e) => {
			alertShim.close();
		});
		alertShim.showModal();
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
