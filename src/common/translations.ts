function translateDutch(text: string): string {
	switch (text) {
		// errors
		case "ERR_FORBIDDEN": return "!";
		case "ERR_FULL": return "!";
		case "ERR_NOT_FOUND": return "!";
		// navbar, including register and log in dialogs
		case "TEXT_HOME": return "Start";
		case "TEXT_GAME": return "Speel";
		case "TEXT_TOURNAMENT": return "Toernooi";
		case "TEXT_TOTP_CODE_TITLE": return "";
		case "TEXT_TOTP_CODE": return "";
		case "TEXT_TOTP_CODE_VERIFY": return "";
		case "TEXT_PLAYER_NAME_TITLE": return "";
		case "TEXT_PLAYER_NAME": return "";
		case "TEXT_PLAYER_NAME_SET": return "";
		// user
		case "TEXT_TITLE": return "";
		case "TEXT_FORM_TITLE": return "Inloggen of registreren";
		case "TEXT_EMAIL": return "Mail";
		case "TEXT_PASSWORD": return "Hasło";
		case "TEXT_LOGIN": return "Inloggen";
		case "TEXT_REGISTER": return "Registreren";
		case "TEXT_GOOGLE_TITLE": return "";
		case "TEXT_GUEST_TITLE": return "";
		// home
		case "HOME_TITLE": return "Welkom bij Transcendence!";
		// profile
		case "TEXT_PROFILE": return "";
		case "TEXT_HISTORY": return "";
		case "TEXT_FRIENDS": return "";
		case "TEXT_USERS": return "";
		case "TEXT_FOES": return "";
		case "TEXT_CHANGE_AVATAR": return "";
		case "TEXT_CHANGE_NICK": return "";
		case "TEXT_CHANGE_PASSWORD": return "";
		case "TEXT_NEW_NICK": return "";
		case "TEXT_CURRENT_PASSWORD": return "";
		case "TEXT_NEW_PASSWORD": return "";
		case "TEXT_REPEAT_PASSWORD": return "";
		case "TEXT_UPDATE": return "";
		case "TEXT_TOKENS": return "";
		case "TEXT_ENABLE_TOTP": return "";
		case "TEXT_DISABLE_TOTP": return "";
		case "TEXT_LOGOUT": return "";
		case "TEXT_INVALIDATE_TOKEN": return "";
		case "TEXT_TOTP_TITLE": return "";
		case "TEXT_TOTP_SCAN": return "";
		case "TEXT_TOTP_INPUT": return "";
		case "TEXT_TOTP_CODE": return "";
		case "TEXT_TOTP_VERIFY": return "";
		// history
		case "TEXT_PROFILE": return "";
		case "TEXT_HISTORY": return "";
		case "TEXT_FRIENDS": return "";
		case "TEXT_USERS": return "";
		case "TEXT_FOES": return "";
		case "TEXT_WON": return "";
		case "TEXT_MATCH_SINGULAR": return "";
		case "TEXT_MATCH_PLURAL": return "";
		case "TEXT_TEXT_SINGULAR": return "";
		case "TEXT_TEXT_PLURAL": return "";
		// friends
		case "TEXT_PROFILE": return "";
		case "TEXT_HISTORY": return "";
		case "TEXT_FRIENDS": return "";
		case "TEXT_USERS": return "";
		case "TEXT_FOES": return "";
		case "TEXT_ONLINE": return "";
		case "TEXT_OFFLINE": return "";
		case "TEXT_REMOVE": return "";
		case "TEXT_ADD_TITLE": return "";
		case "TEXT_ADD_EMAIL": return "";
		case "TEXT_ADD_FRIEND": return "";
		// users
		case "USERS_PROFILE": return "";
		case "USERS_HISTORY": return "";
		case "USERS_FRIENDS": return "";
		case "USERS_USERS": return "";
		case "USERS_FOES": return "";
		// game
		case "TEXT_SINGLE_GAME": return "";
		case "TEXT_PLAYER": return "";
		case "TEXT_READY": return "";
		case "TEXT_LEAVE": return "";
		case "TEXT_MATCH": return "";
		case "TEXT_TOURNAMENT": return "";
		case "TEXT_SEND": return "";
		// tournament
		case "TEXT_NEW": return "";
		case "TEXT_PLAYER": return "";
		case "TEXT_START": return "";
		case "TEXT_TITLE": return "";
		case "TEXT_CODE": return "";
		case "TEXT_SEMI_FINALS": return "";
		case "TEXT_FINAL": return "";
		case "TEXT_TBD": return "";
		case "TEXT_NEXT_MATCH": return "";
		case "TEXT_GAME": return "";
		case "TEXT_CONGRATULATIONS": return "";
		case "TEXT_UNKNOWN": return "";
		case "TEXT_READY": return "";
		case "TEXT_SEND": return "";
		default: return "NLUnknown text";
	}
}

