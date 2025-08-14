function translateDutch(text: string): string {
	switch (text) {
		// errors
		case "ERR_FORBIDDEN": return "!";
		case "ERR_FULL": return "!";
		case "ERR_NOT_FOUND": return "!";
		// navbar, including register and log in dialogs
		case "NAVBAR_HOME_TEXT": return "Start";
		case "NAVBAR_PLAY_TEXT": return "Speel!";
		case "NAVBAR_TOURNAMENT_TEXT": return "Toernooi";
		case "NAVBAR_TOTP_CODE_TITLE_TEXT": return "";
		case "NAVBAR_TOTP_CODE_TEXT": return "";
		case "NAVBAR_TOTP_CODE_VERIFY_TEXT": return "";
		case "NAVBAR_PLAYER_NAME_TITLE_TEXT": return "";
		case "NAVBAR_PLAYER_NAME_TEXT": return "";
		case "NAVBAR_PLAYER_NAME_SET_TEXT": return "";
		// user
		case "USER_TITLE_TEXT": return "";
		case "USER_FORM_TITLE_TEXT": return "Inloggen of registreren";
		case "USER_EMAIL_TEXT": return "Mail";
		case "USER_PASSWORD_TEXT": return "Hasło";
		case "USER_LOGIN_TEXT": return "Inloggen";
		case "USER_REGISTER_TEXT": return "Registreren";
		case "USER_GOOGLE_TITLE_TEXT": return "";
		case "USER_GUEST_TITLE_TEXT": return "";
		// home
		case "HOME_TITLE_TEXT": return "Welkom bij Transcendence!";
		// profile
		case "PROFILE_PROFILE_TEXT": return "";
		case "PROFILE_HISTORY_TEXT": return "";
		case "PROFILE_FRIENDS_TEXT": return "";
		case "PROFILE_MESSAGES_TEXT": return "";
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
		// history
		case "HISTORY_PROFILE_TEXT": return "";
		case "HISTORY_HISTORY_TEXT": return "";
		case "HISTORY_FRIENDS_TEXT": return "";
		case "HISTORY_MESSAGES_TEXT": return "";
		case "HISTORY_WON_TEXT": return "";
		case "HISTORY_MATCH_SINGULAR_TEXT": return "";
		case "HISTORY_MATCH_PLURAL_TEXT": return "";
		case "HISTORY_TOURNAMENT_SINGULAR_TEXT": return "";
		case "HISTORY_TOURNAMENT_PLURAL_TEXT": return "";
		// friends
		case "FRIENDS_PROFILE_TEXT": return "";
		case "FRIENDS_HISTORY_TEXT": return "";
		case "FRIENDS_FRIENDS_TEXT": return "";
		case "FRIENDS_MESSAGES_TEXT": return "";
		case "FRIENDS_ONLINE_TEXT": return "";
		case "FRIENDS_OFFLINE_TEXT": return "";
		case "FRIENDS_REMOVE_TEXT": return "";
		case "FRIENDS_ADD_TITLE_TEXT": return "";
		case "FRIENDS_ADD_EMAIL_TEXT": return "";
		case "FRIENDS_ADD_FRIEND_TEXT": return "";
		// messages
		case "MESSAGES_PROFILE_TEXT": return "";
		case "MESSAGES_HISTORY_TEXT": return "";
		case "MESSAGES_FRIENDS_TEXT": return "";
		case "MESSAGES_MESSAGES_TEXT": return "";
		case "MESSAGES_SEND_TEXT": return "";
		// play
		case "PLAY_SINGLE_GAME_TEXT": return "";
		case "PLAY_PLAYER_TEXT": return "";
		case "PLAY_READY_TEXT": return "";
		case "PLAY_MATCH_TEXT": return "";
		case "PLAY_TOURNAMENT_TEXT": return "";
		case "PLAY_SEND_TEXT": return "";
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
		case "TOURNAMENT_READY_TEXT": return "";
		case "TOURNAMENT_SEND_TEXT": return "";
		default: return "NLUnknown text";
	}
}

