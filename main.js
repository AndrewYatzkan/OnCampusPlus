// use Array.prototype.reduce?

function main() {
	log("Running the main function.");
	if (quarterID !== getQuarterID()) {
		log(`Quarter ID changed.`);
		reset();
	}
	addPanel();
	var currentGradeInfo = getCurrentGrades();
	var gpa = calculateGPA(currentGradeInfo);
	log(`GPA: ${gpa}`);
	// var storedGradeInfo = getStoredGrades(currentGradeInfo);
	var storedGradeInfo = [{"class":"Adv Algebra w/Trig-H","grade":"5.97"},{"class":"Body of Christ","grade":"2.92"},{"class":"Chemistry-H","grade":"15.00"},{"class":"Consumer Ed","grade":"34.57"},{"class":"Eng II Amer Lit&Comp","grade":"42.62"},{"class":"PE II","grade":"31.55"},{"class":"Spanish II-H","grade":"45.59"}];
	var changes = lookForChanges(currentGradeInfo, storedGradeInfo);
	log(`${changes.length} change(s).`);
	updatePanel(changes);
}

function calculateGPA(grades) {
	var toGPA = {"70":1.00,"71":1.16,"72":1.33,"73":1.5,"74":1.66,"75":1.83,"76":2,"77":2.11,"78":2.22,"79":2.33,"80":2.44,"81":2.56,"82":2.67,"83":2.78,"84":2.89,"85":3,"86":3.13,"87":3.25,"88":3.38,"89":3.5,"90":3.63,"91":3.75,"92":3.88,"93":4,"94":4.14,"95":4.29,"96":4.43,"97":4.57,"98":4.71,"99":4.86};
	var gpa = 0;
	for (var i = 0; i < grades.length; i++) {
		let grade = Math.round(grades[i].grade);
		if (grade > 99) grade = 99;
		else if (grade < 70) grade = 70;
		gpa += toGPA[grade] + (grades[i].class.search(/-H$/) !== -1);
	}
	gpa /= grades.length;
	gpa = gpa.toFixed(2);
	return gpa;
}

function reset() {
	log("RESETTING");
	localStorage.setItem("grades", "[]");
}

function updatePanel(changes) {
	var panel = document.getElementById("gradesText");
	if (!panel) {
		log("Could not update panel. (Panel doesn't exist)");
		return;
	}
	for (var i = 0; i < changes.length; i++) {
		let change = changes[i];
		let {className, newGrade, oldGrade} = {...change};
		let arrow = newGrade > oldGrade ? up_arrow : down_arrow;
		panel.innerHTML += `<img style="margin-bottom: 0.3rem;" width="14" height="14" src="${arrow}"> <b>${className}</b> used to be <b>${oldGrade}%</b>, now it's <b>${newGrade}%</b>.<br>`;
	}
}

// add panel & css
function addPanel() {
	log("Adding panel.");

	if (!!document.getElementById("gradesContainer")) {
		log("Error adding panel. (Panel already exists)");
		return;
	}
	var html = `<div class="ch col-md-4" id="gradesContainer" style='width: 34%;'><section id="grades" class="bb-tile"><div class="bb-tile-title" data-toggle="collapse" data-target="#gradesCollapse"><div class="bb-tile-header-with-content"><h2 class="bb-tile-header">Grade Changes</h2></div><div class="bb-tile-header-column-tools"><div class="bb-tile-tools"><button type="button" class="fa fa-chevron-down bb-tile-chevron"></button><button id='gradesPanelToggle' type="button" class="fa fa-chevron-up bb-tile-chevron"></button></div></div></div><div id="gradesCollapse" class="bb-tile-content collapse in" aria-expanded="true" aria-hidden="false"><div class="bb-tile-content-section" id="textArea"><div class="row mb-15"><div class="col-md-12"><div class="muted" style="font-size: 0.8rem;" id="gradesText"></div></div><br><br><br><div class="row"><div class="col-md-12 ml-15"></div></div></div></div></div></section></div>`;
  	var panels = document.getElementsByClassName('ch col-md-4');
  	for (var i = 0; i < panels.length; i++) {
  		panels[i].style.width = "22%";
  	}
  	panels[0].insertAdjacentHTML('afterend', html);
  	document.head.insertAdjacentHTML('beforeend', `<style>#ocp_settings{border-radius: 50%;position: relative;left: calc(100% - 0.5rem);transform: translate(-50%, 50%);margin-top: -1.5rem;cursor: pointer;}#ocp_settings:hover{animation:opacity 1s forwards;}@keyframes opacity{100%{opacity: 0.5;}}</style>`);
	document.getElementById("textArea").insertAdjacentHTML("beforeend", `<img id="ocp_settings" width="32" height="32" src="${gear_icon}">`);
}


function getCurrentGrades() {
	log("Gathering current grade info.");
	let gradesDOM = document.getElementsByClassName("showGrade");
	let gradeInfo = [];
	for (var i = 0; i < gradesDOM.length; i++) {
		let classGrade = parseFloat(gradesDOM[i].textContent);
		let className = document.getElementsByClassName("showGrade")[i].parentElement.parentElement.children[0].children[0].textContent;
		// If the grade is a number
		if (!isNaN(classGrade)) {
			gradeInfo.push({
				class: className.split(" - ")[0],
				grade: classGrade
			});
		}
	}
	return gradeInfo;
}

function getStoredGrades(currentGradeInfo) {
	log("Setting `gradeInfo` variable from localStorage and updating localStorage.");
	let gradeInfo = localStorage.getItem("grades");
	localStorage.setItem("grades", JSON.stringify(currentGradeInfo));
	return gradeInfo ? JSON.parse(gradeInfo) : [];
}

function getQuarterID() {
	log("Getting quarter ID from localStorage");
	let qid = localStorage.getItem("quarterID");
	localStorage.setItem("quarterID", quarterID);
	return qid || 0;
}

function lookForChanges(a, b) {
	console.log("\n\n",a,b,"\n\n");
	log("Comparing arrays.");
	let temp = [];
	for (var i = 0; i < a.length; i++) {
		let obj = a[i];
		let oldObj = b[b.findIndex(i => {
			return i.class === obj.class;
		})];
		if (!oldObj) {
			// New class
			log(`New class: ${obj.class}`);
			continue;
		}
		if (obj.grade !== oldObj.grade) {
			temp.push({
				className: obj.class,
				oldGrade: oldObj.grade,
				newGrade: obj.grade
			});
		}
	}
	return temp;
}