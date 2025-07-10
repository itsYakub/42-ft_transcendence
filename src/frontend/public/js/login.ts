import { navigate } from "./index.js";

export function setupLoginForm() {
	const form = <HTMLFormElement>document.getElementById("loginForm");
	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		const email = form.email.value;
		const password = form.password.value;

		const response = await fetch("/login", {
			method: "POST",
			body: JSON.stringify({
				email, password
			})
		});

		const payload = await response.json();
		if (payload.error) {
			alert(payload.message);
			return;
		}	
		document.dispatchEvent(new Event("login"));
		navigate("/", { "nick": payload.nick, "avatar": payload.avatar });
	});
}
