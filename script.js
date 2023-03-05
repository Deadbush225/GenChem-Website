// Dark = 1
// Light = 0

// global = {
// defaultTheme = 1,
// currentTheme = defaultTheme
// }

// let settings = {
//   defaultTheme : true,
//   currentTheme : this.defaultTheme
// }

let saveCookie = () => {
  // alert("cookies saved")
  l("Saving cookies: ")
  l(settings)
  Cookies.set(
    "settings/defaultTheme",
    fromStrerializeFlag(Number(settings.defaultTheme))
  );
  Cookies.set(
    "settings/currentTheme",
    fromStrerializeFlag(Number(settings.currentTheme))
  ); // we interact to the setting as boolean but we save it as integer
};

// import Cookies from "../node_modules/js-cookie/dist/js.cookie.mjs";
// let Cookies = require("js-cookie");

function initCookie() {
  let settings = {};

  // settings.currentTheme = Cookies.get("settings/currentTheme");
  // settings.defaultTheme = Cookies.get("settings/defaultTheme");

  // if (!settings) {
  settings = {
    // problem, the return if doesn't exist and "true" false is == false
    defaultTheme: toSterializeFlag(
      Number(Cookies.get("settings/defaultTheme"))
    ),
    currentTheme: toSterializeFlag(
      Number(Cookies.get("settings/currentTheme"))
    ),
  };
  // }
  l("Getting Cookies: ");
  l(settings)
  return settings;
}

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
  // l("input ")
  // l(number)

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

function l(message) {
  console.log(message);
}

function applyCurrentTheme() {
  l("ApplyCurrentTheme :" + settings.currentTheme);
  changeThemeTo(settings.currentTheme);
}

function toggleTheme() {
  l("toggleTheme to :" + !settings.currentTheme);
  changeThemeTo(!settings.currentTheme);
}

function changeThemeTo(theme) {
  l("changing from " + settings.currentTheme + " to " + theme);
  // l("defaultTheme: " + settings.defaultTheme);

  //check if needs to change the default color
  if (settings.currentTheme == theme) {
    // saveCookie()
    if (settings.currentTheme == settings.defaultTheme) {
      return;
    }
  }
  let element = document.body;
  element.classList.toggle("light-mode");

  themeButton = document.querySelector(".toggle-theme");

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

  l(settings);
  saveCookie();
}

let settings;
$(document).ready(() => {
  settings = initCookie();
  applyCurrentTheme();
});
// toggleTheme()
