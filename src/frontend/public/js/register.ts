function validEmail(email) {
	return true;//(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
}

function checkNick(nick: string): string {
	return nick.length > 0 ? "" : "Please provide a nickname";
}

function checkEmail(email: string): string {
	return validEmail(email) ? "" : "Invalid email";
}

function checkPassword(password: string): string {
	return password.length > 7 ? "" : "Password needs to be 8+ characters";
}

export function setupRegisterForm() {
	document.getElementById("signupButton").addEventListener("click", async () => {
		const nick = (<HTMLInputElement>document.getElementById("nickBox")).value;
		const email = (<HTMLInputElement>document.getElementById("emailBox")).value;
		const password = (<HTMLInputElement>document.getElementById("passwordBox")).value;
		const nickError = checkNick(nick);
		const emailError = checkEmail(nick);
		const passwordError = checkPassword(nick);
		document.getElementById("nickError").textContent = nickError;
		document.getElementById("emailError").textContent = emailError;
		document.getElementById("passwordError").textContent = passwordError;

		// Frontend okay, now to check with the db
		if (0 == nickError.length + emailError.length + passwordError.length) {
			const response = await fetch("/register", {
				method: "POST",
				body: JSON.stringify({
					nick, email, password
				})
			});
		}

		// const errors = {
		// 	nick: checkNick(nick),
		// 	email: checkEmail(email),
		// 	password: checkPassword(password)
		// }
		// console.log(errors);
		// const response = await fetch("/register", {
		// 	method: "POST",
		// 	body: JSON.stringify({
		// 		nick, email, password
		// 	})
		// });
		// check response for error messages and update ui!
	});
}
