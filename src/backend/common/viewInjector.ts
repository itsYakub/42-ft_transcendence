import { DB } from '../db/db.js';

export function completeFrame(db: DB, view: string, jwt: string): string {
	let frame = db.getFrame();
	const elements = navbarAndContent(db, view, jwt);

	frame = frame.replace("%%NAVBAR%%", elements.navbar);
	frame = frame.replace("%%CONTENT%%", elements.content);

	return frame;
}

export function navbarAndContent(db: DB, view: string, jwt: string): any {
	const views = ["HOME", "GAME", "TOURNAMENT"];

	const user = db.getUser(jwt);
	let navbar = db.getNavbar(!user.error);

	navbar = injectUserIntoNavbar(navbar, user);
	views.forEach((value) => {
		if (value == view.toUpperCase())
			navbar = navbar.replace(`%%${value}_COLOUR%%`, "gray-900");
		else
			navbar = navbar.replace(`%%${value}_COLOUR%%`, "transparent");
	});
	const content = injectUserIntoContent(view, user);

	return {
		navbar,
		content
	};
}

function injectUserIntoNavbar(navbar: string, user: any): string {
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

	navbar = navbar.replace("%%AVATAR%%", avatar);
	navbar = navbar.replace("%%NICK%%", nick);
	navbar = navbar.replace("%%LOGIN_CLASS%%", login);
	navbar = navbar.replace("%%LOGOUT_CLASS%%", logout);

	return navbar;
}

function injectUserIntoContent(content: string, user: any): string {
	return content;
}
