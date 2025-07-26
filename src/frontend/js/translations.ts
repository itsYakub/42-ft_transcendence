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

export function translateFrontend({ language, text }) {
	switch (language) {
		case "dutch": return translateDutch(text);
		case "english": return translateEnglish(text);
		case "polish": return translatePolish(text);
	}
}

export function translations() {
	const languageSelect = <HTMLSelectElement>document.getElementById("languageSelect");
	if (languageSelect) {
		// const cookieValue = document.cookie
		// 	.split("; ")
		// 	.find((row) => row.startsWith("language="))
		// 	?.split("=")[1];
		languageSelect.addEventListener("change", (event) => {
			const date = new Date();
			date.setFullYear(date.getFullYear() + 1);
			document.cookie = `language=${languageSelect.value}; expires=${date}`;
		})
	}
}
