ocpDebug = !!localStorage.getItem("ocpDebug");

// Wait for DOM to load
function waitForDOM() {
	log("Waiting for DOM.");
	// Check for arbitrary DOM elements
	if (!!document.getElementsByClassName("muted").length
		&& !!document.getElementsByClassName("ch col-md-4").length
		&& !!document.querySelector("ul.dropdown-menu > li.active > a")) {
		// Remove hashchange event listener to avoid running OCP more than once
		window.removeEventListener("hashchange", checkURL);
		log("DOM loaded.");
		quarterID = document.querySelector("ul.dropdown-menu > li.active > a").dataset.value;
		if (!quarterID) {
			log("Error: Could not find quarter id.");
			return;
		}
		main();
		// Call main function
	} else {
		// Recursively call this function
		setTimeout(waitForDOM, 50);
	}
}

// Shorthand for `if (d) console.log(X);`
function log(msg) {
	if (ocpDebug) console.log(msg);
}

// Check if the URL is correct before running
function checkURL() {
	log("Checking URL.");
	// If new page is progress page
	if (window.location.href === "https://sfhscollegeprep.myschoolapp.com/app/student#studentmyday/progress") {
		// Wait for DOM to load
		waitForDOM();
	}
}

checkURL();

// When the page changes
window.addEventListener("hashchange", checkURL);