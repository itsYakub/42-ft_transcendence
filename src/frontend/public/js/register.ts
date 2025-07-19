import { navigate } from "./index.js";

export function registerRegisterListeners() {
	const registerForm = <HTMLFormElement>document.getElementById("registerForm");
	if (registerForm) {
		registerForm.addEventListener("submit", async (e) => {
			if ("cancelRegisterButton" == e.submitter.id) {
				//form.removeEventListener("submit");
				return;
			}
			e.preventDefault();
			const nick = registerForm.nick.value;
			const email = registerForm.email.value;
			const password = registerForm.password.value;

			const fff = fetch("images/default.jpg");
			const blob = await (await fff).blob();
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = async () => {
				const avatar = reader.result as string;

				const response = await fetch("/register", {
					method: "POST",
					body: JSON.stringify({
						nick, email, password, avatar
					})
				});

				const payload = await response.json();
				if (payload.error) {
					alert(payload.message);
					return;
				}
				//let dialog = <HTMLDialogElement>document.getElementById("registerDialog");
				//dialog.close();
				navigate("/");
			};
		});
	}
}
