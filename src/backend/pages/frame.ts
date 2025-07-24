import { DatabaseSync } from "node:sqlite";
import { friendsHtml } from "./friends/friends.js";
import { homeHtml } from "./home/home.js";
import { matchesHtml } from "./matches/matches.js";
import { navbarHtml } from "./navbar.js";
import { playHtml } from "./play/play.js";
import { profileHtml } from "./profile/profile.js";
import { tournamentHtml } from "./tournament/tournament.js";

/* Returns the whole page, for external links, or db_error */
export function frameHtml(db: DatabaseSync, view: string, user: any): string {
	let html = frameHtmlString;
	let navbar = navbarHtml(user);

	const content = contentHtml(db, view, user);
	if ("db_error" == content) {
		return "db_error";
	}

	navbar = highlightPage(navbar, view);

	html = html.replace("%%NAVBAR%%", navbar);
	html = html.replace("%%CONTENT%%", content);

	return html;
}

/* Returns the navbar and content separately, for internal links */
export function frameAndContentHtml(db: DatabaseSync, view: string, user: any): any {
	let navbar = navbarHtml(user);

	const content = contentHtml(db, view, user);
	if ("db_error" == content) {
		return {
			navbar: "db_error",
		};
	}

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
function contentHtml(db: DatabaseSync, view: string, user: any): string {
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

const frameHtmlString: string = `
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta http-equiv="X-UA-Compatible" content="ie=edge" />
			<link rel="icon" type="image/x-icon" href="/images/favicon.ico">
			<script type="module" src="js/index.js"></script>
			<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
			<title>Transcendence</title>
		</head>

		<body>
			<div class="h-screen flex flex-col">
				<div id="navbar" class="h-32">%%NAVBAR%%</div>
				<div id="content" class="grow">%%CONTENT%%</div>
			</div>
		</body>
	</html>`;
