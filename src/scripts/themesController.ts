import { l, model } from "../script";
import { settings, saveCookie } from "./cookies";

export function applyCurrentTheme() {
	l("ApplyCurrentTheme :" + settings.currentTheme);
	// setTimeout(changeThemeTo, 1000, settings.currentTheme);
	chto(!settings.currentTheme);
	changeButtonThemes(!settings.currentTheme);
	model.updatePenColors();
}

export function toggleTheme() {
	l("toggleTheme to :" + !settings.currentTheme);
	chto(!settings.currentTheme);
	changeButtonThemes(!settings.currentTheme);
	model.updatePenColors();
}

export function chto(theme: boolean) {
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

export function changeButtonThemes(theme: boolean) {
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
