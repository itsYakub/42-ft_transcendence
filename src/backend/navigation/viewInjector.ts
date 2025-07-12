import { DB } from '../db/db.js';

export function completeFrame(db: DB, view: string, jwt: string): string {
	let frame = db.getFrame();
	const elements = sidebarAndContent(db, view, jwt);

	frame = frame.replace("%%SIDEBAR%%", elements.sidebar);
	frame = frame.replace("%%CONTENT%%", elements.content);

	return frame;
}

export function sidebarAndContent(db: DB, view: string, jwt: string): any {
	const user = db.getUser(jwt);
	let sidebar = db.getSidebar();

	sidebar = injectUserIntoSidebar(sidebar, user);
	const content = injectUserIntoContent(view, user);

	return {
		sidebar,
		content
	};
}

function injectUserIntoSidebar(sidebar: string, user: any): string {
	let nick = "Guest";
	let avatar = "avatar.jpg";
	let login = "visible";
	let logout = "collapse";

	if (!user.error) {
		nick = user.nick as string;
		avatar = user.avatar as string;
		login = "collapse";
		logout = "visible";
	}

	sidebar = sidebar.replace("%%AVATAR%%", avatar);
	sidebar = sidebar.replace("%%NICK%%", nick);
	sidebar = sidebar.replace("%%LOGIN_CLASS%%", login);
	sidebar = sidebar.replace("%%LOGOUT_CLASS%%", logout);

	sidebar = sidebar.replace("%%TIME%%", new Date().toTimeString());

	return sidebar;
}

function injectUserIntoContent(content: string, user: any): string {
	return content;
}

// %%AVATAR%%
// %%NICK%%
// %%LOGIN_CLASS%%
// %%LOGOUT_CLASS%%
// %%CONTENT%%
