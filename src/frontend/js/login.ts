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

			if (payload.totpEnabled) {
				let totpCode = prompt("TOTP code:");

				if (!totpCode) {
					alert("Bad code!");
					return;
				}

				const response = await fetch("/user/totp/check", {
					method: "POST",
					body: JSON.stringify({
						email,
						password,
						code: totpCode
					})
				});

				const totpResponse = await response.json();
				if (totpResponse.error) {
					// translate!
					alert(totpResponse.error);
					return;
				}

				if (response.ok) {
					navigate("/");
					return;
				}
			}

			if (payload.error) {
				alert(payload.error);
				return;
			}
			
			navigate("/");
		});
	}
}
