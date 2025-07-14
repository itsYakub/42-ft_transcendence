import { setupProfileView } from "./profile.js";
export async function navigate(url) {
    history.pushState(null, null, url);
    const response = await fetch(url, {
        method: "GET"
    });
    if (response.ok) {
        const text = await response.json();
        document.querySelector("#navbar").innerHTML = text.navbar;
        document.querySelector("#content").innerHTML = text.content;
        registerListeners();
    }
}
window.addEventListener('popstate', function (event) {
    navigate(window.location.pathname);
});
function registerListeners() {
    document.getElementById("homeButton").addEventListener("click", () => {
        navigate("/");
    }, { once: true });
    document.getElementById("gameButton").addEventListener("click", async () => {
        navigate("/game");
    }, { once: true });
    document.getElementById("tournamentButton").addEventListener("click", () => {
        navigate("/tournament");
    }, { once: true });
    let deleteButton = document.getElementById("deleteButton");
    if (deleteButton) {
        deleteButton.addEventListener("click", () => {
            fetch("/delete");
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
            let dialog = document.getElementById("registerDialog");
            dialog.showModal();
        });
    }
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            if ("cancelRegisterButton" == e.submitter.id) {
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
            let dialog = document.getElementById("registerDialog");
            dialog.close();
            navigate("/");
        });
    }
    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
        loginButton.addEventListener("click", async function (e) {
            let dialog = document.getElementById("loginDialog");
            dialog.showModal();
        });
    }
    const loginForm = document.getElementById("loginForm");
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
            let dialog = document.getElementById("loginDialog");
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
            if (response.ok) {
                const text = await response.json();
                document.querySelector("#navbar").innerHTML = text.navbar;
                document.querySelector("#content").innerHTML = text.content;
                registerListeners();
            }
        }, { once: true });
    }
}
window.addEventListener("DOMContentLoaded", () => {
    registerListeners();
});
window.addEventListener("beforeunload", (event) => {
    console.log("bye");
});
