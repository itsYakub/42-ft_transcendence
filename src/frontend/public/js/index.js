import { setupRegisterForm } from "./register.js";
let buttonNames = new Map();
buttonNames["/"] = "homeButton";
buttonNames["/game"] = "gameButton";
buttonNames["/tournament"] = "tournamentButton";
buttonNames["/login"] = "loginButton";
export async function navigate(url) {
    history.pushState(null, null, url);
    const response = await fetch(url, {
        method: "GET"
    });
    if (response.ok) {
        const text = await response.text();
        document.querySelector("#content").innerHTML = text;
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
function navButtonClicked(url) {
    navigate(url);
    changeButtonColours(url);
    var element = document.getElementById("registerButton");
    if (element)
        element.classList.replace("bg-gray-900", "bg-yellow-600");
}
;
document.getElementById("homeButton").addEventListener("click", () => {
    navButtonClicked("/");
});
document.getElementById("gameButton").addEventListener("click", () => {
    getUser();
});
document.getElementById("tournamentButton").addEventListener("click", () => {
    navButtonClicked("/tournament");
});
document.getElementById("registerButton").addEventListener("click", async () => {
    await navigate("/register");
    changeButtonColours();
    var element = document.getElementById("registerButton");
    if (element)
        element.classList.replace("bg-yellow-600", "bg-gray-900");
    setupRegisterForm();
});
document.getElementById("logoutButton").addEventListener("click", async () => {
    document.dispatchEvent(new Event("logout"));
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
        const img = document.getElementById("profilePic");
        img.src = `images/${json.profilePic}`;
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
    document.getElementById("profileNick").innerText = "";
    const img = document.getElementById("profilePic");
    img.src = "images/profilePic.jpg";
});
