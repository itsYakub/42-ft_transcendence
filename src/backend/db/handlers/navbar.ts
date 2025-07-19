import { DB } from "../db.js";

export function navbarHtml(db: DB, user: any): string {
	let loggedIn = !user.error;
	let html = db.getNavbar(loggedIn);

	return loggedIn ? injectUser(html, user) : html;
}

function injectUser(html: string, user: any): string {
	html = html.replace("%%AVATAR%%", user.avatar);
	html = html.replace("%%NICK%%", user.nick);

	return html;
}
