import { DB } from "../db.js";

export function matchesHtml(db: DB, user: any): string {
	let html = db.getView("matches");

	return injectUser(html, user);
}

function injectUser(html: string, user: any): string {
	html = html.replaceAll("%%NICK%%", user.nick);
	html = html.replaceAll("%%AVATAR%%", user.avatar);

	return html;
}
