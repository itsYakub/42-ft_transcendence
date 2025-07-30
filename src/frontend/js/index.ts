import { friendsFunctions } from "./friends.js";
import { googleFunctions } from "./googleAuth.js";
import { loginFunctions } from "./login.js";
import { matchesFunctions } from "./matches.js";
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
export async function navigate(url: string): Promise<void> {
	history.replaceState(null, null, url);

	const response = await fetch(url, {
		method: "GET"
	});

	if (response.ok) {
		const text = await response.json();
		document.querySelector("#navbar").innerHTML = text.navbar;
		document.querySelector("#content").innerHTML = text.content;
		addFunctions();
	}
}

/* 
	Changes page on back/forward buttons
*/
window.addEventListener('popstate', function (event) {
	navigate(window.location.pathname);
});

/*
	Sets up all the listeners after a "page" refresh
*/
export function addFunctions() {
	pageButtons();
	tournamentFunctions();
	translations();
	profileFunctions();
	friendsFunctions();
	matchesFunctions();
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

		alert(translateFrontend("ERR_GOOGLE"));
		document.cookie = `googleautherror=false; Domain=localhost; expires=${date}; Path=/;`;
	}
});

/*
	Marks the user as offline when the url changes
*/
window.addEventListener("beforeunload", (event) => {
	fetch("/user/leave", { method: "POST" });
});

/*
	A match has finished with a winner
*/
document.addEventListener("matchOver", async (e: CustomEvent) => {
	// figure out if tournament or game
	// update matches in DB

	const response = await fetch("/tournament/update", {
		method: "POST",
		body: JSON.stringify({
			code: document.location.href.substring(document.location.href.lastIndexOf('/') + 1),
			p1Score: e.detail.p1Score,
			p2Score: e.detail.p2Score
		})
	});
	if (response.ok)
		navigate(document.location.href);
});

