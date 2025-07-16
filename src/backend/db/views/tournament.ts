import { DB } from "../db.js";

export function tournamentHtml(db: DB, user: any): string {
	let html = db.getView("tournament");

	return injectUser(html, user);
}

function injectUser(html: string, user: any): string {
	return html;
}