function translateEnglish(text: string): string {
	switch (text) {
		// errors
		case "ERR_FORBIDDEN": return "Forbidden!";
		case "ERR_FULL": return "Room full!";
		case "ERR_NOT_FOUND": return "Not found!";
		// navbar, including register and log in dialogs
		case "NAVBAR_HOME_TEXT": return "Home";
		case "NAVBAR_PLAY_TEXT": return "Play!";
		case "NAVBAR_TOURNAMENT_TEXT": return "Tournament";
		case "NAVBAR_TOTP_CODE_TITLE_TEXT": return "Enter TOTP code";
		case "NAVBAR_TOTP_CODE_TEXT": return "Code";
		case "NAVBAR_TOTP_CODE_VERIFY_TEXT": return "Verify";
		case "NAVBAR_PLAYER_NAME_TITLE_TEXT": return "Choose a name";
		case "NAVBAR_PLAYER_NAME_TEXT": return "Player name";
		case "NAVBAR_PLAYER_NAME_SET_TEXT": return "Set";
		// user
		case "USER_TITLE_TEXT": return "Please choose an option to continue";
		case "USER_FORM_TITLE_TEXT": return "Log in or register";
		case "USER_EMAIL_TEXT": return "Email";
		case "USER_PASSWORD_TEXT": return "Password";
		case "USER_LOGIN_TEXT": return "Log in";
		case "USER_REGISTER_TEXT": return "Register";
		case "USER_GOOGLE_TITLE_TEXT": return "Continue with Google";
		case "USER_GUEST_TITLE_TEXT": return "Continue as a guest";
		// home
		case "HOME_TITLE_TEXT": return "Welcome to Transcendence!";
		// profile
		case "PROFILE_PROFILE_TEXT": return "Profile";
		case "PROFILE_HISTORY_TEXT": return "History";
		case "PROFILE_FRIENDS_TEXT": return "Friends";
		case "PROFILE_MESSAGES_TEXT": return "Messages";
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
		// history
		case "HISTORY_PROFILE_TEXT": return "Profile";
		case "HISTORY_HISTORY_TEXT": return "History";
		case "HISTORY_FRIENDS_TEXT": return "Friends";
		case "HISTORY_MESSAGES_TEXT": return "Messages";
		case "HISTORY_WON_TEXT": return "Won";
		case "HISTORY_MATCH_SINGULAR_TEXT": return "match";
		case "HISTORY_MATCH_PLURAL_TEXT": return "matches";
		case "HISTORY_TOURNAMENT_SINGULAR_TEXT": return "tournament";
		case "HISTORY_TOURNAMENT_PLURAL_TEXT": return "tournaments";
		// friends
		case "FRIENDS_PROFILE_TEXT": return "Profile";
		case "FRIENDS_HISTORY_TEXT": return "History";
		case "FRIENDS_FRIENDS_TEXT": return "Friends";
		case "FRIENDS_MESSAGES_TEXT": return "Messages";
		case "FRIENDS_ONLINE_TEXT": return "Online";
		case "FRIENDS_OFFLINE_TEXT": return "Offline";
		case "FRIENDS_REMOVE_TEXT": return "Remove";
		case "FRIENDS_ADD_TITLE_TEXT": return "Friend's email address";
		case "FRIENDS_ADD_EMAIL_TEXT": return "Email";
		case "FRIENDS_ADD_FRIEND_TEXT": return "Add friend";
		// messages
		case "MESSAGES_PROFILE_TEXT": return "Profile";
		case "MESSAGES_HISTORY_TEXT": return "History";
		case "MESSAGES_FRIENDS_TEXT": return "Friends";
		case "MESSAGES_MESSAGES_TEXT": return "Messages";
		case "MESSAGES_SEND_TEXT": return "Send";
		// play
		case "PLAY_SINGLE_GAME_TEXT": return "Single game";
		case "PLAY_PLAYER_TEXT": return "Player";
		case "PLAY_READY_TEXT": return "Ready";
		case "PLAY_MATCH_TEXT": return "Match";
		case "PLAY_TOURNAMENT_TEXT": return "Tournament";
		case "PLAY_SEND_TEXT": return "Send";
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
		case "TOURNAMENT_READY_TEXT": return "Ready";
		case "TOURNAMENT_SEND_TEXT": return "Send";
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
		case "NAVBAR_HOME_TEXT": return "Strona Główna";
		case "NAVBAR_PLAY_TEXT": return "Graj!";
		case "NAVBAR_TOURNAMENT_TEXT": return "Turniej";
		case "NAVBAR_TOTP_CODE_TITLE_TEXT": return "";
		case "NAVBAR_TOTP_CODE_TEXT": return "";
		case "NAVBAR_TOTP_CODE_VERIFY_TEXT": return "";
		case "NAVBAR_PLAYER_NAME_TITLE_TEXT": return "";
		case "NAVBAR_PLAYER_NAME_TEXT": return "";
		case "NAVBAR_PLAYER_NAME_SET_TEXT": return "";
		// user
		case "USER_TITLE_TEXT": return "";
		case "USER_FORM_TITLE_TEXT": return "Zaloguj się lub załóż konto";
		case "USER_EMAIL_TEXT": return "Mail";
		case "USER_PASSWORD_TEXT": return "Hasło";
		case "USER_LOGIN_TEXT": return "Zaloguj się";
		case "USER_REGISTER_TEXT": return "Załóż konto";
		case "USER_GOOGLE_TITLE_TEXT": return "";
		case "USER_GUEST_TITLE_TEXT": return "";
		// home
		case "HOME_TITLE_TEXT": return "Witamy w projekcie Transcendence!";
		// profile
		case "PROFILE_PROFILE_TEXT": return "";
		case "PROFILE_HISTORY_TEXT": return "";
		case "PROFILE_FRIENDS_TEXT": return "";
		case "PROFILE_MESSAGES_TEXT": return "";
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
		// history
		case "HISTORY_PROFILE_TEXT": return "";
		case "HISTORY_HISTORY_TEXT": return "";
		case "HISTORY_FRIENDS_TEXT": return "";
		case "HISTORY_MESSAGES_TEXT": return "";
		case "HISTORY_WON_TEXT": return "";
		case "HISTORY_MATCH_SINGULAR_TEXT": return "";
		case "HISTORY_MATCH_PLURAL_TEXT": return "";
		case "HISTORY_TOURNAMENT_SINGULAR_TEXT": return "";
		case "HISTORY_TOURNAMENT_PLURAL_TEXT": return "";
		// friends
		case "FRIENDS_PROFILE_TEXT": return "";
		case "FRIENDS_HISTORY_TEXT": return "";
		case "FRIENDS_FRIENDS_TEXT": return "";
		case "FRIENDS_MESSAGES_TEXT": return "";
		case "FRIENDS_ONLINE_TEXT": return "";
		case "FRIENDS_OFFLINE_TEXT": return "";
		case "FRIENDS_REMOVE_TEXT": return "";
		case "FRIENDS_ADD_TITLE_TEXT": return "";
		case "FRIENDS_ADD_EMAIL_TEXT": return "";
		case "FRIENDS_ADD_FRIEND_TEXT": return "";
		// messages
		case "MESSAGES_PROFILE_TEXT": return "";
		case "MESSAGES_HISTORY_TEXT": return "";
		case "MESSAGES_FRIENDS_TEXT": return "";
		case "MESSAGES_MESSAGES_TEXT": return "";
		case "MESSAGES_SEND_TEXT": return "";
		// play
		case "PLAY_SINGLE_GAME_TEXT": return "";
		case "PLAY_PLAYER_TEXT": return "";
		case "PLAY_READY_TEXT": return "";
		case "PLAY_MATCH_TEXT": return "";
		case "PLAY_TOURNAMENT_TEXT": return "";
		case "PLAY_SEND_TEXT": return "";
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
		case "TOURNAMENT_READY_TEXT": return "";
		case "TOURNAMENT_SEND_TEXT": return "";
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