function translateEnglish(text: string): string {
	switch (text) {
		case "BUTTON_ACCOUNT": return "Account";
		case "BUTTON_AI_GAME": return "AI game";
		case "BUTTON_ADD_FRIEND": return "Add friend";
		case "BUTTON_BLOCK_USER": return "Block";
		case "BUTTON_DISABLE_TOTP": return "Disable TOTP";
		case "BUTTON_ENABLE_TOTP": return "Enable TOTP";
		case "BUTTON_FOES": return "Foes";
		case "BUTTON_FRIENDS": return "Friends";
		case "BUTTON_GAME": return "Game";
		case "BUTTON_HISTORY": return "History";
		case "BUTTON_HOME": return "Home";
		case "BUTTON_INVALIDATE_TOKEN": return "Invalidate token";
		case "BUTTON_LOCAL_GAME": return "Local game";
		case "BUTTON_LOCAL_TOURNAMENT": return "Local tournament";
		case "BUTTON_LOGIN": return "Log in";
		case "BUTTON_GOOGLE": return "Continue with Google";
		case "BUTTON_GUEST": return "Continue as a guest";
		case "BUTTON_LOGOUT": return "Log out";
		case "BUTTON_MATCH": return "Match";
		case "BUTTON_READY": return "Ready";
		case "BUTTON_LEAVE": return "Leave";
		case "BUTTON_REGISTER": return "Register";
		case "BUTTON_REMOTE_GAME": return "Remote game";
		case "BUTTON_REMOTE_TOURNAMENT": return "Remote tournament";
		case "BUTTON_TOTP_VERIFY": return "Verify";
		case "BUTTON_TOURNAMENT": return "Tournament";
		case "BUTTON_UPDATE": return "Update";
		case "BUTTON_USERS": return "Users";

		case "ERR_DB": return "Database error!";
		case "ERR_FORBIDDEN": return "Forbidden!";
		case "ERR_FULL": return "Room full!";
		case "ERR_NOT_FOUND": return "Not found!";

		case "TEXT_CHANGE_AVATAR": return "Change avatar";
		case "TEXT_CHANGE_NICK": return "Change nickname";
		case "TEXT_CHANGE_PASSWORD": return "Change password";
		case "TEXT_CREATE": return "Or create a new...";
		case "TEXT_CURRENT_PASSWORD": return "Current password";
		case "TEXT_EMAIL": return "Email";
		case "TEXT_JOIN": return "Join...";
		case "TEXT_LOG_IN_OR_REGISTER": return "Log in or register";
		case "TEXT_NEW_NICK": return "New nickname";
		case "TEXT_NEW_PASSWORD": return "New password";
		case "TEXT_PASSWORD": return "Password";
		case "TEXT_REPEAT_PASSWORD": return "Repeat password";
		case "TEXT_SINGLE_GAME": return "Single game";
		case "TEXT_TOKENS": return "Tokens";
		case "TEXT_TOTP_CODE": return "Code";
		case "TEXT_TOTP_INPUT": return "And input the code below";
		case "TEXT_TOTP_SCAN": return "Scan the QR code or enter this key into your authenticator app";
		case "TEXT_TOTP_TITLE": return "TOTP";
		case "TEXT_USER_DECISION": return "Please choose an option to continue";
		case "TEXT_WELCOME": return "Welcome to Transcendence!";

		case "TEXT_TOTP_CODE_TITLE": return "Enter TOTP code";
		case "TEXT_PLAYER_NAME_TITLE": return "Choose a name";
		case "TEXT_PLAYER_NAME": return "Player name";
		case "TEXT_PLAYER_NAME_SET": return "Set";


		case "TEXT_WON": return "Won";
		case "TEXT_MATCH_SINGULAR": return "match";
		case "TEXT_MATCH_PLURAL": return "matches";
		case "TEXT_TEXT_SINGULAR": return "tournament";
		case "TEXT_TEXT_PLURAL": return "tournaments";

		case "TEXT_ONLINE": return "Online";
		case "TEXT_OFFLINE": return "Offline";
		case "TEXT_REMOVE": return "Remove";
		case "TEXT_ADD_TITLE": return "Friend's email address";
		case "TEXT_ADD_EMAIL": return "Email";
		case "TEXT_ADD_FRIEND": return "Add friend";

		// game
		case "TEXT_PLAYER": return "Player";
		case "TEXT_MATCH": return "Match";
		case "TEXT_TOURNAMENT": return "Tournament";

		// tournament
		case "TEXT_NEW": return "New tournament";
		case "TEXT_PLAYER": return "Player";
		case "TEXT_START": return "Start";
		case "TEXT_TITLE": return "Tournament";
		case "TEXT_CODE": return "Tournament code";
		case "TEXT_SEMI_FINALS": return "Semi-finals";
		case "TEXT_FINAL": return "Final";
		case "TEXT_TBD": return "TBD";
		case "TEXT_NEXT_MATCH": return "Next match";
		case "TEXT_GAME": return "Play";
		case "TEXT_CONGRATULATIONS": return "Congratulations";
		case "TEXT_UNKNOWN": return "No tournament with that code exists";
		case "TEXT_READY": return "Ready";
		default: return "ENUnknown text";
	}
}

