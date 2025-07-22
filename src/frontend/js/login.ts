import { navigate } from "./index.js";

export function loginFunctions() {
	const loginButton = document.getElementById("loginButton");
	if (loginButton) {
		loginButton.addEventListener("click", async function (e) {
			let dialog = <HTMLDialogElement>document.getElementById("loginDialog");
			dialog.showModal();
		});
	}

	const loginForm = <HTMLFormElement>document.getElementById("loginForm");
	if (loginForm) {
		loginForm.addEventListener("submit", async (e) => {
			if ("cancelLoginButton" == e.submitter.id)
				return;
			
			e.preventDefault();
			const email = loginForm.email.value;
			const password = loginForm.password.value;

			const response = await fetch("/user/login", {
				method: "POST",
				body: JSON.stringify({
					email, password
				})
			});

			const payload = await response.json();
			if (payload.error) {
				alert(payload.error);
				return;
			}
			navigate("/");
		});
	}
}
