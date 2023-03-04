
function darkmode() {
  let element = document.body;
  element.classList.toggle("light-mode");

  let toggleTheme = document.querySelector(".toggle-theme");
  // console.log(toggleTheme)
  if (toggleTheme.classList.contains(".fa-sun")) {
    toggleTheme.classList.toggle("fa-sun")
    toggleTheme.classList.toggle("fa-moon")
  } else {
    toggleTheme.classList.toggle("fa-moon")
    toggleTheme.classList.toggle("fa-sun")
  }

}