
// Dark = 1
// Light = 0

// globals
let obj : string[][]

enum theme {LIGHT, DARK}

/* + UTILS */
function l(message) {
	console.log(message);
}

/* + COOKIES */
let saveCookie = () => {
	// alert("cookies saved")
	l("Saving cookies: ");
	l(settings);
	Cookies.set(
		"settings/defaultTheme",
		fromStrerializeFlag(Number(settings.defaultTheme))
	);
	Cookies.set(
		"settings/currentTheme",
		fromStrerializeFlag(Number(settings.currentTheme))
	); // we interact to the setting as boolean but we save it as integer
};

function initCookie() {
	let settings = {};

	settings = {
		defaultTheme: toSterializeFlag(
			Number(Cookies.get("settings/defaultTheme"))
		),
		currentTheme: toSterializeFlag(
			Number(Cookies.get("settings/currentTheme"))
		),
	};

	l("Page reloaded -> Getting Cookies: ");
	l(settings);
	return settings;
}

/* + COOKIE STERIALIZATION */
function fromStrerializeFlag(number) {
	let i;

	if (number == true) {
		i = 1;
	} else if (number == false) {
		i = 0;
	}
	return i;
}

function toSterializeFlag(number) {
	let i;

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
	l(
		"first replenish -> changing from " + settings.currentTheme + " to " + theme
	);
	// l("defaultTheme: " + settings.defaultTheme);

	//check if needs to change the default color
	if (settings.currentTheme == theme) {
		// saveCookie()
		if (settings.currentTheme == settings.defaultTheme) {
			return;
		}
	}

	let element = document.documentElement;

	if (theme) {
		element.classList.toggle("light-mode");
		element.classList.toggle("dark-mode");
		l("DarkMode: Changing to " + theme);
	} else {
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

	let element = document.documentElement;
	let themeButton = document.querySelector(".toggle-theme")!;

	if (theme) {
		// element.classList.toggle("dark-mode");
		// element.classList.toggle("light-mode");
		l("DarkMode: Changing to " + theme);
		themeButton.classList.toggle("fa-sun");
		themeButton.classList.toggle("fa-moon");
	} else {
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

import "./styles/styles.scss";

import Cookies from "js-cookie";
import $ from "jquery";
import { periodictable } from "./Periodictable/data";
("./Periodictable/data.js");
// import { readFileSync } from "fs";
// const fs = require("fs");
// import "./assets/Menu.gif";

let settings;
settings = initCookie();

chto(settings.currentTheme);

function getAtomicNumberFromElement(element : JQuery<Element>) :number {
    return Number(element.attr("id").substring(1))
}

function getIndexFromElement(element : JQuery<Element> ) : number {
    return getAtomicNumberFromElement(element) - 1
    // return 1
}

function elementClicked(e) {
    console.log(e)
    
    let sourceElement = e.srcElement

    if (sourceElement.className == "elements") {
        // console.log(sourceElement)
    } else {
        // console.log("++++++++")
        while (sourceElement.className != "elements") {
            // console.log(sourceElement)
            sourceElement = sourceElement.parentElement
        }
    }
    // console.log(sourceElement)
    // if(e.)

    let atomicNumber = getAtomicNumberFromElement($(sourceElement))
    // console.log(currentElement)

    let symbol = obj[atomicNumber][1]
    let name = obj[atomicNumber][2]
    let atomicMass = obj[atomicNumber][3]
    let electronicConfiguration = obj[atomicNumber][5]
    let electronNegativity = obj[atomicNumber][6]
    let atomicRadius = obj[atomicNumber][7]
    let ionizationEnergy = obj[atomicNumber][8]
    let electornAfinity = obj[atomicNumber][9]
    let oxidationStates = obj[atomicNumber][10]
    let standardState = obj[atomicNumber][11]
    let meltingPoint = obj[atomicNumber][12]
    let boilingPoint = obj[atomicNumber][13]
    let density = obj[atomicNumber][14]
    let groupBlock = obj[atomicNumber][15]
    let yearDiscovered = obj[atomicNumber][16]

    $("#atomic-mass-field").text(atomicMass)
    $("#atomic-number-field").text(atomicNumber)
    $("#year-discovered-field").text(yearDiscovered)
    $("#group-block-field").text(groupBlock)
    $("#oxidation-states-field").text(oxidationStates)
    $("#metling-point-field").text(meltingPoint)
    $("#electronic-configuration-field").text(electronicConfiguration)
    $("#ionization-energy-field").text(ionizationEnergy)
    $("#electron-negativity-field").text(electronNegativity)


}


$(document).ready(() => {
	document.querySelector("#darkmode")!.addEventListener("click", toggleTheme);
	document.querySelectorAll(".elements").forEach((item) => {
        item.addEventListener("click", elementClicked)
    })
    
    // applyCurrentTheme();
	changeButtonThemes(settings.currentTheme);

	if (document.querySelector(".periodic-table")) {

		// let obj: string[][] = periodictable.Row;
		obj = periodictable.Row;

		const groupBlock = {
			Nonmetal: { color: "#ffffbb" },
			Halogen: { color: "#ffff9a" },
			"Alkali metal": { color: "#ffa6a6" },
			"Alkaline earth metal": { color: "#cfcfff" },
			"Transition metal": { color: "#b3d9ff" },
			"Post-transition metal": { color: "#bbffbb" },
			Metalloid: { color: "#d2ed85" },
			"Noble gas": { color: "#ffca80" },
			Lanthanide: { color: "#afffff" },
			Actinide: { color: "#c2ffeb" },
		};

		document.querySelectorAll(".elements").forEach((element, index, parent) => {
			let currentElement = $(element);
			let atomicNumber = getIndexFromElement(currentElement);
            // console.log(currentElement)
			let elementObject = obj[atomicNumber];

			currentElement.css(
                "background-color",
				groupBlock[elementObject[15]].color
                );

            currentElement.append("<div class=\"atomic-number\">" + elementObject[0] + "</div>");
            currentElement.append("<div class=\"atomic-symbol\"><div class=\"symbol\">" + elementObject[1] + "</div></div>");
            currentElement.append("<div class=\"atomic-name\">" + elementObject[2] + "</div>");
            currentElement.append("<div class=\"atomic-weight\">" + elementObject[3] + "</div>");
		});
	}
});