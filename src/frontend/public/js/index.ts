import { googleFunctions } from "./googleAuth.js";
import { loginFunctions } from "./login.js";
import { logoutFunctions } from "./logout.js";
import { pageButtons } from "./pages.js";
import { profileFunctions } from "./profile.js";
import { registerFunctions } from "./register.js";
import { wipeDB } from "./wipeDB.js";

export async function navigate(url: string): Promise<void> {
	history.pushState(null, null, url);

	// Fetches the data from the backend
	const response = await fetch(url, {
		method: "GET"
	});

	// Sets the frame's navbar and content
	if (response.ok) {
		const text = await response.json();
		document.querySelector("#navbar").innerHTML = text.navbar;
		document.querySelector("#content").innerHTML = text.content;
		addFunctions();
	}
}

// Changes view on back/forward buttons
window.addEventListener('popstate', function (event) {
	navigate(window.location.pathname);
});

// Sets up all the listeners after a "page" refresh
export function addFunctions() {
	pageButtons();
	profileFunctions();
	loginFunctions();
	logoutFunctions();
	registerFunctions();
	googleFunctions();

	// remove!
	wipeDB();
}

window.addEventListener("DOMContentLoaded", () => {
	addFunctions();
	if (-1 != document.cookie.indexOf("googleautherror=true")) {
		const date = new Date();
		date.setDate(date.getDate() - 3);
		alert("Couldn't sign in/up with Google!");
		document.cookie = `googleautherror=false; Domain=localhost; expires=${date}; Path=/;`;
	}
});
