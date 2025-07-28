function translateDutch(text: string): string {
	switch (text) {
		// navbar, including register and log in dialogs
		case "NAVBAR_HOME_TEXT": return "Start";
		case "NAVBAR_PLAY_TEXT": return "Spelen";
		case "NAVBAR_TOURNAMENT_TEXT": return "Toernooi";
		case "NAVBAR_LOGIN_TEXT": return "Inloggen";
		case "NAVBAR_OR_TEXT": return "of";
		case "NAVBAR_REGISTER_TEXT": return "Registreren";
		case "NAVBAR_REGISTER_TITLE_TEXT": return "";
		case "NAVBAR_LOGIN_TITLE_TEXT": return "";
		case "NAVBAR_NICK_TEXT": return "";
		case "NAVBAR_EMAIL_TEXT": return "";
		case "NAVBAR_PASSWORD_TEXT": return "";
		case "NAVBAR_CANCEL_TEXT": return "Terug";
		// home
		case "HOME_TITLE_TEXT": return "Welkom bij Transcendence!";
		// profile
		case "PROFILE_PROFILE_TEXT": return "";
		case "PROFILE_MATCHES_TEXT": return "";
		case "PROFILE_FRIENDS_TEXT": return "";
		case "PROFILE_USER_PROFILE_TEXT": return "";
		case "PROFILE_CHANGE_AVATAR_TEXT": return "";
		case "PROFILE_CHANGE_NICK_TEXT": return "";
		case "PROFILE_CHANGE_PASSWORD_TEXT": return "";
		case "PROFILE_NEW_NICK_TEXT": return "";
		case "PROFILE_CURRENT_PASSWORD_TEXT": return "";
		case "PROFILE_NEW_PASSWORD_TEXT": return "";
		case "PROFILE_REPEAT_PASSWORD_TEXT": return "";
		case "PROFILE_UPDATE_TEXT": return "";
		case "PROFILE_TOKENS_TEXT": return "";
		case "PROFILE_ENABLE_TOTP_TEXT": return "";
		case "PROFILE_DISABLE_TOTP_TEXT": return "";
		case "PROFILE_LOGOUT_TEXT": return "";
		case "PROFILE_INVALIDATE_TOKEN_TEXT": return "";
		// friends
		case "FRIENDS_ADD_FRIEND_TEXT": return "";
		default: return "NLUnknown text";
	}
}

function translateEnglish(text: string): string {
	switch (text) {
		// navbar, including register and log in dialogs
		case "NAVBAR_HOME_TEXT": return "Home";
		case "NAVBAR_PLAY_TEXT": return "Play";
		case "NAVBAR_TOURNAMENT_TEXT": return "Tournament";
		case "NAVBAR_LOGIN_TEXT": return "Log in";
		case "NAVBAR_OR_TEXT": return "or";
		case "NAVBAR_REGISTER_TEXT": return "Register";
		case "NAVBAR_REGISTER_TITLE_TEXT": return "Register a new Account";
		case "NAVBAR_LOGIN_TITLE_TEXT": return "Log in to your account";
		case "NAVBAR_NICK_TEXT": return "Nickname";
		case "NAVBAR_EMAIL_TEXT": return "Email";
		case "NAVBAR_PASSWORD_TEXT": return "Password";
		case "NAVBAR_CANCEL_TEXT": return "Cancel";
		// home
		case "HOME_TITLE_TEXT": return "Welcome to Transcendence!";
		// profile
		case "PROFILE_PROFILE_TEXT": return "Profile";
		case "PROFILE_MATCHES_TEXT": return "Matches";
		case "PROFILE_FRIENDS_TEXT": return "Friends";
		case "PROFILE_USER_PROFILE_TEXT": return "User Profile";
		case "PROFILE_CHANGE_AVATAR_TEXT": return "Change avatar";
		case "PROFILE_CHANGE_NICK_TEXT": return "Change nickname";
		case "PROFILE_CHANGE_PASSWORD_TEXT": return "Change password";
		case "PROFILE_NEW_NICK_TEXT": return "New nickname";
		case "PROFILE_CURRENT_PASSWORD_TEXT": return "Current password";
		case "PROFILE_NEW_PASSWORD_TEXT": return "New password";
		case "PROFILE_REPEAT_PASSWORD_TEXT": return "Repeat password";
		case "PROFILE_UPDATE_TEXT": return "Update";
		case "PROFILE_TOKENS_TEXT": return "Tokens";
		case "PROFILE_ENABLE_TOTP_TEXT": return "Enable TOTP";
		case "PROFILE_DISABLE_TOTP_TEXT": return "Disable TOTP";
		case "PROFILE_LOGOUT_TEXT": return "Log out";
		case "PROFILE_INVALIDATE_TOKEN_TEXT": return "Invalidate token";
		// friends
		case "FRIENDS_ADD_FRIEND_TEXT": return "Add friend";
		default: return "ENUnknown text";
	}
}

function translatePolish(text: string): string {
	switch (text) {
		// navbar, including register and log in dialogs
		case "NAVBAR_HOME_TEXT": return "Strona Główna";
		case "NAVBAR_PLAY_TEXT": return "Grać";
		case "NAVBAR_TOURNAMENT_TEXT": return "Turniej";
		case "NAVBAR_LOGIN_TEXT": return "Zaloguj się";
		case "NAVBAR_OR_TEXT": return "lub";
		case "NAVBAR_REGISTER_TEXT": return "Zapisać się";
		case "NAVBAR_REGISTER_TITLE_TEXT": return "";
		case "NAVBAR_LOGIN_TITLE_TEXT": return "";
		case "NAVBAR_NICK_TEXT": return "Nick";
		case "NAVBAR_EMAIL_TEXT": return "Mail";
		case "NAVBAR_PASSWORD_TEXT": return "Hasło";
		case "NAVBAR_CANCEL_TEXT": return "Cofnij";
		// home
		case "HOME_TITLE_TEXT": return "Witamy w projekcie Transcendence!";
		// profile
		case "PROFILE_PROFILE_TEXT": return "";
		case "PROFILE_MATCHES_TEXT": return "";
		case "PROFILE_FRIENDS_TEXT": return "";
		case "PROFILE_USER_PROFILE_TEXT": return "";
		case "PROFILE_CHANGE_AVATAR_TEXT": return "";
		case "PROFILE_CHANGE_NICK_TEXT": return "";
		case "PROFILE_CHANGE_PASSWORD_TEXT": return "";
		case "PROFILE_NEW_NICK_TEXT": return "";
		case "PROFILE_CURRENT_PASSWORD_TEXT": return "";
		case "PROFILE_NEW_PASSWORD_TEXT": return "";
		case "PROFILE_REPEAT_PASSWORD_TEXT": return "";
		case "PROFILE_UPDATE_TEXT": return "";
		case "PROFILE_TOKENS_TEXT": return "";
		case "PROFILE_ENABLE_TOTP_TEXT": return "";
		case "PROFILE_DISABLE_TOTP_TEXT": return "";
		case "PROFILE_LOGOUT_TEXT": return "";
		case "PROFILE_INVALIDATE_TOKEN_TEXT": return "";
		// friends
		case "FRIENDS_ADD_FRIEND_TEXT": return "";
		default: return "PLUnknown text";
	}
}

export function translateBackend({ language, text }) {
	switch (language) {
		case "dutch": return translateDutch(text);
		case "english": return translateEnglish(text);
		case "polish": return translatePolish(text);
	}
}
