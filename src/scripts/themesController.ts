import { l, model, theme } from "../script";
import { settings, saveCookie } from "./cookies";

export function applyCurrentTheme() {
	l("ApplyCurrentTheme :" + settings.currentTheme);
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

	//check if needs to change the default color
	if (settings.currentTheme == theme) {
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

	if (settings.currentTheme == theme) {
		if (settings.currentTheme == settings.defaultTheme) {
			return;
		}
	}

	let element = document.documentElement;
	let themeButton = document.querySelector(".toggle-theme")!;

	if (theme) {
		l("DarkMode: Changing to " + theme);
		themeButton.classList.toggle("fa-sun");
		themeButton.classList.toggle("fa-moon");
	} else {
		l("LightMode: Changing to " + theme);
		themeButton.classList.toggle("fa-moon");
		themeButton.classList.toggle("fa-sun");
	}
	settings.currentTheme = theme;

	saveCookie();
}