function translatePolish(text: string): string {
	switch (text) {
		// errors
		case "ERR_FORBIDDEN": return "!";
		case "ERR_FULL": return "!";
		case "ERR_NOT_FOUND": return "!";
		// navbar, including register and log in dialogs
		case "TEXT_HOME": return "Strona Główna";
		case "TEXT_GAME": return "Gra";
		case "TEXT_TOURNAMENT": return "Turniej";
		case "TEXT_TOTP_CODE_TITLE": return "";
		case "TEXT_TOTP_CODE": return "";
		case "TEXT_TOTP_CODE_VERIFY": return "";
		case "TEXT_PLAYER_NAME_TITLE": return "";
		case "TEXT_PLAYER_NAME": return "";
		case "TEXT_PLAYER_NAME_SET": return "";
		// user
		case "TEXT_TITLE": return "";
		case "TEXT_FORM_TITLE": return "Zaloguj się lub załóż konto";
		case "TEXT_EMAIL": return "Mail";
		case "TEXT_PASSWORD": return "Hasło";
		case "TEXT_LOGIN": return "Zaloguj się";
		case "TEXT_REGISTER": return "Załóż konto";
		case "TEXT_GOOGLE_TITLE": return "";
		case "TEXT_GUEST_TITLE": return "";
		// home
		case "HOME_TITLE": return "Witamy w projekcie Transcendence!";
		// profile
		case "TEXT_PROFILE": return "";
		case "TEXT_HISTORY": return "";
		case "TEXT_FRIENDS": return "";
		case "TEXT_USERS": return "";
		case "TEXT_FOES": return "";
		case "TEXT_CHANGE_AVATAR": return "";
		case "TEXT_CHANGE_NICK": return "";
		case "TEXT_CHANGE_PASSWORD": return "";
		case "TEXT_NEW_NICK": return "";
		case "TEXT_CURRENT_PASSWORD": return "";
		case "TEXT_NEW_PASSWORD": return "";
		case "TEXT_REPEAT_PASSWORD": return "";
		case "TEXT_UPDATE": return "";
		case "TEXT_TOKENS": return "";
		case "TEXT_ENABLE_TOTP": return "";
		case "TEXT_DISABLE_TOTP": return "";
		case "TEXT_LOGOUT": return "";
		case "TEXT_INVALIDATE_TOKEN": return "";
		case "TEXT_TOTP_TITLE": return "";
		case "TEXT_TOTP_SCAN": return "";
		case "TEXT_TOTP_INPUT": return "";
		case "TEXT_TOTP_CODE": return "";
		case "TEXT_TOTP_VERIFY": return "";
		// history
		case "TEXT_PROFILE": return "";
		case "TEXT_HISTORY": return "";
		case "TEXT_FRIENDS": return "";
		case "TEXT_USERS": return "";
		case "TEXT_FOES": return "";
		case "TEXT_WON": return "";
		case "TEXT_MATCH_SINGULAR": return "";
		case "TEXT_MATCH_PLURAL": return "";
		case "TEXT_TEXT_SINGULAR": return "";
		case "TEXT_TEXT_PLURAL": return "";
		// friends
		case "TEXT_PROFILE": return "";
		case "TEXT_HISTORY": return "";
		case "TEXT_FRIENDS": return "";
		case "TEXT_USERS": return "";
		case "TEXT_FOES": return "";
		case "TEXT_ONLINE": return "";
		case "TEXT_OFFLINE": return "";
		case "TEXT_REMOVE": return "";
		case "TEXT_ADD_TITLE": return "";
		case "TEXT_ADD_EMAIL": return "";
		case "TEXT_ADD_FRIEND": return "";
		// users
		case "USERS_PROFILE": return "";
		case "USERS_HISTORY": return "";
		case "USERS_FRIENDS": return "";
		case "USERS_USERS": return "";
		case "USERS_FOES": return "";
		// game
		case "TEXT_SINGLE_GAME": return "";
		case "TEXT_PLAYER": return "";
		case "TEXT_READY": return "";
		case "TEXT_LEAVE": return "";
		case "TEXT_MATCH": return "";
		case "TEXT_TOURNAMENT": return "";
		case "TEXT_SEND": return "";
		// tournament
		case "TEXT_NEW": return "";
		case "TEXT_PLAYER": return "";
		case "TEXT_START": return "";
		case "TEXT_TITLE": return "";
		case "TEXT_CODE": return "";
		case "TEXT_SEMI_FINALS": return "";
		case "TEXT_FINAL": return "";
		case "TEXT_TBD": return "";
		case "TEXT_NEXT_MATCH": return "";
		case "TEXT_GAME": return "";
		case "TEXT_CONGRATULATIONS": return "";
		case "TEXT_UNKNOWN": return "";
		case "TEXT_READY": return "";
		case "TEXT_SEND": return "";
		default: return "PLUnknown text";
	}
}

