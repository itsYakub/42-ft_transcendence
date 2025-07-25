import { navigate } from "./index.js";

export function profileFunctions() {

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
	
	const changePasswordForm = <HTMLFormElement>document.getElementById("changePasswordForm");
	if (changePasswordForm) {
		changePasswordForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const currentPassword = changePasswordForm.currentPassword.value;
			const newPassword = changePasswordForm.newPassword.value;
			const repeatPassword = changePasswordForm.repeatPassword.value;
			if (newPassword != repeatPassword) {
				alert("Please repeat the password!");
				return;
			}

			if (newPassword == currentPassword) {
				alert("New password can't be the same as old password!");
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
				alert("Password changed!");
				navigate("/profile");
			}
			else
				alert(message.error);
		});
	}

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

	const avatarUploadButton = <HTMLInputElement>document.getElementById("avatarFilename");
	const avatarImage = document.getElementById("avatarImage");
	if (avatarImage) {
		avatarImage.addEventListener("click", () => {
			avatarUploadButton.click();
		})
	}

	if (avatarUploadButton) {
		avatarUploadButton.addEventListener("change", () => {
			const files = avatarUploadButton.files;
			if (1 == files.length) {
				if (files[0].size > 500 * 1024) {
					alert("The selected avatar is too big - 500KiB max!");
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
		The switch to toggle whether 2FA is enabled
	*/
	const toggle2faButton = <HTMLInputElement>document.getElementById("toggle2faButton");
	if (toggle2faButton) {
		toggle2faButton.addEventListener("change", async () => {
			toggle2faEmailButton.disabled = !toggle2faButton.checked;
			if (toggle2faButton.checked) {
				const response = await fetch("/profile/totp/enable", {
					method: "POST"
				})

				if (response.ok) {
					const json = await response.json();

				const qrCode = document.getElementById("totpQRCode");
				qrCode.innerHTML = json.qrcode;

				const totpSecret = document.getElementById("totpSecret");
				totpSecret.innerHTML = json.secret;

				const totpDialog = <HTMLDialogElement>document.getElementById("totpDialog");
				totpDialog.showModal();
				}
			}
			else {
				const response = await fetch("/profile/totp/disable", {
					method: "POST"
				})
			}
		})
	}

	/*
		The switch to toggle whether 2FA emails are sent on login
	*/
	const toggle2faEmailButton = <HTMLInputElement>document.getElementById("toggle2faEmailButton");
	if (toggle2faEmailButton) {
		toggle2faEmailButton.addEventListener("change", () => {
			console.log(toggle2faEmailButton.checked);
		})
	}

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
			console.log(await response.text());

			// const payload = await response.json();
			// if (payload.error) {
			// 	alert(payload.error);
			// 	return;
			// }
			// navigate("/");
		});
	}
}
