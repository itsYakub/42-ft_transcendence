const query = {
	client_id: "700864958995-a6qbsqc8t8pqub1cg06kai263h2b2dbj.apps.googleusercontent.com",
	redirect_uri: "http://localhost:3000/auth/google",
	response_type: "code",
	scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
};

export function googleFunctions() {
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
