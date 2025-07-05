var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let buttonNames = new Map();
buttonNames["/"] = "homeButton";
buttonNames["/game"] = "gameButton";
buttonNames["/tournament"] = "tournamentButton";
buttonNames["/register"] = "registernpm startButton";
function navButtonClicked(url) {
    return __awaiter(this, void 0, void 0, function* () {
        history.pushState(null, null, url);
        const response = yield fetch(url, {
            method: "GET"
        });
        if (response.ok) {
            const text = yield response.text();
            document.querySelector("#content").innerHTML = text;
        }
        const collection = document.getElementsByClassName("nav-button");
        for (let i = 0; i < collection.length; i++) {
            collection[i].classList.replace("text-green-700", "text-gray-500");
        }
        var element = document.getElementById(buttonNames[url]);
        if (element)
            element.classList.replace("text-gray-500", "text-green-700");
    });
}
;
function profileClicked() {
    navButtonClicked("register");
}
window.addEventListener('popstate', function (event) {
    navButtonClicked(window.location.pathname);
});
window.profileClicked = profileClicked;
window.navButtonClicked = navButtonClicked;
