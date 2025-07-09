import { setupRegisterForm } from "./register.js";
import { setupGameFrame } from "./game.js";
let buttonNames = new Map();
buttonNames["/"] = "homeButton";
buttonNames["/game"] = "gameButton";
buttonNames["/tournament"] = "tournamentButton";
buttonNames["/login"] = "loginButton";
async function navigate(url) {
    history.pushState(null, null, url);
    const response = await fetch(url, {
        method: "GET"
    });
    if (response.ok) {
        const text = await response.text();
        document.querySelector("#content").innerHTML = text;
    }
}
function changeButtonColours(url) {
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
document.getElementById("gameButton").addEventListener("click", async () => {
    await navigate("/game");
    setupGameFrame();
});
document.getElementById("tournamentButton").addEventListener("click", () => {
    navButtonClicked("/tournament");
});
function profileClicked() {
}
document.getElementById("registerButton").addEventListener("click", async () => {
    await navigate("/register");
    changeButtonColours("");
    var element = document.getElementById("registerButton");
    if (element)
        element.classList.replace("bg-yellow-600", "bg-gray-900");
    setupRegisterForm();
});
window.addEventListener('popstate', function (event) {
    navButtonClicked(window.location.pathname);
});
