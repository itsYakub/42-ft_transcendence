export function translate(language: string, text: string): string {
	const items = [
		"BUTTON_ACCOUNT",
		"BUTTON_AI_MATCH",
		"BUTTON_ADD_FOE",
		"BUTTON_ADD_FRIEND",
		"BUTTON_APP_TOTP",
		"BUTTON_BLOCK_USER",
		"BUTTON_CHAT",
		"BUTTON_DISABLE_TOTP",
		"BUTTON_EMAIL_TOTP",
		"BUTTON_ENABLE_TOTP",
		"BUTTON_FOES",
		"BUTTON_FRIENDS",
		"BUTTON_GAME",
		"BUTTON_GOOGLE",
		"BUTTON_GUEST",
		"BUTTON_HOME",
		"BUTTON_INVALIDATE_TOKEN",
		"BUTTON_INVITE",
		"BUTTON_LEAVE",
		"BUTTON_LOGIN",
		"BUTTON_LOGOUT",
		"BUTTON_MATCH",
		"BUTTON_NOTIFICATIONS",
		"BUTTON_READY",
		"BUTTON_REGISTER",
		"BUTTON_REMOVE_FOE",
		"BUTTON_REMOVE_FRIEND",
		"BUTTON_TOTP_VERIFY",
		"BUTTON_TOURNAMENT",
		"BUTTON_UPDATE",
		"BUTTON_USERS",
		"ERR_AVATAR_TOO_BIG",
		"ERR_BAD_TOTP",
		"ERR_DB",
		"ERR_EMAIL_IN_USE",
		"ERR_GOOGLE",
		"ERR_GOOGLE_EMAIL",
		"ERR_FORBIDDEN",
		"ERR_NOT_FOUND",
		"ERR_UNIQUE",
		"MESSAGE_INVITATION",
		"MESSAGE_TOTP",
		"SUCCESS_NICK",
		"SUCCESS_PASSWORD",
		"SUCCESS_TOTP",
		"TEXT_ACCOUNT_TITLE",
		"TEXT_AI",
		"TEXT_CHANGE_AVATAR",
		"TEXT_CHANGE_NICK",
		"TEXT_CHANGE_PASSWORD",
		"TEXT_CHAT",
		"TEXT_CHAT_TITLE",
		"TEXT_CONGRATULATIONS",
		"TEXT_CREATE_LOCAL",
		"TEXT_CREATE_REMOTE",
		"TEXT_CURRENT_PASSWORD",
		"TEXT_EMAIL",
		"TEXT_FOES_TITLE",
		"TEXT_FRIENDS_TITLE",
		"TEXT_GAME_TITLE",
		"TEXT_GUEST",
		"TEXT_JOIN",
		"TEXT_LOCAL_MATCH",
		"TEXT_LOCAL_TOURNAMENT",
		"TEXT_LOG_IN_OR_REGISTER",
		"TEXT_MATCH",
		"TEXT_MATCH_SINGULAR",
		"TEXT_MATCH_PLURAL",
		"TEXT_MESSAGES",
		"TEXT_NEW_NICK",
		"TEXT_NEW_PASSWORD",
		"TEXT_NO_FRIENDS",
		"TEXT_NO_FOES",
		"TEXT_NO_USERS",
		"TEXT_PASSWORD",
		"TEXT_PLAYER",
		"TEXT_PLAYERS",
		"TEXT_REMOTE_MATCH",
		"TEXT_REMOTE_TOURNAMENT",
		"TEXT_REMOVE_FOE",
		"TEXT_REMOVE_FRIEND",
		"TEXT_REPEAT_PASSWORD",
		"TEXT_START",
		"TEXT_TEAM",
		"TEXT_TECH",
		"TEXT_TOTP_CODE",
		"TEXT_TOTP_CODE_TITLE",
		"TEXT_TOTP_INPUT",
		"TEXT_TOTP_SCAN",
		"TEXT_TOTP_SUCCESS",
		"TEXT_TOTP_TITLE",
		"TEXT_TOURNAMENT",
		"TEXT_TOURNAMENT_FINAL",
		"TEXT_TOURNAMENT_SEMI_FINALS",
		"TEXT_TOURNAMENT_SINGULAR",
		"TEXT_TOURNAMENT_PLAY",
		"TEXT_TOURNAMENT_PLURAL",
		"TEXT_USERS",
		"TEXT_USER_DECISION",
		"TEXT_USERS_TITLE",
		"TEXT_WELCOME",
		"TEXT_WON"
	];


	switch (language) {
		case "dutch":
			items.forEach(item => text = text.replaceAll(`%%${item}%%`, translateDutch(item)));
			break;
		case "english":
			items.forEach(item => text = text.replaceAll(`%%${item}%%`, translateEnglish(item)));
			break;
		case "polish":
			items.forEach(item => text = text.replaceAll(`%%${item}%%`, translatePolish(item)));
			break;
	}

	return text;
}

