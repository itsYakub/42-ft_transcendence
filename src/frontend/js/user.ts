import { navigate, showAlert } from "./index.js";

export function userFunctions() {
	const googleButton = document.querySelector("#googleButton");
	if (googleButton) {
		googleButton.addEventListener("click", async () => {
			googleLogin();
		});
	}

	const guestButton = document.querySelector("#guestButton");
	if (guestButton) {
		guestButton.addEventListener("click", async () => {
			guestLogin();
		});
	}

	const userForm = <HTMLFormElement>document.getElementById("userForm");
	if (userForm) {
		userForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const email = userForm.email.value;
			const password = userForm.password.value;

			if ("loginButton" == e.submitter.id)
				login(email, password);
			else
				register(email, password);
		});
	}
}

async function login(email: string, password: string) {
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
}

async function register(email: string, password: string) {
	const defaultAvatar = fetch("images/default.jpg");
	const blob = await (await defaultAvatar).blob();
	const reader = new FileReader();
	reader.readAsDataURL(blob);
	reader.onloadend = async () => {
		const avatar = reader.result as string;

		const response = await fetch("/user/register", {
			method: "POST",
			body: JSON.stringify({
				email,
				password,
				avatar
			})
		});

		const payload = await response.json();
		if (payload.error) {
			showAlert(payload.error);
			return;
		}
		const date = new Date();
		date.setFullYear(date.getFullYear() + 1);
		document.cookie = `language=english; expires=${date}`;

		navigate("/");
	};
}

function googleLogin() {	
	// 	const query = {
	// 	client_id: "700864958995-a6qbsqc8t8pqub1cg06kai263h2b2dbj.apps.googleusercontent.com",
	// 	redirect_uri: "https://10.11.7.3.nip.io:3000/auth/google",
	//	redirect_uri: "https://172.17.0.1.nip.io:3000/auth/google",
	//	redirect_uri: "https://localhost:3000/auth/google",
	// 	response_type: "code",
	// 	scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
	// };
	const query = {
		client_id: "700864958995-a6qbsqc8t8pqub1cg06kai263h2b2dbj.apps.googleusercontent.com",
		redirect_uri: "https://172.17.0.1.nip.io:3000/auth/google",
		response_type: "code",
		scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
	};

	const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
	url.search = new URLSearchParams(query).toString();
	window.location.href = url.toString();
}

async function guestLogin() {
	console.log("aaa");
	const response = await fetch("/guest/register", {
		method: "POST"
	});

	const json = await response.json();
	if (json.error) {
		showAlert(json.error);
		return;
	}

	navigate("/");
}

