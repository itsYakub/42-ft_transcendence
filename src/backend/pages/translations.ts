function translateDutch(text: string): string {
	switch (text) {
		// navbar, including register and log in dialogs
		case "NAVBAR_HOME_TEXT": return "Start";
		case "NAVBAR_PLAY_TEXT": return "Speel!";
		case "NAVBAR_TOURNAMENT_TEXT": return "Toernooi";
		case "NAVBAR_LOGIN_TEXT": return "Inloggen";
		case "NAVBAR_OR_TEXT": return "of";
		case "NAVBAR_REGISTER_TEXT": return "Registreren";
		case "NAVBAR_REGISTER_TITLE_TEXT": return "";
		case "NAVBAR_LOGIN_TITLE_TEXT": return "";
		case "NAVBAR_NICK_TEXT": return "";
		case "NAVBAR_EMAIL_TEXT": return "";
		case "NAVBAR_PASSWORD_TEXT": return "";
		case "NAVBAR_TOTP_CODE_TITLE_TEXT": return "";
		case "NAVBAR_TOTP_CODE_TEXT": return "";
		case "NAVBAR_TOTP_CODE_VERIFY_TEXT": return "";
		// home
		case "HOME_TITLE_TEXT": return "Welkom bij Transcendence!";
		// profile
		case "PROFILE_PROFILE_TEXT": return "";
		case "PROFILE_MATCHES_TEXT": return "";
		case "PROFILE_FRIENDS_TEXT": return "";
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
		case "PROFILE_TOTP_TITLE_TEXT": return "";
		case "PROFILE_TOTP_SCAN_TEXT": return "";
		case "PROFILE_TOTP_INPUT_TEXT": return "";
		case "PROFILE_TOTP_CODE_TEXT": return "";
		case "PROFILE_TOTP_VERIFY_TEXT": return "";
		// matches
		case "MATCHES_PROFILE_TEXT": return "";
		case "MATCHES_MATCHES_TEXT": return "";
		case "MATCHES_FRIENDS_TEXT": return "";
		case "MATCHES_WON_TEXT": return "";
		case "MATCHES_MATCH_SINGULAR_TEXT": return "";
		case "MATCHES_MATCH_PLURAL_TEXT": return "";
		case "MATCHES_TOURNAMENT_SINGULAR_TEXT": return "";
		case "MATCHES_TOURNAMENT_PLURAL_TEXT": return "";
		// friends
		case "FRIENDS_PROFILE_TEXT": return "";
		case "FRIENDS_MATCHES_TEXT": return "";
		case "FRIENDS_FRIENDS_TEXT": return "";
		case "FRIENDS_ONLINE_TEXT": return "";
		case "FRIENDS_OFFLINE_TEXT": return "";
		case "FRIENDS_REMOVE_TEXT": return "";
		case "FRIENDS_ADD_TITLE_TEXT": return "";
		case "FRIENDS_ADD_EMAIL_TEXT": return "";
		case "FRIENDS_ADD_FRIEND_TEXT": return "";
		// play
		case "PLAY_SINGLE_GAME_TEXT": return "";
		case "PLAY_PLAYER_TEXT": return "";
		case "PLAY_START_TEXT": return "";
		// tournament
		case "TOURNAMENT_NEW_TEXT": return "";
		case "TOURNAMENT_PLAYER_TEXT": return "";
		case "TOURNAMENT_START_TEXT": return "";
		case "TOURNAMENT_TITLE_TEXT": return "";
		case "TOURNAMENT_CODE_TEXT": return "";
		case "TOURNAMENT_SEMI_FINALS_TEXT": return "";
		case "TOURNAMENT_FINAL_TEXT": return "";
		case "TOURNAMENT_TBD_TEXT": return "";
		case "TOURNAMENT_NEXT_MATCH_TEXT": return "";
		case "TOURNAMENT_PLAY_TEXT": return "";
		case "TOURNAMENT_CONGRATULATIONS_TEXT": return "";
		case "TOURNAMENT_UNKNOWN_TEXT": return "";
		default: return "NLUnknown text";
	}
}

