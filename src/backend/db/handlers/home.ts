import { DB } from "../db.js";

export function homeHtml(db: DB, user: any): string {
	let html = db.getView("home");

	return injectUser(html, user);
}

function injectUser(html: string, user: any): string {
	return html;
}
