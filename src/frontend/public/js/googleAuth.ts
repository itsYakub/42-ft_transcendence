const query = {
	client_id: "406443471410-godkm6dcav2851sq2114j4due48hu9iu.apps.googleusercontent.com",
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