function translateEnglish(text: string): string {
	switch (text) {
		// navbar, including register and log in dialogs
		case "NAVBAR_HOME_TEXT": return "Home";
		case "NAVBAR_PLAY_TEXT": return "Play!";
		case "NAVBAR_TOURNAMENT_TEXT": return "Tournament";
		case "NAVBAR_LOGIN_TEXT": return "Log in";
		case "NAVBAR_OR_TEXT": return "or";
		case "NAVBAR_REGISTER_TEXT": return "Register";
		case "NAVBAR_REGISTER_TITLE_TEXT": return "Register a new Account";
		case "NAVBAR_LOGIN_TITLE_TEXT": return "Log in to your account";
		case "NAVBAR_NICK_TEXT": return "Nickname";
		case "NAVBAR_EMAIL_TEXT": return "Email";
		case "NAVBAR_PASSWORD_TEXT": return "Password";
		case "NAVBAR_TOTP_CODE_TITLE_TEXT": return "Enter TOTP code";
		case "NAVBAR_TOTP_CODE_TEXT": return "Code";
		case "NAVBAR_TOTP_CODE_VERIFY_TEXT": return "Verify";
		// home
		case "HOME_TITLE_TEXT": return "Welcome to Transcendence!";
		// profile
		case "PROFILE_PROFILE_TEXT": return "Profile";
		case "PROFILE_MATCHES_TEXT": return "Matches";
		case "PROFILE_FRIENDS_TEXT": return "Friends";
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
		case "PROFILE_TOTP_TITLE_TEXT": return "TOTP";
		case "PROFILE_TOTP_SCAN_TEXT": return "Scan the QR code or enter this key into your authenticator app";
		case "PROFILE_TOTP_INPUT_TEXT": return "And input the code below";
		case "PROFILE_TOTP_CODE_TEXT": return "Code";
		case "PROFILE_TOTP_VERIFY_TEXT": return "Verify";
		// matches
		case "MATCHES_PROFILE_TEXT": return "Profile";
		case "MATCHES_MATCHES_TEXT": return "Matches";
		case "MATCHES_FRIENDS_TEXT": return "Friends";
		case "MATCHES_WON_TEXT": return "Won";
		case "MATCHES_MATCH_SINGULAR_TEXT": return "match";
		case "MATCHES_MATCH_PLURAL_TEXT": return "matches";
		case "MATCHES_TOURNAMENT_SINGULAR_TEXT": return "tournament";
		case "MATCHES_TOURNAMENT_PLURAL_TEXT": return "tournaments";
		// friends
		case "FRIENDS_PROFILE_TEXT": return "Profile";
		case "FRIENDS_MATCHES_TEXT": return "Matches";
		case "FRIENDS_FRIENDS_TEXT": return "Friends";
		case "FRIENDS_ONLINE_TEXT": return "Online";
		case "FRIENDS_OFFLINE_TEXT": return "Offline";
		case "FRIENDS_REMOVE_TEXT": return "Remove";
		case "FRIENDS_ADD_TITLE_TEXT": return "Friend's email address";
		case "FRIENDS_ADD_EMAIL_TEXT": return "Email";
		case "FRIENDS_ADD_FRIEND_TEXT": return "Add friend";
		// play
		case "PLAY_SINGLE_GAME_TEXT": return "Single game";
		case "PLAY_PLAYER_TEXT": return "Player";
		case "PLAY_START_TEXT": return "Start";
		// tournament
		case "TOURNAMENT_NEW_TEXT": return "New tournament";
		case "TOURNAMENT_PLAYER_TEXT": return "Player";
		case "TOURNAMENT_START_TEXT": return "Start";
		case "TOURNAMENT_TITLE_TEXT": return "Tournament";
		case "TOURNAMENT_CODE_TEXT": return "Tournament code";
		case "TOURNAMENT_SEMI_FINALS_TEXT": return "Semi-finals";
		case "TOURNAMENT_FINAL_TEXT": return "Final";
		case "TOURNAMENT_TBD_TEXT": return "TBD";
		case "TOURNAMENT_NEXT_MATCH_TEXT": return "Next match";
		case "TOURNAMENT_PLAY_TEXT": return "Play";
		case "TOURNAMENT_CONGRATULATIONS_TEXT": return "Congratulations";
		case "TOURNAMENT_UNKNOWN_TEXT": return "No tournament with that code exists";
		default: return "ENUnknown text";
	}
}