export function translateBackend({ language, html }): string {
	const items = [
		"BUTTON_ACCOUNT",
		"BUTTON_AI_GAME",
		"BUTTON_ADD_FRIEND",
		"BUTTON_BLOCK_USER",
		"BUTTON_DISABLE_TOTP",
		"BUTTON_ENABLE_TOTP",
		"BUTTON_FOES",
		"BUTTON_FRIENDS",
		"BUTTON_GAME",
		"BUTTON_GOOGLE",
		"BUTTON_GUEST",
		"BUTTON_HISTORY",
		"BUTTON_HOME",
		"BUTTON_INVALIDATE_TOKEN",
		"BUTTON_LEAVE",
		"BUTTON_LOCAL_GAME",
		"BUTTON_LOCAL_TOURNAMENT",
		"BUTTON_LOGIN",
		"BUTTON_LOGOUT",
		"BUTTON_MATCH",
		"BUTTON_READY",
		"BUTTON_REGISTER",
		"BUTTON_REMOTE_GAME",
		"BUTTON_REMOTE_TOURNAMENT",
		"BUTTON_TOTP_VERIFY",
		"BUTTON_TOURNAMENT",
		"BUTTON_UPDATE",
		"BUTTON_USERS",
		"ERR_DB",
		"ERR_FORBIDDEN",
		"ERR_NOT_FOUND",
		"TEXT_CHANGE_AVATAR",
		"TEXT_CHANGE_NICK",
		"TEXT_CHANGE_PASSWORD",
		"TEXT_CREATE",
		"TEXT_CURRENT_PASSWORD",
		"TEXT_EMAIL",
		"TEXT_JOIN",
		"TEXT_LOG_IN_OR_REGISTER",
		"TEXT_NEW_NICK",
		"TEXT_NEW_PASSWORD",
		"TEXT_PASSWORD",
		"TEXT_REPEAT_PASSWORD",
		"TEXT_SINGLE_GAME",
		"TEXT_TOKENS",
		"TEXT_TOTP_CODE",
		"TEXT_TOTP_INPUT",
		"TEXT_TOTP_SCAN",
		"TEXT_TOTP_TITLE",
		"TEXT_USER_DECISION",
		"TEXT_WELCOME"
	];


	switch (language) {
		case "dutch":
			items.forEach(item => html = html.replaceAll(`%%${item}%%`, translateDutch(item)));
			break;
		case "english":
			items.forEach(item => html = html.replaceAll(`%%${item}%%`, translateEnglish(item)));
			break;
		case "polish":
			items.forEach(item => html = html.replaceAll(`%%${item}%%`, translatePolish(item)));
			break;
	}

	return html;
}
