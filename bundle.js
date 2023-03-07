(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*! js-cookie v3.0.1 | MIT */
;
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (function () {
    var current = global.Cookies;
    var exports = global.Cookies = factory();
    exports.noConflict = function () { global.Cookies = current; return exports; };
  }()));
}(this, (function () { 'use strict';

  /* eslint-disable no-var */
  function assign (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        target[key] = source[key];
      }
    }
    return target
  }
  /* eslint-enable no-var */

  /* eslint-disable no-var */
  var defaultConverter = {
    read: function (value) {
      if (value[0] === '"') {
        value = value.slice(1, -1);
      }
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
    },
    write: function (value) {
      return encodeURIComponent(value).replace(
        /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
        decodeURIComponent
      )
    }
  };
  /* eslint-enable no-var */

  /* eslint-disable no-var */

  function init (converter, defaultAttributes) {
    function set (key, value, attributes) {
      if (typeof document === 'undefined') {
        return
      }

      attributes = assign({}, defaultAttributes, attributes);

      if (typeof attributes.expires === 'number') {
        attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
      }
      if (attributes.expires) {
        attributes.expires = attributes.expires.toUTCString();
      }

      key = encodeURIComponent(key)
        .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
        .replace(/[()]/g, escape);

      var stringifiedAttributes = '';
      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue
        }

        stringifiedAttributes += '; ' + attributeName;

        if (attributes[attributeName] === true) {
          continue
        }

        // Considers RFC 6265 section 5.2:
        // ...
        // 3.  If the remaining unparsed-attributes contains a %x3B (";")
        //     character:
        // Consume the characters of the unparsed-attributes up to,
        // not including, the first %x3B (";") character.
        // ...
        stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
      }

      return (document.cookie =
        key + '=' + converter.write(value, key) + stringifiedAttributes)
    }

    function get (key) {
      if (typeof document === 'undefined' || (arguments.length && !key)) {
        return
      }

      // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all.
      var cookies = document.cookie ? document.cookie.split('; ') : [];
      var jar = {};
      for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        var value = parts.slice(1).join('=');

        try {
          var foundKey = decodeURIComponent(parts[0]);
          jar[foundKey] = converter.read(value, foundKey);

          if (key === foundKey) {
            break
          }
        } catch (e) {}
      }

      return key ? jar[key] : jar
    }

    return Object.create(
      {
        set: set,
        get: get,
        remove: function (key, attributes) {
          set(
            key,
            '',
            assign({}, attributes, {
              expires: -1
            })
          );
        },
        withAttributes: function (attributes) {
          return init(this.converter, assign({}, this.attributes, attributes))
        },
        withConverter: function (converter) {
          return init(assign({}, this.converter, converter), this.attributes)
        }
      },
      {
        attributes: { value: Object.freeze(defaultAttributes) },
        converter: { value: Object.freeze(converter) }
      }
    )
  }

  var api = init(defaultConverter, { path: '/' });
  /* eslint-enable no-var */

  return api;

})));

},{}],2:[function(require,module,exports){
// Dark = 1
// Light = 0

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
		defaultTheme: toSterializeFlag(Number(Cookies.get("settings/defaultTheme"))),
		currentTheme: toSterializeFlag(Number(Cookies.get("settings/currentTheme"))),
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
let Cookies = require("js-cookie");

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
	let themeButton = document.querySelector(".toggle-theme");

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

let settings;
settings = initCookie();

chto(settings.currentTheme);

$(document).ready(() => {
	// applyCurrentTheme();
	changeButtonThemes(settings.currentTheme);
});
// toggleTheme()

},{"js-cookie":1}]},{},[2]);
