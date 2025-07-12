import { setupProfileView } from "./profile.js";
export async function navigate(url, user = {}) {
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
    });
    document.getElementById("gameButton").addEventListener("click", async () => {
        navigate("/game");
    });
    document.getElementById("tournamentButton").addEventListener("click", () => {
        navigate("/tournament");
    });
    document.getElementById("deleteButton").addEventListener("click", () => {
        fetch("/delete");
    });
    document.getElementById("profileAvatar").addEventListener("click", async () => {
        await navigate("/profile");
        setupProfileView();
    });
    const registerButton = document.getElementById("registerButton");
    if (registerButton) {
        registerButton.addEventListener("click", async function (e) {
            let dialog = document.getElementById("registerDialog");
            dialog.showModal();
            const form = document.getElementById("registerForm");
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                if ("jsbutton" == e.submitter.id)
                    return;
                const nick = form.nick.value;
                const email = form.email.value;
                const password = form.password.value;
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
                dialog.close();
                document.dispatchEvent(new Event("login"));
                navigate("/", { "nick": payload.nick, "avatar": payload.avatar });
            });
        });
    }
    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
        loginButton.addEventListener("click", async function (e) {
            let dialog = document.getElementById("loginDialog");
            dialog.showModal();
            const form = document.getElementById("loginForm");
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                if ("jsbutton" == e.submitter.id)
                    return;
                const nick = form.nick.value;
                const email = form.email.value;
                const password = form.password.value;
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
                dialog.close();
                document.dispatchEvent(new Event("login"));
                navigate("/", { "nick": payload.nick, "avatar": payload.avatar });
            });
        });
    }
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            const response = await fetch("/logout", {
                method: "GET"
            });
        });
    }
}
window.addEventListener("DOMContentLoaded", () => {
    registerListeners();
});
