import { DB } from "../../db/db";

export function navbarHtml(db: DB, user: any): string {
	const loggedIn = !user.error;
	const html = db.getNavbar(loggedIn);

	return loggedIn ? injectUser(html, user) : html;
}

function injectUser(html: string, user: any): string {
	html = html.replace("%%AVATAR%%", user.avatar);
	html = html.replace("%%NICK%%", user.nick);

	return html;
}
