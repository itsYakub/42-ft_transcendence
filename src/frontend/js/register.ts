import { navigate } from "./index.js";

export function registerFunctions() {
	const registerButton = document.getElementById("registerButton");
	if (registerButton) {
		registerButton.addEventListener("click", async function (e) {
			const dialog = <HTMLDialogElement>document.getElementById("registerDialog");
			dialog.showModal();
		});
	}

	const registerForm = <HTMLFormElement>document.getElementById("registerForm");
	if (registerForm) {
		registerForm.addEventListener("submit", async (e) => {
			if ("cancelRegisterButton" == e.submitter.id)
				return;
			
			e.preventDefault();
			const nick = registerForm.nick.value;
			const email = registerForm.email.value;
			const password = registerForm.password.value;

			const defaultAvatar = fetch("images/default.jpg");
			const blob = await (await defaultAvatar).blob();
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = async () => {
				const avatar = reader.result as string;

				const response = await fetch("/user/register", {
					method: "POST",
					body: JSON.stringify({
						nick, email, password, avatar
					})
				});

				const payload = await response.json();
				if (payload.error) {
					alert(payload.error);
					return;
				}
				const date = new Date();
				date.setFullYear(date.getFullYear() + 1);
				document.cookie = `language=english; expires=${date}`;

				navigate("/");
			};
		});
	}
}
