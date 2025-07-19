// minutes played, win/loss ratio, friends, change password/nick
import { navigate } from "./index.js";

export function registerProfileListeners() {
	const profileButton = document.getElementById("profileButton");
	if (profileButton) {
		profileButton.addEventListener("click", () => {
			navigate("/profile");
		}, { once: true });
	}

	const matchesButton = document.getElementById("matchesButton");
	if (matchesButton) {
		matchesButton.addEventListener("click", () => {
			navigate("/matches");
		}, { once: true });
	}

	const friendsButton = document.getElementById("friendsButton");
	if (friendsButton) {
		friendsButton.addEventListener("click", () => {
			navigate("/friends");
		}, { once: true });
	}

	const changeNickForm = <HTMLFormElement>document.getElementById("changeNickForm");
	if (changeNickForm) {
		changeNickForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const idInput = <HTMLInputElement>document.getElementById("userId");
			const id = idInput.value;
			const nick = changeNickForm.newNick.value;
			const response = await fetch("/nick", {
				method: "POST",
				body: JSON.stringify({
					id,
					nick
				})
			});

			navigate("/profile");
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

				const idInput = <HTMLInputElement>document.getElementById("userId");
				const id = idInput.value;
				const reader = new FileReader();
				reader.readAsDataURL(files[0]);
				reader.onloadend = async () => {
					const avatar = reader.result as string;
					const response = await fetch("/avatar", {
						method: "POST",
						body: JSON.stringify({
							id,
							avatar
						})
					});

					navigate("/profile");
				}
			}
		});
	}
}
