import { friendsFunctions } from "./friends.js";
import { googleFunctions } from "./googleAuth.js";
import { loginFunctions } from "./login.js";
import { matchesFunctions } from "./matches.js";
import { pageButtons } from "./pages.js";
import { profileFunctions } from "./profile.js";
import { registerFunctions } from "./register.js";
import { devButtons } from "./devButtons.js";
import { translations } from "./translations.js";

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
	translations();
	profileFunctions();
	friendsFunctions();
	matchesFunctions();
	loginFunctions();
	registerFunctions();
	googleFunctions();

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
		alert("Couldn't sign in/up with Google!");
		document.cookie = `googleautherror=false; Domain=localhost; expires=${date}; Path=/;`;
	}
});

/*
	Marks the user as offline when the url changes
*/
window.addEventListener("beforeunload", (event) => {
	fetch("/user/leave", { method: "POST" });
});
