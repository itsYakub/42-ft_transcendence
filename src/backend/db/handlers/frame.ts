import { DB } from "../db.js";
import { friendsHtml } from "./friends.js";
import { homeHtml } from "./home.js";
import { matchesHtml } from "./matches.js";
import { navbarHtml } from "./navbar.js";
import { playHtml } from "./play.js";
import { profileHtml } from "./profile.js";
import { tournamentHtml } from "./tournament.js";

/* Returns the whole page, for external links */
export function frameHtml(db: DB, view: string, user: any): string {
	let html = db.getView("frame");
	let navbar = navbarHtml(db, user);
	let content = contentHtml(db, view, user);

	navbar = highlightPage(navbar, view);

	html = html.replace("%%NAVBAR%%", navbar);
	html = html.replace("%%CONTENT%%", content);

	return html;
}

/* Returns the navbar and content separately, for internal links */
export function frameAndContentHtml(db: DB, view: string, user: any): any {
	let navbar = navbarHtml(db, user);
	let content = contentHtml(db, view, user);

	navbar = highlightPage(navbar, view);

	return {
		navbar,
		content
	};
}

/* Marks the current "page" */
function highlightPage(navbar: string, view: string) {
	const views = ["HOME", "PLAY", "TOURNAMENT"];

	views.forEach((value) => {
		if (value == view.toUpperCase())
			navbar = navbar.replace(`%%${value}_COLOUR%%`, "gray-700");
		else
			navbar = navbar.replace(`%%${value}_COLOUR%%`, "transparent");
	});

	return navbar;
}

/* Gets the correct HTMl from the db */
function contentHtml(db: DB, view: string, user: any): string {
	switch (view) {
		case "friends":
			return friendsHtml(db, user);
		case "home":
			return homeHtml(db, user);
		case "matches":
			return matchesHtml(db, user);
		case "play":
			return playHtml(db, user);
		case "profile":
			return profileHtml(db, user);
		case "tournament":
			return tournamentHtml(db, user);
		default:
			return "";
	}
}
