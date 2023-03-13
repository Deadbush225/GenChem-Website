"use strict";
// Dark = 1
// Light = 0
exports.__esModule = true;
/* + UTILS */
function l(message) {
    console.log(message);
}
/* + COOKIES */
var saveCookie = function () {
    // alert("cookies saved")
    l("Saving cookies: ");
    l(settings);
    js_cookie_1["default"].set("settings/defaultTheme", fromStrerializeFlag(Number(settings.defaultTheme)));
    js_cookie_1["default"].set("settings/currentTheme", fromStrerializeFlag(Number(settings.currentTheme))); // we interact to the setting as boolean but we save it as integer
};
function initCookie() {
    var settings = {};
    settings = {
        defaultTheme: toSterializeFlag(Number(js_cookie_1["default"].get("settings/defaultTheme"))),
        currentTheme: toSterializeFlag(Number(js_cookie_1["default"].get("settings/currentTheme")))
    };
    l("Page reloaded -> Getting Cookies: ");
    l(settings);
    return settings;
}
/* + COOKIE STERIALIZATION */
function fromStrerializeFlag(number) {
    var i;
    if (number == true) {
        i = 1;
    }
    else if (number == false) {
        i = 0;
    }
    return i;
}
function toSterializeFlag(number) {
    var i;
    i = number == 1 || isNaN(number) ? true : false;
    // if (number == 1) {
    //   l(78)
    //   i = true
    // }
    // if (number == 0) {
    //   l(79)
    //   i = false
    // }
    // if (isNaN(number)) {
    //   l(80)
    //   i = true
    // }
    // l("computed val: ")
    // l(i)
    return i;
}
/* importing */
// import Cookies from "../node_modules/js-cookie/dist/js.cookie.mjs";
// let Cookies = require("js-cookie");
function applyCurrentTheme() {
    l("ApplyCurrentTheme :" + settings.currentTheme);
    // setTimeout(changeThemeTo, 1000, settings.currentTheme);
    chto(!settings.currentTheme);
    changeButtonThemes(settings.currentTheme);
}
function toggleTheme() {
    l("toggleTheme to :" + !settings.currentTheme);
    chto(!settings.currentTheme);
    changeButtonThemes(!settings.currentTheme);
}
function chto(theme) {
    l("first replenish -> changing from " + settings.currentTheme + " to " + theme);
    // l("defaultTheme: " + settings.defaultTheme);
    //check if needs to change the default color
    if (settings.currentTheme == theme) {
        // saveCookie()
        if (settings.currentTheme == settings.defaultTheme) {
            return;
        }
    }
    var element = document.documentElement;
    if (theme) {
        element.classList.toggle("light-mode");
        element.classList.toggle("dark-mode");
        l("DarkMode: Changing to " + theme);
    }
    else {
        element.classList.toggle("dark-mode");
        element.classList.toggle("light-mode");
        l("LightMode: Changing to " + theme);
    }
}
function changeButtonThemes(theme) {
    l("changing from " + settings.currentTheme + " to " + theme);
    // l("defaultTheme: " + settings.defaultTheme);
    //check if needs to change the default color
    if (settings.currentTheme == theme) {
        // saveCookie()
        if (settings.currentTheme == settings.defaultTheme) {
            return;
        }
    }
    var element = document.documentElement;
    var themeButton = document.querySelector(".toggle-theme");
    if (theme) {
        // element.classList.toggle("dark-mode");
        // element.classList.toggle("light-mode");
        l("DarkMode: Changing to " + theme);
        themeButton.classList.toggle("fa-sun");
        themeButton.classList.toggle("fa-moon");
    }
    else {
        // element.classList.toggle("light-mode");
        // element.classList.toggle("dark-mode");
        l("LightMode: Changing to " + theme);
        themeButton.classList.toggle("fa-moon");
        themeButton.classList.toggle("fa-sun");
    }
    settings.currentTheme = theme;
    l(settings);
    saveCookie();
}
require("./styles/styles.scss");
var js_cookie_1 = require("js-cookie");
var jquery_1 = require("jquery");
var data_1 = require("./Periodictable/data");
("./Periodictable/data.js");
// import { readFileSync } from "fs";
// const fs = require("fs");
// import "./assets/Menu.gif";
var settings;
settings = initCookie();
chto(settings.currentTheme);
(0, jquery_1["default"])(document).ready(function () {
    document.querySelector("#darkmode").addEventListener("click", toggleTheme);
    // applyCurrentTheme();
    changeButtonThemes(settings.currentTheme);
    if (document.querySelector(".periodic-table")) {
        var obj_1 = data_1.periodictable.Row;
        var groupBlock_1 = {
            Nonmetal: { color: "#ffffbb" },
            Halogen: { color: "#ffff9a" },
            "Alkali metal": { color: "#ffa6a6" },
            "Alkaline earth metal": { color: "#cfcfff" },
            "Transition metal": { color: "#b3d9ff" },
            "Post-transition metal": { color: "#bbffbb" },
            Metalloid: { color: "#d2ed85" },
            "Noble gas": { color: "#ffca80" },
            Lanthanide: { color: "#afffff" },
            Actinide: { color: "#c2ffeb" }
        };
        document.querySelectorAll(".elements").forEach(function (element, index, parent) {
            var currentElement = (0, jquery_1["default"])(element);
            var atomicNumber = Number(currentElement.attr("id").substring(1) - 1);
            var elementObject = obj_1[atomicNumber];
            currentElement.text(elementObject[1]);
            currentElement.css("background-color", groupBlock_1[elementObject[15]].color);
        });
    }
});
