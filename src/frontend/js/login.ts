import { navigate, showAlert } from "./index.js";

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
				const totpCodeDialog = <HTMLDialogElement>document.querySelector("#totpCodeDialog");
				if (totpCodeDialog)
					totpCodeDialog.showModal();

				const totpCodeForm = <HTMLFormElement>document.querySelector("#totpCodeForm");
				if (totpCodeForm) {
					totpCodeForm.code.addEventListener("keydown", (e: any) => {
						if (e.key != "Enter" && isNaN(e.key))
							e.preventDefault();
					});

					totpCodeForm.addEventListener("submit", async (e) => {
						if ("cancelTotpCodeButton" == e.submitter.id)
							return;

						e.preventDefault();
						const response = await fetch("/user/totp/check", {
							method: "POST",
							body: JSON.stringify({
								email,
								password,
								code: totpCodeForm.code.value
							})
						});

						const totpResponse = await response.json();
						if (totpResponse.error) {
							const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
							alertDialog.addEventListener("close", () => {
								totpCodeForm.code.value = "";
								totpCodeForm.code.focus();
							});
							showAlert("ERR_TOTP_CODE");
							return;
						}

						navigate("/");
					});
				}
			}
			else if (payload.error) {
				showAlert(payload.error);
				return;
			}
			else
				navigate("/");
		});
	}
}
