// Dark = 1
// Light = 0

/* ================================= GLOBALS ================================ */
let obj: string[][];

enum theme {
	LIGHT,
	DARK,
}

export let model: ElementModel;
export let bodyStyles: CSSStyleDeclaration;

// let colors = [
// 	"#ff7d7d",
// 	"#ffaaaa",
// 	"#ff9c2b",
// 	"#ffd42b",
// 	"#ebf650",
// 	"#a5ff52",
// 	"#51ff00",
// 	"#0cff00",
// 	"#45f1fd",
// 	"#45daff",
// 	"#93c9ff",
// 	"#adc9ff",
// 	"#a9afff",
// 	"#d8a9ff",
// 	"#eea9ff",
// ];

/* + UTILS */
export function l(message: any) {
	console.log(message);
}

/* importing */
// import Cookies from "../node_modules/js-cookie/dist/js.cookie.mjs";
// let Cookies = require("js-cookie");

/* =============================== MOUSE HOVER ============================== */
function mouseOver(e: Event) {
	// l("mouse over");
	if (e instanceof MouseEvent) {
		let target = e.target as HTMLElement;

		if (target) {
			l(target.id);
			if (target.id == "Electron") {
				model.hover = 1;
				// l("refreshing");
			} else if (target.id == "Proton") {
				model.hover = 2;
			} else if (target.id == "Neutron") {
				model.hover = 3;
			}
		}
	}
}

function mouseOut(e: Event) {
	// l("mouse out");
	if (e instanceof MouseEvent) {
		model.hover = 0;
	}
}


import "./styles/styles.scss";
import "../node_modules/flickity/css/flickity.css";
// import "../node_modules/flickity/js/index.js";
import "flickity";

// import { initCookie } from "./cookies"
// import Cookies from "js-cookie";
import $ from "jquery";

import periodictable from "./Periodictable/data";
import {
	toggleTheme,
	chto,
	changeButtonThemes,
} from "./scripts/themesController";
import { settings } from "./scripts/cookies";
import { ElementModel } from "./scripts/modelGenerator";


function getAtomicNumberFromElement(element: JQuery<Element>): number {
	return Number(element.attr("id")!.substring(1));
}

function getIndexFromElement(element: JQuery<Element>): number {
	return getAtomicNumberFromElement(element) - 1;
}

function elementClicked(e: MouseEvent | number) {
	let atomIndex: number | undefined = undefined;
	let atomicNumber: number | undefined = undefined;

	if (typeof e == "number") {
		l("number");
		atomIndex = e - 1;
		atomicNumber = e;
	} else {
		l("passing here");
		let sourceElement = e.target as HTMLElement;

		if (sourceElement) {
			if (sourceElement.className != "elements") {
				while (sourceElement.className != "elements") {
					let temp = sourceElement.parentElement;
					if (temp) {
						sourceElement = temp;
					}
				}
			}

			atomIndex = getIndexFromElement($(sourceElement));
			atomicNumber = getAtomicNumberFromElement($(sourceElement));
		}
	}

	if (atomIndex && atomicNumber) {
		let symbol = obj[atomIndex][1];
		let name = obj[atomIndex][2];
		let atomicMass = obj[atomIndex][3];
		let electronicConfiguration = obj[atomIndex][5];
		let electronNegativity = obj[atomIndex][6];
		let atomicRadius = obj[atomIndex][7];
		let ionizationEnergy = obj[atomIndex][8];
		let electronAfinity = obj[atomIndex][9];
		let oxidationStates = obj[atomIndex][10];
		let standardState = obj[atomIndex][11];
		let meltingPoint = obj[atomIndex][12];
		let boilingPoint = obj[atomIndex][13];
		let density = obj[atomIndex][14];
		let groupBlock = obj[atomIndex][15];
		let yearDiscovered = obj[atomIndex][16];

		$("#atomic-mass-field").text(atomicMass);
		// $("#atomic-number-field").text(atomicNumber);
		$("#year-discovered-field").text(yearDiscovered);
		$("#group-block-field").text(groupBlock);
		$("#oxidation-states-field").text(oxidationStates);
		$("#metling-point-field").text(meltingPoint);
		$("#electronic-configuration-field").text(electronicConfiguration);
		$("#ionization-energy-field").text(ionizationEnergy);
		$("#electron-negativity-field").text(electronNegativity);
		$("#atomic-radius-field").text(atomicRadius);
		$("#electron-afinity-field").text(electronAfinity);
		$("#standard-state-field").text(standardState);
		$("#boiling-point-field").text(boilingPoint);
		$("#density-field").text(density);

		$("#electron-field").text(atomicNumber);
		$("#proton-field").text(atomicNumber);
		$("#neutron-field").text(atomicNumber);

		$("#wiki").attr(
			"href",
			`https://pubchem.ncbi.nlm.nih.gov/element/${atomicNumber}`
		);

		$("#atomic-model-symbol").text(symbol);
		$("#atomic-model-name").text(name);
		$("#atomic-model-number").text(atomicNumber);

		model.changeElement(atomicNumber);
		// model = new ElementModel(atomicNumber);
	}
}

// applyCurrentTheme();
chto(settings.currentTheme);

$(() => {
	changeButtonThemes(settings.currentTheme);
	bodyStyles = window.getComputedStyle(document.body);

	document.querySelector("#darkmode")!.addEventListener("click", toggleTheme);
	$(".toTheTop").hide();

	$(".toTheTop").on("click", (e) => {
		// document.body.scrollTop = document.documentElement.scrollTop = 0;
		window.scroll({ top: 0, left: 0, behavior: "smooth" });
	});

	$(window).on("scroll", function () {
		// l($(this).scrollTop());
		if ($(this).scrollTop()! > 400) {
			//use `this`, not `document`
			// l("this should work");
			$(".toTheTop").fadeIn("fast");
			// $(".toTheTop").css("visibility", "visible");
		} else {
			$(".toTheTop").fadeOut("fast");
		}
	});
	// document.querySelector("#");

	let elements: NodeListOf<HTMLDivElement> =
		document.querySelectorAll(".elements");

	if (elements) {
		elements.forEach((item) => {
			item.addEventListener("click", elementClicked);
		});
	}

	const groupBlock: { [key: string]: { [key: string]: string } } = {
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

	if (document.querySelector(".periodic-table")) {
		l("generating");

		// let obj: string[][] = periodictable.Row;
		obj = periodictable.Row;

		// l(obj)

		document.querySelectorAll(".elements").forEach((element, index, parent) => {
			l(index);

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

	/// START of MODEL (positioning is important load this before everything else is loaded)
	model = new ElementModel(1);

	document
		.querySelectorAll(".hover-control")
		.forEach((element: EventTarget) => {
			element.addEventListener("mouseleave", mouseOut);
		});
	document
		.querySelectorAll(".hover-control")
		.forEach((element: EventTarget) => {
			element.addEventListener("mouseenter", mouseOver);
		});
	/// END of MODEL

	elementClicked(1);
});