function translatePolish(text: string): string {
	switch (text) {
		// navbar, including register and log in dialogs
		case "NAVBAR_HOME_TEXT": return "Strona Główna";
		case "NAVBAR_PLAY_TEXT": return "Graj!";
		case "NAVBAR_TOURNAMENT_TEXT": return "Turniej";
		case "NAVBAR_LOGIN_TEXT": return "Zaloguj się";
		case "NAVBAR_OR_TEXT": return "lub";
		case "NAVBAR_REGISTER_TEXT": return "Zapisać się";
		case "NAVBAR_REGISTER_TITLE_TEXT": return "";
		case "NAVBAR_LOGIN_TITLE_TEXT": return "";
		case "NAVBAR_NICK_TEXT": return "Nick";
		case "NAVBAR_EMAIL_TEXT": return "Mail";
		case "NAVBAR_PASSWORD_TEXT": return "Hasło";
		case "NAVBAR_TOTP_CODE_TITLE_TEXT": return "";
		case "NAVBAR_TOTP_CODE_TEXT": return "";
		case "NAVBAR_TOTP_CODE_VERIFY_TEXT": return "";
		// home
		case "HOME_TITLE_TEXT": return "Witamy w projekcie Transcendence!";
		// profile
		case "PROFILE_PROFILE_TEXT": return "";
		case "PROFILE_MATCHES_TEXT": return "";
		case "PROFILE_FRIENDS_TEXT": return "";
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
		case "PROFILE_TOTP_TITLE_TEXT": return "";
		case "PROFILE_TOTP_SCAN_TEXT": return "";
		case "PROFILE_TOTP_INPUT_TEXT": return "";
		case "PROFILE_TOTP_CODE_TEXT": return "";
		case "PROFILE_TOTP_VERIFY_TEXT": return "";
		// matches
		case "MATCHES_PROFILE_TEXT": return "";
		case "MATCHES_MATCHES_TEXT": return "";
		case "MATCHES_FRIENDS_TEXT": return "";
		case "MATCHES_WON_TEXT": return "";
		case "MATCHES_MATCH_SINGULAR_TEXT": return "";
		case "MATCHES_MATCH_PLURAL_TEXT": return "";
		case "MATCHES_TOURNAMENT_SINGULAR_TEXT": return "";
		case "MATCHES_TOURNAMENT_PLURAL_TEXT": return "";
		// friends
		case "FRIENDS_PROFILE_TEXT": return "";
		case "FRIENDS_MATCHES_TEXT": return "";
		case "FRIENDS_FRIENDS_TEXT": return "";
		case "FRIENDS_ONLINE_TEXT": return "";
		case "FRIENDS_OFFLINE_TEXT": return "";
		case "FRIENDS_REMOVE_TEXT": return "";
		case "FRIENDS_ADD_TITLE_TEXT": return "";
		case "FRIENDS_ADD_EMAIL_TEXT": return "";
		case "FRIENDS_ADD_FRIEND_TEXT": return "";
		// play
		case "PLAY_SINGLE_GAME_TEXT": return "";
		case "PLAY_PLAYER_TEXT": return "";
		case "PLAY_START_TEXT": return "";
		// tournament
		case "TOURNAMENT_NEW_TEXT": return "";
		case "TOURNAMENT_PLAYER_TEXT": return "";
		case "TOURNAMENT_START_TEXT": return "";
		case "TOURNAMENT_TITLE_TEXT": return "";
		case "TOURNAMENT_CODE_TEXT": return "";
		case "TOURNAMENT_SEMI_FINALS_TEXT": return "";
		case "TOURNAMENT_FINAL_TEXT": return "";
		case "TOURNAMENT_TBD_TEXT": return "";
		case "TOURNAMENT_NEXT_MATCH_TEXT": return "";
		case "TOURNAMENT_PLAY_TEXT": return "";
		case "TOURNAMENT_CONGRATULATIONS_TEXT": return "";
		case "TOURNAMENT_UNKNOWN_TEXT": return "";
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
