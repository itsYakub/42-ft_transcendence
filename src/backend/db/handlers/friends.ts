import { DB } from "../db.js";

export function friendsHtml(db: DB, user: any): string {
	let html = db.getView("friends");

	return injectUser(html, user);
}

function injectUser(html: string, user: any): string {
	html = html.replaceAll("%%NICK%%", user.nick);
	html = html.replaceAll("%%AVATAR%%", user.avatar);

	return html;
}
