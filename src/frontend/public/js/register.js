function validEmail(email) {
    return true;
}
function checkNick(nick) {
    return nick.length > 0 ? "" : "Please provide a nickname";
}
function checkEmail(email) {
    return validEmail(email) ? "" : "Invalid email";
}
function checkPassword(password) {
    return password.length > 7 ? "" : "Password needs to be 8+ characters";
}
export function setupRegisterForm() {
    document.getElementById("signupButton").addEventListener("click", async () => {
        const nick = document.getElementById("nickBox").value;
        const email = document.getElementById("emailBox").value;
        const password = document.getElementById("passwordBox").value;
        const nickError = checkNick(nick);
        const emailError = checkEmail(nick);
        const passwordError = checkPassword(nick);
        document.getElementById("nickError").textContent = nickError;
        document.getElementById("emailError").textContent = emailError;
        document.getElementById("passwordError").textContent = passwordError;
        if (0 == nickError.length + emailError.length + passwordError.length) {
            const response = await fetch("/register", {
                method: "POST",
                body: JSON.stringify({
                    nick, email, password
                })
            });
        }
    });
}
