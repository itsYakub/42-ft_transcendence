import { DB } from "../db.js";

export function playHtml(db: DB, user: any): string {
	let html = db.getView("play");

	return injectUser(html, user);
}

function injectUser(html: string, user: any): string {
	return html;
}
