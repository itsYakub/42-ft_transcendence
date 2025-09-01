import { doesNotMatch } from "assert";
import { Result, TotpType } from "../../../common/interfaces.js";
import { navigate, showAlert } from "../index.js";
import { closeSocket } from "../sockets/clientSocket.js";
import { prePassVertex } from "babylonjs/Shaders/ShadersInclude/prePassVertex";

/*
	The buttons and events create by the /profile page
*/
export function accountListeners() {
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
					showAlert(Result.ERR_AVATAR_TOO_BIG);
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

					const response = await fetch("/account/avatar", {
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
						navigate("/account");
					else
						showAlert(message.error);
				}
			}
		});
	}

	/*
		Updates the user's nickname
	*/
	const changeNickForm = <HTMLFormElement>document.querySelector("#changeNickForm");
	if (changeNickForm) {
		changeNickForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const newNick = changeNickForm.newNick.value;
			const response = await fetch("/account/nick", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					newNick
				})
			});

			const message = await response.json();
			if (Result.SUCCESS != message.result) {
				showAlert(message.error);
				return;
			}

			const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
			alertDialog.addEventListener("close", () => {
				navigate("/account");
			});
			showAlert(Result.SUCCESS);
		});
	}

	/*
		Updates a user's password
	*/
	const changePasswordForm = <HTMLFormElement>document.querySelector("#changePasswordForm");
	if (changePasswordForm) {
		changePasswordForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const checkPassword = changePasswordForm.currentPassword.value;
			const newPassword = changePasswordForm.newPassword.value;
			const repeatPassword = changePasswordForm.repeatPassword.value;
			if (newPassword != repeatPassword) {
				showAlert(Result.ERR_PASSWORDS_DONT_MATCH);
				return;
			}

			if (newPassword == checkPassword) {
				showAlert(Result.ERR_NO_NEW_PASSWORD);
				return;
			}

			const response = await fetch("/account/password", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					checkPassword,
					newPassword
				})
			});

			const code = await response.json();
			switch (code.result) {
				case Result.SUCCESS:
					const alertDialog = <HTMLDialogElement>document.querySelector("#alertDialog");
					alertDialog.addEventListener("close", () => {
						navigate("/account");
					});
					showAlert(Result.SUCCESS);
					break;
				case Result.ERR_FORBIDDEN:
					showAlert(Result.ERR_BAD_PASSWORD);
					break;
				case Result.ERR_DB:
					showAlert(Result.ERR_DB);
			}
		});
	}

	const radios = document.getElementsByClassName("totpSetting");
	for (var i = 0; i < radios.length; i++) {
		radios[i].addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			var selected =  <HTMLInputElement>document.querySelector("input[name=totpSetting]:checked");

			switch (TotpType[(<HTMLInputElement>e.target).value]) {
				case TotpType.APP:
					const enableToptResponse = await fetch("/account/enable-totp", {
						method: "POST",
						headers: {
							"content-type": "application/json"
						},
						body: JSON.stringify({})
					});

					const enableToptJson = await enableToptResponse.json();
					if (Result.SUCCESS == enableToptJson.result) {
						const qrCode = document.querySelector("#totpQRCode");
						qrCode.innerHTML = enableToptJson.contents.qrcode;

						const totpSecret = document.querySelector("#totpSecret");
						totpSecret.innerHTML = enableToptJson.contents.secret;

						const totpDialog = <HTMLDialogElement>document.querySelector("#totpDialog");
						totpDialog.showModal();
					}
					break;
				case TotpType.DISABLED:
					//password protect this!
					const disableToptResponse = await fetch("/account/disable-totp", {
						method: "POST",
						headers: {
							"content-type": "application/json"
						},
						body: JSON.stringify({})
					});

					const disableToptJson = await disableToptResponse.json();
					if (Result.SUCCESS == disableToptJson.result) {
						const alertDialog = document.querySelector("#alertDialog");
						alertDialog.addEventListener("close", async () => {
							navigate("/account");
						});
						showAlert(Result.SUCCESS);
					}
					break;
				case TotpType.EMAIL:
					setTimeout(() => {
						selected.checked = true;
					}, 2000);
					break;
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

			const response = await fetch("/account/verify-totp", {
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
					const response = await fetch("/account/logout");
					if (response.ok)
						navigate("/");
				});
				showAlert(Result.SUCCESS);
				return;
			}

			alertDialog.addEventListener("close", () => {
				totpForm.code.value = "";
				totpForm.code.focus();
			});
			showAlert(Result.ERR_BAD_TOTP);
		});
	}

	/*
		Logs out the user and returns to the home page
	*/
	const logoutButton = document.querySelector("#logoutButton");
	if (logoutButton) {
		logoutButton.addEventListener("click", async () => {
			const response = await fetch("/account/logout");
			if (response.ok) {
				closeSocket();
				navigate("/");
			}
		}, { once: true });
	}

	/*
		Invalidates the user's refresh token, forcing a new log in even if someone has the token
	*/
	const invalidateTokenButton = document.querySelector("#invalidateTokenButton");
	if (invalidateTokenButton) {
		invalidateTokenButton.addEventListener("click", async () => {
			const response = await fetch("/account/invalidate-token", {
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
				showAlert(Result.SUCCESS);
			}
		}, { once: true });
	}
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
