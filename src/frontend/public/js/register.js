export function setupRegisterForm() {
    const form = document.getElementById("registerForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nick = form.nick.value;
        const email = form.email.value;
        const password = form.password.value;
    });
}
