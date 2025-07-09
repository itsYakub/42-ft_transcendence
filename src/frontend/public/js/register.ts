import { navigate } from "./index.js";

export function setupRegisterForm() {
	const form = <HTMLFormElement>document.getElementById("registerForm");
	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		const nick = form.nick.value;
		const email = form.email.value;
		const password = form.password.value;

		const response = await fetch("/register", {
			method: "POST",
			body: JSON.stringify({
				nick, email, password
			})
		});

		const payload = await response.json();
		if (payload.error) {
			alert(payload.message);
			return;
		}
		var date = new Date();
		date.setDate(date.getDate() + 3);
		document.cookie = `jwt=${payload.jwt}; expires=${date}`;		
		document.dispatchEvent(new Event("login"));
		navigate("/");
	});
}
