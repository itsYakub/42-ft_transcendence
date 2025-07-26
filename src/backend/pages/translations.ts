function translateDutch({ text }) {
	switch (text) {
		case "": return "";
		default: return "Unknown text";
	}
}

function translateEnglish({ text }) {
	switch (text) {
		case "": return "";
		default: return "Unknown text";
	}
}

function translatePolish({ text }) {
	switch (text) {
		case "": return "";
		default: return "Unknown text";
	}
}

export function translateBackend({ language, text }) {
	switch (language) {
		case "dutch": return translateDutch(text);
		case "english": return translateEnglish(text);
		case "polish": return translatePolish(text);
	}
}
