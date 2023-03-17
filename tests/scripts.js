import $ from "";

let theme = true; //dark

$("#toggle")[0].addEventListener("click", (e) => {
	let body = document.documentElement;
	console.log(theme);
	if (theme) {
		body.classList.toggle("dark");
		body.classList.toggle("light");
		theme = !theme;
	} else if (!theme) {
		body.classList.toggle("light");
		body.classList.toggle("dark");
		theme = !theme;
	}
});
