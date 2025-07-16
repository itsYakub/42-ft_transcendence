import { setupProfileView } from "./profile.js";

export async function navigate(url: string): Promise<void> {
	history.pushState(null, null, url);

	// Fetches the data from the backend
	const response = await fetch(url, {
		method: "GET"
	});

	// Sets the frame's navbar and content
	if (response.ok) {
		const text = await response.json();
		document.querySelector("#navbar").innerHTML = text.navbar;
		document.querySelector("#content").innerHTML = text.content;
		registerListeners();
	}
}

// Changes view on back/forward buttons
window.addEventListener('popstate', function (event) {
	navigate(window.location.pathname);
});

// Sets up all the listeners after a "page" refresh
function registerListeners() {
	document.getElementById("homeButton").addEventListener("click", () => {
		navigate("/");
	}, { once: true });

	document.getElementById("playButton").addEventListener("click", async () => {
		navigate("/play");
	}, { once: true });

	document.getElementById("tournamentButton").addEventListener("click", () => {
		navigate("/tournament");
	}, { once: true });

	let deleteButton = document.getElementById("deleteButton")
	if (deleteButton) {
		deleteButton.addEventListener("click", async () => {
			//drop and recreate tables, log out, delete cookie
			const response = await fetch("/delete", {
				method: "GET"
			});

			// Sets the frame's navbar and content
			if (response.ok) {
				const text = await response.json();
				document.querySelector("#navbar").innerHTML = text.navbar;
				document.querySelector("#content").innerHTML = text.content;
				registerListeners();
			}
		}, { once: true });
	}

	let profileAvatar = document.getElementById("profileAvatar");
	if (profileAvatar) {
		profileAvatar.addEventListener("click", async () => {
			await navigate("/profile");
			setupProfileView();
		}, { once: true });
	}

	const registerButton = document.getElementById("registerButton");
	if (registerButton) {
		registerButton.addEventListener("click", async function (e) {
			let dialog = <HTMLDialogElement>document.getElementById("registerDialog");
			dialog.showModal();
		});
	}

	const registerForm = <HTMLFormElement>document.getElementById("registerForm");
	if (registerForm) {
		registerForm.addEventListener("submit", async (e) => {
			if ("cancelRegisterButton" == e.submitter.id) {
				//form.removeEventListener("submit");
				return;
			}
			e.preventDefault();
			const nick = registerForm.nick.value;
			const email = registerForm.email.value;
			const password = registerForm.password.value;

			const response = await fetch("/register", {
				method: "POST",
				body: JSON.stringify({
					nick, email, password
				})
			});

			const payload = await response.json();
			if (payload.error) {
				alert(payload.message);
				return;
			}
			let dialog = <HTMLDialogElement>document.getElementById("registerDialog");
			dialog.close();
			navigate("/");
		});
	}

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

			const response = await fetch("/login", {
				method: "POST",
				body: JSON.stringify({
					email, password
				})
			});

			const payload = await response.json();
			if (payload.error) {
				alert(payload.message);
				return;
			}
			let dialog = <HTMLDialogElement>document.getElementById("loginDialog");
			dialog.close();
			navigate("/");
		});
	}

	const logoutButton = document.getElementById("logoutButton");
	if (logoutButton) {
		logoutButton.addEventListener("click", async () => {
			const response = await fetch("/logout", {
				method: "GET"
			});

			// Sets the frame's navbar and content
			if (response.ok) {
				const text = await response.json();
				document.querySelector("#navbar").innerHTML = text.navbar;
				document.querySelector("#content").innerHTML = text.content;
				registerListeners();
			}
		}, { once: true });
	}

	const googleSignupButton = document.getElementById("googleSignupButton");
	if (googleSignupButton) {
		googleSignupButton.addEventListener("click", () => {
			const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
			url.search = new URLSearchParams(query).toString();
			window.location.href = url.toString();
		});
	}

	const googleSigninButton = document.getElementById("googleSigninButton");
	if (googleSigninButton) {
		googleSigninButton.addEventListener("click", () => {
			const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
			url.search = new URLSearchParams(query).toString();
			window.location.href = url.toString();
		});
	}
}

window.addEventListener("DOMContentLoaded", () => {
	registerListeners();
});

window.addEventListener("beforeunload", (event) => {
	// update db
	console.log("bye");
});

const query = {
	client_id: "406443471410-godkm6dcav2851sq2114j4due48hu9iu.apps.googleusercontent.com",
	redirect_uri: "http://localhost:3000/auth/google",
	response_type: "code",
	scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
};