function translateDutch(text: string): string {
	switch (text) {
		case "TEXT_HOME": return "Start";
		case "TEXT_GAME": return "Speel";
		case "TEXT_TOURNAMENT": return "Toernooi";
		case "TEXT_FORM_TITLE": return "Inloggen of registreren";
		case "TEXT_EMAIL": return "Mail";
		case "TEXT_PASSWORD": return "Hasło";
		case "TEXT_LOGIN": return "Inloggen";
		case "TEXT_REGISTER": return "Registreren";
		case "HOME_TITLE": return "Welkom bij Transcendence!";
		default: return text;
	}
}

function translateEnglish(text: string): string {
	switch (text) {
		case "BUTTON_ACCOUNT": return "Account";
		case "BUTTON_ADD_FOE": return "Add foe";
		case "BUTTON_ADD_FRIEND": return "Add friend";
		case "BUTTON_AI_MATCH": return "AI match";
		case "BUTTON_APP_TOTP": return "App";
		case "BUTTON_BLOCK_USER": return "Block";
		case "BUTTON_CHAT": return "Chat";
		case "BUTTON_DISABLE_TOTP": return "Disabled";
		case "BUTTON_EMAIL_TOTP": return "Email";
		case "BUTTON_FOES": return "Foes";
		case "BUTTON_FRIENDS": return "Friends";
		case "BUTTON_GAME": return "Game";
		case "BUTTON_HOME": return "Home";
		case "BUTTON_INVALIDATE_TOKEN": return "Invalidate token";
		case "BUTTON_INVITE": return "Invite";
		case "BUTTON_LOGIN": return "Log in";
		case "BUTTON_GOOGLE": return "Continue with Google";
		case "BUTTON_GUEST": return "Continue as a guest";
		case "BUTTON_LOGOUT": return "Log out";
		case "BUTTON_MATCH": return "Match";
		case "BUTTON_NOTIFICATIONS": return "Notifications";
		case "BUTTON_READY": return "Ready";
		case "BUTTON_LEAVE": return "Leave";
		case "BUTTON_REGISTER": return "Register";
		case "BUTTON_REMOVE_FOE": return "Remove foe";
		case "BUTTON_REMOVE_FRIEND": return "Remove friend";
		case "BUTTON_TOTP_VERIFY": return "Verify";
		case "BUTTON_TOURNAMENT": return "Tournament";
		case "BUTTON_UPDATE": return "Update";
		case "BUTTON_USERS": return "Users";

		case "ERR_AVATAR_TOO_BIG": return "The selected image is too big - 100KiB max!";
		case "ERR_BAD_PASSWORD": return "Incorrect password!";
		case "ERR_BAD_TOTP": return "Incorrect code!";
		case "ERR_DB": return "Database error!";
		case "ERR_EMAIL_IN_USE": return "Email already registered!";
		case "ERR_FORBIDDEN": return "Forbidden!";
		case "ERR_FULL": return "Room full!";
		case "ERR_GOOGLE": return "Couldn't sign in/up with Google!";
		case "ERR_GOOGLE_EMAIL": return "Please log in with Google!";
		case "ERR_NO_NEW_PASSWORD": return "New password can't be the same as old password!";
		case "ERR_NO_USER": return "User not found!";
		case "ERR_NOT_FOUND": return "Not found!";
		case "ERR_PASSWORDS_DONT_MATCH": return "Please repeat the password!";
		case "ERR_SAME_EMAIL": return "You can't add yourself!";
		case "ERR_SAME_NAME": return "Names must be unique!";
		case "ERR_TOTP_CODE": return "Incorrect code!";
		case "ERR_UNIQUE": return "Names must be unique!";
		case "ERR_USER_OFFLINE": return "User offline!";

		case "MESSAGE_INVITATION": return "Join my tournament!";
		case "MESSAGE_TOTP": return "Your 2FA code";

		case "PROMPT_TEXT_EMAIL": return "Friend's email";
		case "PROMPT_TOTP_CODE": return "2FA code";

		case "SUCCESS_ADDED_FRIEND": return "Added friend!";
		case "SUCCESS_DISABLED_TOTP": return "Disabled 2FA!";
		case "SUCCESS_TOTP": return "Success - please log in again!";
		case "SUCCESS_INVALIDATED_TOKEN": return "Token invalidated!";
		case "SUCCESS_NICK": return "Nickname changed!";
		case "SUCCESS_PASSWORD": return "Password changed!";

		case "TEXT_ACCOUNT_TITLE": return "Account details";
		case "TEXT_AI": return "AI";
		case "TEXT_CHANGE_AVATAR": return "Change avatar";
		case "TEXT_CHANGE_NICK": return "Change nickname";
		case "TEXT_CHANGE_PASSWORD": return "Change password";
		case "TEXT_CHAT": return "Chat";
		case "TEXT_CHAT_TITLE": return "Direct messages";
		case "TEXT_CONGRATULATIONS": return "Congratulations";
		case "TEXT_CREATE_LOCAL": return "New local";
		case "TEXT_CREATE_REMOTE": return "New remote";
		case "TEXT_CURRENT_PASSWORD": return "Current password";
		case "TEXT_EMAIL": return "Email";
		case "TEXT_FOES_TITLE": return "Foes";
		case "TEXT_FRIENDS_TITLE": return "Friends";
		case "TEXT_GAME_TITLE": return "Games";
		case "TEXT_GUEST": return "Guest";
		case "TEXT_JOIN": return "In-progress";
		case "TEXT_LOCAL_MATCH": return "Local match";
		case "TEXT_LOCAL_TOURNAMENT": return "Local tournament";
		case "TEXT_LOG_IN_OR_REGISTER": return "User";
		case "TEXT_MATCH": return "Match";
		case "TEXT_MATCH_SINGULAR": return "match";
		case "TEXT_MATCH_PLURAL": return "matches";
		case "TEXT_MESSAGES": return "Messages";
		case "TEXT_NEW_NICK": return "New nickname";
		case "TEXT_NEW_PASSWORD": return "New password";
		case "TEXT_NO_FRIENDS": return "No friends!";
		case "TEXT_NO_FOES": return "No foes!";
		case "TEXT_NO_USERS": return "No other users!";
		case "TEXT_PASSWORD": return "Password";
		case "TEXT_PLAYER": return "Player";
		case "TEXT_PLAYERS": return "players";
		case "TEXT_REMOTE_MATCH": return "Remote match";
		case "TEXT_REMOTE_TOURNAMENT": return "Remote tournament";
		case "TEXT_REMOVE_FOE": return "Remove from foes";
		case "TEXT_REMOVE_FRIEND": return "Remove from friends";
		case "TEXT_REPEAT_PASSWORD": return "Repeat password";
		case "TEXT_START": return "Start";
		case "TEXT_SUCCESS": return "Start";
		case "TEXT_TEAM": return "The Team";
		case "TEXT_TECH": return "Tech stack";
		case "TEXT_TOTP_CODE": return "Code";
		case "TEXT_TOTP_CODE_TITLE": return "Enter code";
		case "TEXT_TOTP_INPUT": return "And input the code below";
		case "TEXT_TOTP_SCAN": return "Scan the QR code or enter this key into your authenticator app";
		case "TEXT_TOTP_TITLE": return "2FA";
		case "TEXT_TOURNAMENT": return "Tournament";
		case "TEXT_TOURNAMENT_FINAL": return "Final";
		case "TEXT_TOURNAMENT_SEMI_FINALS": return "Semi-finals";
		case "TEXT_TOURNAMENT_SINGULAR": return "tournament";
		case "TEXT_TOURNAMENT_PLAY": return "Play";
		case "TEXT_TOURNAMENT_PLURAL": return "tournaments";
		case "TEXT_USERS": return "Users";
		case "TEXT_USER_DECISION": return "Please choose an option to continue";
		case "TEXT_USERS_TITLE": return "Users";
		case "TEXT_WELCOME": return "Welcome to Transcendence!";
		case "TEXT_WON": return "Won";


		case "TEXT_PLAYER_NAME_TITLE": return "Choose a name";
		case "TEXT_PLAYER_NAME": return "Player name";
		case "TEXT_PLAYER_NAME_SET": return "Set";
		
		default: return text;
	}
}

function translatePolish(text: string): string {
	switch (text) {
		case "TEXT_HOME": return "Strona Główna";
		case "TEXT_GAME": return "Gra";
		case "TEXT_TOURNAMENT": return "Turniej";
		case "TEXT_FORM_TITLE": return "Zaloguj się lub załóż konto";
		case "TEXT_EMAIL": return "Mail";
		case "TEXT_PASSWORD": return "Hasło";
		case "TEXT_LOGIN": return "Zaloguj się";
		case "TEXT_REGISTER": return "Załóż konto";
		case "HOME_TITLE": return "Witamy w projekcie Transcendence!";
		default: return text;
	}
}
