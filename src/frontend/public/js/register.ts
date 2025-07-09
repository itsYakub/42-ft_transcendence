export function setupRegisterForm() {
	const form = <HTMLFormElement>document.getElementById("registerForm");
	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		const nick = form.nick.value;
		const email = form.email.value;
		const password = form.password.value;

		const response = await fetch("/register", {
			method: "POST",
			body: JSON.stringify({
				nick, email, password
			})
		});

		// const response = await fetch("/register", {
		// 	method: "POST",
		// 	body: JSON.stringify({
		// 		nick, email, password
		// 	})
		// });
		// check response for error messages and update ui!
	});
}
