import { DB } from "../db.js";

export function profileHtml(db: DB, user: any): string {
	let html = db.getView("profile");

	return injectUser(html, user);
}

function injectUser(html: string, user: any): string {
	return html;
}
