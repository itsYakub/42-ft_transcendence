import { navigate, showAlert } from "../index.js";

/*
	The buttons and events create by the /profile page
*/
export function profileFunctions() {
	const profileButton = document.getElementById("profileButton");
	if (profileButton) {
		profileButton.addEventListener("click", () => {
			navigate("/profile");
		}, { once: true });
	}

	const historyButton = document.getElementById("historyButton");
	if (historyButton) {
		historyButton.addEventListener("click", () => {
			navigate("/history");
		}, { once: true });
	}

	const friendsButton = document.getElementById("friendsButton");
	if (friendsButton) {
		friendsButton.addEventListener("click", () => {
			navigate("/friends");
		}, { once: true });
	}

	const messagesButton = document.getElementById("messagesButton");
	if (messagesButton) {
		messagesButton.addEventListener("click", () => {
			navigate("/messages");
		}, { once: true });
	}

	/*
		Shows the dialog to choose a file
	*/
	const avatarUploadButton = <HTMLInputElement>document.querySelector("#avatarFilename");
	const avatarImage = document.querySelector("#avatarImage");
	if (avatarImage) {
		avatarImage.addEventListener("click", () => {
			avatarUploadButton.click();
		})
	}

	/*
		Updates the user's avatar
	*/
	if (avatarUploadButton) {
		avatarUploadButton.addEventListener("change", () => {
			const files = avatarUploadButton.files;
			if (1 == files.length) {
				if (files[0].size > 100 * 1024) {
					showAlert("ERR_AVATAR_TOO_BIG");
					return;
				}

				const reader = new FileReader();
				reader.readAsDataURL(files[0]);
				reader.onloadend = async () => {
					let index = 23;
					if (files[0].name.endsWith(".png"))
						index = 22;
					let avatar = reader.result as string;
					avatar = avatar.substring(index);

					avatar = replaceInvalidBase64Chars(avatar);

					const response = await fetch("/profile/avatar", {
						method: "POST",
						headers: {
							"content-type": "application/json"
						},
						body: JSON.stringify({
							avatar,
							type: 23 == index ? "jpeg" : "png"
						})
					});

					const message = await response.json();
					if (!message.error)
						navigate("/profile");
					else
						showAlert(message.error);
				}
			}
		});
	}

	function replaceInvalidBase64Chars(input: string) {
	return input.replace(/[=+/]/g, charToBeReplaced => {
		switch (charToBeReplaced) {
			case '=':
				return '';
			case '+':
				return '#';
			case '/':
				return '_';
		}
	});
};

	/*
		Updates the user's nickname
	*/
	const changeNickForm = <HTMLFormElement>document.querySelector("#changeNickForm");
	if (changeNickForm) {
		changeNickForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const nick = changeNickForm.newNick.value;
			const response = await fetch("/profile/nick", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					nick
				})
			});

			const message = await response.json();
			if (!message.error) {
				const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
				alertDialog.addEventListener("close", () => {
					navigate("/profile");
				});
				showAlert("done");
			}
			else
				showAlert(message.error);
		});
	}

	/*
		Updates a user's password
	*/
	const changePasswordForm = <HTMLFormElement>document.querySelector("#changePasswordForm");
	if (changePasswordForm) {
		changePasswordForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const currentPassword = changePasswordForm.currentPassword.value;
			const newPassword = changePasswordForm.newPassword.value;
			const repeatPassword = changePasswordForm.repeatPassword.value;
			if (newPassword != repeatPassword) {
				showAlert("ERR_PASSWORDS_DONT_MATCH");
				return;
			}

			if (newPassword == currentPassword) {
				showAlert("ERR_NO_NEW_PASSWORD");
				return;
			}

			const response = await fetch("/profile/password", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					currentPassword,
					newPassword
				})
			});

			const message = await response.json();
			if (!message.error) {
				const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
				alertDialog.addEventListener("close", () => {
					navigate("/profile");
				});
				showAlert("SUCCESS_PASSWORD_CHANGED");
			}
			else
				showAlert(message.error);
		});
	}

	/*
		Shows the dialog to scan the TOTP QR code
	*/
	const enableTOTPButton = document.querySelector("#enableTOTPButton");
	if (enableTOTPButton) {
		enableTOTPButton.addEventListener("click", async () => {
			const response = await fetch("/profile/totp/enable", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({})
			});

			if (response.ok) {
				const json = await response.json();

				const qrCode = document.querySelector("#totpQRCode");
				qrCode.innerHTML = json.qrcode;

				const totpSecret = document.querySelector("#totpSecret");
				totpSecret.innerHTML = json.secret;

				const totpDialog = <HTMLDialogElement>document.querySelector("#totpDialog");
				totpDialog.showModal();
			}
		});
	}

	/*
		Turns off TOTP
	*/
	const disableTOTPButton = document.querySelector("#disableTOTPButton");
	if (disableTOTPButton) {
		disableTOTPButton.addEventListener("click", async () => {
			// password protect this!
			const response = await fetch("/profile/totp/disable", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({})
			});

			const json = await response.json();
			if (!json.error) {
				const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
				alertDialog.addEventListener("close", async () => {
					navigate("/profile");
				});
				showAlert("SUCCESS_DISABLED_TOTP");
			}
		});
	}

	/*
		Checks the entered TOTP code
	*/
	const totpForm = <HTMLFormElement>document.querySelector("#totpForm");
	if (totpForm) {
		totpForm.code.addEventListener("keydown", (e: any) => {
			if (!("Escape" == e.key || "Enter" == e.key || "Backspace" == e.key || "Delete" == e.key || "ArrowLeft" == e.key || "ArrowRight" == e.key) && isNaN(e.key))
				e.preventDefault();
		});

		totpForm.addEventListener("submit", async (e) => {
			if ("cancelTOTPButton" == e.submitter.id)
				return;

			e.preventDefault();
			const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
			const code = totpForm.code.value;

			const response = await fetch("/profile/totp/verify", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					code
				})
			});

			const json = await response.json();
			if (!json.error) {
				alertDialog.addEventListener("close", async () => {
					const response = await fetch("/user/logout");
					if (response.ok)
						navigate("/");
				});
				showAlert("SUCCESS_ENABLED_TOTP");
				return;
			}

			alertDialog.addEventListener("close", () => {
				totpForm.code.value = "";
				totpForm.code.focus();
			});
			showAlert("ERR_TOTP_CODE");
		});
	}

	/*
		Logs out the user and returns to the home page
	*/
	const logoutButton = document.querySelector("#logoutButton");
	if (logoutButton) {
		logoutButton.addEventListener("click", async () => {
			const response = await fetch("/user/logout");
			if (response.ok)
				navigate("/");
		}, { once: true });
	}

	/*
		Invalidates the user's refresh token, forcing a new log in even if someone has the token
	*/
	const invalidateTokenButton = document.querySelector("#invalidateTokenButton");
	if (invalidateTokenButton) {
		invalidateTokenButton.addEventListener("click", async () => {
			const response = await fetch("/user/invalidate-token", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({})
			});

			const json = await response.json();
			if (!json.error) {
				const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
				alertDialog.addEventListener("close", () => {
					navigate("/");
				});
				showAlert("SUCCESS_INVALIDATED_TOKEN");
			}
		}, { once: true });
	}
}
