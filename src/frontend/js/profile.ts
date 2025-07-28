import { addFunctions, navigate } from "./index.js";
import { translateFrontend } from "./translations.js";

/*
	The buttons and events create by the /profile page
*/
export function profileFunctions() {

	/*
		Shows the dialog to choose a file
	*/
	const avatarUploadButton = <HTMLInputElement>document.getElementById("avatarFilename");
	const avatarImage = document.getElementById("avatarImage");
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
				if (files[0].size > 500 * 1024) {
					alert(translateFrontend("ERR_AVATAR_TOO_BIG"));
					return;
				}

				const reader = new FileReader();
				reader.readAsDataURL(files[0]);
				reader.onloadend = async () => {
					const avatar = reader.result as string;
					const response = await fetch("/profile/avatar", {
						method: "POST",
						body: JSON.stringify({
							avatar
						})
					});

					const message = await response.json();
					if (!message.error)
						navigate("/profile");
					else
						alert(message.error);
				}
			}
		});
	}

	/*
		Updates the user's nickname - must be unique!
	*/
	const changeNickForm = <HTMLFormElement>document.getElementById("changeNickForm");
	if (changeNickForm) {
		changeNickForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const nick = changeNickForm.newNick.value;
			const response = await fetch("/profile/nick", {
				method: "POST",
				body: JSON.stringify({
					nick
				})
			});

			const message = await response.json();
			if (!message.error)
				navigate("/profile");
			else
				alert(message.error);
		});
	}

	/*
		Updating a user's password
	*/
	const changePasswordForm = <HTMLFormElement>document.getElementById("changePasswordForm");
	if (changePasswordForm) {
		changePasswordForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const currentPassword = changePasswordForm.currentPassword.value;
			const newPassword = changePasswordForm.newPassword.value;
			const repeatPassword = changePasswordForm.repeatPassword.value;
			if (newPassword != repeatPassword) {
				alert(translateFrontend("ERR_PASSWORDS_DONT_MATCH"));
				return;
			}

			if (newPassword == currentPassword) {
				alert(translateFrontend("ERR_NO_NEW_PASSWORD"));
				return;
			}

			const response = await fetch("/profile/password", {
				method: "POST",
				body: JSON.stringify({
					currentPassword,
					newPassword
				})
			});

			const message = await response.json();
			if (!message.error) {
				alert(translateFrontend("SUCCESS_PASSWORD_CHANGED"));
				navigate("/profile");
			}
			else
				alert(translateFrontend(message.error));
		});
	}

	/*
		Shows the dialog to scan the TOTP QR code
	*/
	const enableTOTPButton = document.getElementById("enableTOTPButton");
	if (enableTOTPButton) {
		enableTOTPButton.addEventListener("click", async () => {
			const response = await fetch("/profile/totp/enable", {
				method: "POST"
			});

			if (response.ok) {
				const json = await response.json();

				const qrCode = document.getElementById("totpQRCode");
				qrCode.innerHTML = json.qrcode;

				const totpSecret = document.getElementById("totpSecret");
				totpSecret.innerHTML = json.secret;

				const totpDialog = <HTMLDialogElement>document.getElementById("totpDialog");
				totpDialog.showModal();
			}
		});
	}

	/*
		Turns off TOTP
	*/
	const disableTOTPButton = document.getElementById("disableTOTPButton");
	if (disableTOTPButton) {
		disableTOTPButton.addEventListener("click", async () => {
			// password protect this!
			const response = await fetch("/profile/totp/disable", {
				method: "POST"
			});
			navigate("/profile");
		});
	}

	/*
		Checks the entered TOTP code
	*/
	const totpForm = <HTMLFormElement>document.getElementById("totpForm");
	if (totpForm) {
		totpForm.addEventListener("submit", async (e) => {
			if ("cancelTOTPButton" == e.submitter.id)
				return;

			e.preventDefault();
			const code = totpForm.code.value;

			const response = await fetch("/profile/totp/verify", {
				method: "POST",
				body: JSON.stringify({
					code
				})
			});

			if (response.ok) {
				alert(translateFrontend("SUCCESS_ENABLED_TOTP"));
				navigate("/profile");
				return;
			}
			
			totpForm.code.value = "";
			totpForm.code.focus();
			alert(translateFrontend("ERR_VERIFY_TOTP"));
		});
	}
	
	/*
		Logs out the user and returns to the home page
	*/
	const logoutButton = document.getElementById("logoutButton");
	if (logoutButton) {
		logoutButton.addEventListener("click", async () => {
			const response = await fetch("/user/logout", {
				method: "GET"
			});

			// Sets the frame's navbar and content
			if (response.ok) {
				const text = await response.json();
				document.querySelector("#navbar").innerHTML = text.navbar;
				document.querySelector("#content").innerHTML = text.content;
				addFunctions();
			}
		}, { once: true });
	}

	/*
		Invalidates the user's refresh token, forcing a new log in even if someone has the token
	*/
	const invalidateTokenButton = document.getElementById("invalidateTokenButton");
	if (invalidateTokenButton) {
		invalidateTokenButton.addEventListener("click", async () => {
			const response = await fetch("/user/invalidate-token", {
				method: "POST",
			});
			if (response.ok)
				navigate("/");
		}, { once: true });
	}
}
