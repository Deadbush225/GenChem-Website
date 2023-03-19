// Dark = 1
// Light = 0

// globals
let obj: string[][];

enum theme {
	LIGHT,
	DARK,
}

/* + UTILS */
export function l(message) {
	console.log(message);
}

/* importing */
// import Cookies from "../node_modules/js-cookie/dist/js.cookie.mjs";
// let Cookies = require("js-cookie");

import "./styles/styles.scss";

// import { initCookie } from "./cookies"
// import Cookies from "js-cookie";
import $ from "jquery";

import { periodictable } from "./Periodictable/data";
import {
	toggleTheme,
	chto,
	changeButtonThemes,
} from "./scripts/themesController";
import { settings } from "./scripts/cookies";
import { ElementModel } from "./scripts/modelGenerator";

// ("./Periodictable/data.js");
// import { readFileSync } from "fs";
// const fs = require("fs");
// import "./assets/Menu.gif";

function getAtomicNumberFromElement(element: JQuery<Element>): number {
	return Number(element.attr("id")!.substring(1));
}

function getIndexFromElement(element: JQuery<Element>): number {
	return getAtomicNumberFromElement(element) - 1;
	// return 1
}

function elementClicked(e) {
	console.log(e);

	// l(e.constructor);

	let atomIndex;
	let atomicNumber;
	if (typeof e == "number") {
		l("number");
		atomIndex = e - 1;
		atomicNumber = e;
	} else {
		l("passing here");
		let sourceElement = e.target!;

		// if (sourceElement instanceof HTMLElement) {
		if (sourceElement.className == "elements") {
			// console.log(sourceElement)
		} else {
			// console.log("++++++++")
			while (sourceElement.className != "elements") {
				// console.log(sourceElement)
				sourceElement = sourceElement.parentElement;
			}
		}
		// console.log(sourceElement)
		// if(e.)

		atomIndex = getIndexFromElement($(sourceElement));
		// console.log(currentElement)
		atomicNumber = getAtomicNumberFromElement($(sourceElement));
	}

	let symbol = obj[atomIndex][1];
	let name = obj[atomIndex][2];
	let atomicMass = obj[atomIndex][3];
	let electronicConfiguration = obj[atomIndex][5];
	let electronNegativity = obj[atomIndex][6];
	let atomicRadius = obj[atomIndex][7];
	let ionizationEnergy = obj[atomIndex][8];
	let electornAfinity = obj[atomIndex][9];
	let oxidationStates = obj[atomIndex][10];
	let standardState = obj[atomIndex][11];
	let meltingPoint = obj[atomIndex][12];
	let boilingPoint = obj[atomIndex][13];
	let density = obj[atomIndex][14];
	let groupBlock = obj[atomIndex][15];
	let yearDiscovered = obj[atomIndex][16];

	$("#atomic-mass-field").text(atomicMass);
	$("#atomic-number-field").text(atomicNumber);
	$("#year-discovered-field").text(yearDiscovered);
	$("#group-block-field").text(groupBlock);
	$("#oxidation-states-field").text(oxidationStates);
	$("#metling-point-field").text(meltingPoint);
	$("#electronic-configuration-field").text(electronicConfiguration);
	$("#ionization-energy-field").text(ionizationEnergy);
	$("#electron-negativity-field").text(electronNegativity);

	model.changeElement(atomicNumber);
	// model = new ElementModel(atomicNumber);
}

// applyCurrentTheme();
chto(settings.currentTheme);
export let model;
export let bodyStyles;

$(document).ready(() => {
	changeButtonThemes(settings.currentTheme);
	bodyStyles = window.getComputedStyle(document.body);

	document.querySelector("#darkmode")!.addEventListener("click", toggleTheme);

	let elements: NodeListOf<HTMLDivElement> =
		document.querySelectorAll(".elements");

	if (elements) {
		elements.forEach((item) => {
			item.addEventListener("click", elementClicked);
		});
	}

	/// START of MODEL
	model = new ElementModel(1);

	/// END of MODEL

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

			currentElement.append(
				'<div class="atomic-number">' + elementObject[0] + "</div>"
			);
			currentElement.append(
				'<div class="atomic-symbol"><div class="symbol">' +
					elementObject[1] +
					"</div></div>"
			);
			currentElement.append(
				'<div class="atomic-name">' + elementObject[2] + "</div>"
			);
			currentElement.append(
				'<div class="atomic-weight">' + elementObject[3] + "</div>"
			);
		});
	}
	elementClicked(1);
});
