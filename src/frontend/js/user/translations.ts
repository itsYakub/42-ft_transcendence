import { navigate } from "../index.js";

export function translationFunctions() {
	const languageSelect = <HTMLSelectElement>document.getElementById("languageSelect");
	if (languageSelect) {
		languageSelect.addEventListener("change", (event) => {
			const date = new Date();
			date.setFullYear(date.getFullYear() + 1);
			document.cookie = `language=${languageSelect.value}; expires=${date}`;
			navigate(window.location.href);
		})
	}
}

export function translateFrontend(text: string) {
	switch (getLanguage()) {
		case "dutch": return translateDutch(text);
		case "english": return translateEnglish(text);
		case "polish": return translatePolish(text);
	}
}

function translateDutch(text: string): string {
	switch (text) {
		case "ERR_AVATAR_TOO_BIG": return "!";
		case "ERR_BAD_PASSWORD": return "!";
		case "ERR_DB": return "!";
		case "ERR_EMAIL_IN_USE": return "!";
		case "ERR_GOOGLE": return "!";
		case "ERR_NO_NEW_PASSWORD": return "!";
		case "ERR_NO_USER": return "!";
		case "ERR_PASSWORDS_DONT_MATCH": return "!";
		case "ERR_SAME_EMAIL": return "!";
		case "ERR_SAME_NAME": return "!";
		case "ERR_TOTP_CODE": return "!";
		case "PROMPT_FRIENDS_EMAIL": return "";
		case "PROMPT_TOTP_CODE": return "";
		case "SUCCESS_ADDED_FRIEND": return "!";
		case "SUCCESS_DISABLED_TOTP": return "!";
		case "SUCCESS_ENABLED_TOTP": return "!";
		case "SUCCESS_INVALIDATED_TOKEN": return "!";
		case "SUCCESS_PASSWORD_CHANGED": return "!";
		default: return "NLUnknown frontend text";
	}
}

function translateEnglish(text: string): string {
	switch (text) {
		case "ERR_AVATAR_TOO_BIG": return "The selected image is too big - 100KiB max!";
		case "ERR_BAD_PASSWORD": return "Incorrect password!";
		case "ERR_DB": return "Database error!";
		case "ERR_EMAIL_IN_USE": return "Email already registered!";
		case "ERR_GOOGLE": return "Couldn't sign in/up with Google!";
		case "ERR_NO_NEW_PASSWORD": return "New password can't be the same as old password!";
		case "ERR_NO_USER": return "User not found!";
		case "ERR_PASSWORDS_DONT_MATCH": return "Please repeat the password!";
		case "ERR_SAME_EMAIL": return "You can't add yourself!";
		case "ERR_SAME_NAME": return "Names must be unique!";
		case "ERR_TOTP_CODE": return "Incorrect TOTP code!";
		case "PROMPT_FRIENDS_EMAIL": return "Friend's email";
		case "PROMPT_TOTP_CODE": return "TOTP code";
		case "SUCCESS_ADDED_FRIEND": return "Added friend!";
		case "SUCCESS_DISABLED_TOTP": return "Disabled TOTP!";
		case "SUCCESS_ENABLED_TOTP": return "Enabled TOTP - please log in again!";
		case "SUCCESS_INVALIDATED_TOKEN": return "Token invalidated!";
		case "SUCCESS_PASSWORD_CHANGED": return "Password changed!";
		default: return "ENUnknown frontend text";
	}
}

function translatePolish(text: string): string {
	switch (text) {
		case "ERR_AVATAR_TOO_BIG": return "!";
		case "ERR_BAD_PASSWORD": return "!";
		case "ERR_DB": return "!";
		case "ERR_EMAIL_IN_USE": return "!";
		case "ERR_GOOGLE": return "!";
		case "ERR_NO_NEW_PASSWORD": return "!";
		case "ERR_NO_USER": return "!";
		case "ERR_PASSWORDS_DONT_MATCH": return "!";
		case "ERR_SAME_EMAIL": return "!";
		case "ERR_SAME_NAME": return "!";
		case "ERR_TOTP_CODE": return "!";
		case "PROMPT_FRIENDS_EMAIL": return "";
		case "PROMPT_TOTP_CODE": return "";
		case "SUCCESS_ADDED_FRIEND": return "!";
		case "SUCCESS_DISABLED_TOTP": return "!";
		case "SUCCESS_ENABLED_TOTP": return "!";
		case "SUCCESS_INVALIDATED_TOKEN": return "!";
		case "SUCCESS_PASSWORD_CHANGED": return "!";
		default: return "PLUnknown frontend text";
	}
}

function getLanguage(): string {
	let language = document.cookie
		.split("; ")
		.find((row) => row.startsWith("language="))
		?.split("=")[1];
	if (!language)
		language = "english";
	return language;
}
