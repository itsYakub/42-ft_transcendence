import { setupLoginForm } from "./login.js";
import { setupRegisterForm } from "./register.js";
import { setupGameFrame } from "./game.js";
let buttonNames = new Map();
buttonNames["/"] = "homeButton";
buttonNames["/game"] = "gameButton";
buttonNames["/tournament"] = "tournamentButton";
buttonNames["/login"] = "loginButton";
export async function navigate(url, user = {}) {
    history.pushState(null, null, url);
    const response = await fetch(url, {
        method: "GET"
    });
    if (response.ok) {
        const text = await response.text();
        console.log(response);
        document.querySelector("#content").innerHTML = text;
        if ("/" == url && 0 != Object.keys(user).length) {
            document.getElementById("profileNick").innerText = user.nick;
            const img = document.getElementById("profileAvatar");
            img.src = `images/${user.avatar}`;
        }
    }
}
function changeButtonColours(url = "") {
    const collection = document.getElementsByClassName("nav-button");
    for (let i = 0; i < collection.length; i++) {
        collection[i].classList.replace("bg-gray-900", "bg-transparent");
    }
    var element = document.getElementById(buttonNames[url]);
    if (element)
        element.classList.replace("bg-transparent", "bg-gray-900");
}
function resetRegisterButton() {
    var element = document.getElementById("registerButton");
    if (element)
        element.classList.replace("bg-gray-900", "bg-yellow-600");
}
function navButtonClicked(url) {
    navigate(url);
    changeButtonColours(url);
    resetRegisterButton();
}
;
document.getElementById("homeButton").addEventListener("click", () => {
    navButtonClicked("/");
});
document.getElementById("gameButton").addEventListener("click", async () => {
<<<<<<< HEAD
    await navigate("/game");
    setupGameFrame();
=======
    navButtonClicked("/game");
>>>>>>> origin/luke
});
document.getElementById("tournamentButton").addEventListener("click", () => {
    navButtonClicked("/tournament");
});
document.getElementById("profileAvatar").addEventListener("click", async () => {
    await navigate("/profile");
    changeButtonColours();
});
document.getElementById("registerButton").addEventListener("click", async function (e) {
    await navigate("/register");
    changeButtonColours();
    this.classList.replace("bg-yellow-600", "bg-gray-900");
    setupRegisterForm();
});
document.getElementById("loginButton").addEventListener("click", async function (e) {
    await navigate("/login");
    changeButtonColours();
    resetRegisterButton();
    this.classList.replace("bg-transparent", "bg-gray-900");
    setupLoginForm();
});
document.getElementById("logoutButton").addEventListener("click", async () => {
    document.dispatchEvent(new Event("logout"));
    var t = new Date();
    t.setSeconds(t.getSeconds() + 10);
    document.cookie = `jwt=blank; expires=${t}`;
});
async function getUser() {
    let jwt;
    document.cookie.split(";").forEach((c) => {
        if (c.substring(0, 4) == "jwt=")
            jwt = c.substring(4);
    });
    const response = await fetch("/user", { method: "GET" });
    const json = await response.json();
    if (0 != Object.keys(json).length) {
        console.log(json);
        document.dispatchEvent(new Event("login"));
        document.getElementById("profileNick").innerText = json.nick;
        const img = document.getElementById("profileAvatar");
        img.src = `images/${json.avatar}`;
    }
    else {
        document.dispatchEvent(new Event("logout"));
    }
}
window.addEventListener('popstate', function (event) {
    navButtonClicked(window.location.pathname);
});
document.addEventListener("login", (e) => {
    const loginSection = document.getElementById("login");
    loginSection.classList.replace("visible", "collapse");
    const logoutSection = document.getElementById("logout");
    logoutSection.classList.replace("collapse", "visible");
});
document.addEventListener("logout", (e) => {
    const loginSection = document.getElementById("login");
    loginSection.classList.replace("collapse", "visible");
    const logoutSection = document.getElementById("logout");
    logoutSection.classList.replace("visible", "collapse");
    document.getElementById("profileNick").innerText = "Guest";
    const img = document.getElementById("profileAvatar");
    img.src = "images/avatar.jpg";
    navigate("/");
});
