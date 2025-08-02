import { navigate } from "./index.js";
import { translateFrontend } from "./translations.js";

export function loginFunctions() {
	const loginButton = document.getElementById("loginButton");
	if (loginButton) {
		loginButton.addEventListener("click", async function (e) {
			const dialogShim = <HTMLDialogElement>document.getElementById("dialogShim");
			let dialog = <HTMLDialogElement>document.getElementById("loginDialog");
			dialog.addEventListener("close", (e) => {
				dialogShim.close();
			});
			dialogShim.showModal();
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
				let totpCode = prompt(translateFrontend("PROMPT_TOTP_CODE"));

				if (!totpCode) {
					alert(translateFrontend("ERR_TOTP_CODE"));
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
					alert(translateFrontend("ERR_TOTP_CODE"));
					return;
				}

				if (response.ok) {
					navigate("/");
					return;
				}
			}

			if (payload.error) {
				alert(translateFrontend(payload.error));
				return;
			}

			navigate("/");
		});
	}
}
