import { googleFunctions } from "./googleAuth.js";
import { loginFunctions } from "./login.js";
import { logoutFunctions } from "./logout.js";
import { pageButtons } from "./pages.js";
import { profileFunctions } from "./profile.js";
import { registerFunctions } from "./register.js";
import { wipeDB } from "./wipeDB.js";
export async function navigate(url) {
    history.pushState(null, null, url);
    const response = await fetch(url, {
        method: "GET"
    });
    if (response.ok) {
        const text = await response.json();
        document.querySelector("#navbar").innerHTML = text.navbar;
        document.querySelector("#content").innerHTML = text.content;
        addFunctions();
    }
}
window.addEventListener('popstate', function (event) {
    navigate(window.location.pathname);
});
export function addFunctions() {
    pageButtons();
    profileFunctions();
    loginFunctions();
    logoutFunctions();
    registerFunctions();
    googleFunctions();
    wipeDB();
}
window.addEventListener("DOMContentLoaded", () => {
    addFunctions();
    if (-1 != document.cookie.indexOf("googleautherror=true")) {
        const date = new Date();
        date.setDate(date.getDate() - 3);
        alert("Couldn't sign in/up with Google!");
        document.cookie = `googleautherror=false; Domain=localhost; expires=${date}; Path=/;`;
    }
});
