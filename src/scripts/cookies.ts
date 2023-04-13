import { l } from "../script";
import Cookies from "js-cookie";

/* + COOKIES */
export let saveCookie = () => {
	// alert("cookies saved")
	l("Saving cookies: ");
	l(settings);
	Cookies.set(
		"settings/defaultTheme",
		fromStrerializeFlag(settings.defaultTheme).toString()
	);
	Cookies.set(
		"settings/currentTheme",
		fromStrerializeFlag(settings.currentTheme).toString()
	); // we interact to the setting as boolean but we save it as integer
};

export function initCookie() {
	let settings: { defaultTheme: boolean; currentTheme: boolean };

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
function fromStrerializeFlag(number: boolean): number {
	let i: number = 0;

	if (number) {
		i = 1;
	} else if (!number) {
		i = 0;
	}

	return i;
}

function toSterializeFlag(number: number): boolean {
	let i: boolean;

	i = number == 1 || isNaN(number) ? true : false;
	return i;
}

export let settings = initCookie();
