const firstTableHeaders = [
	"Price",
	"Condition",
	"Date Listed",
	"Date Sold",
	"Notes"
];

document.querySelectorAll("table:nth-of-type(1) th").forEach((element, index) => {
	element.textContent = firstTableHeaders[index];
});

const secondTableHeaders = [
	"Price",
	"Condition",
	"Date Listed",
	"Notes"
];

document.querySelectorAll("table:nth-of-type(2) th").forEach((element, index) => {
	element.textContent = secondTableHeaders[index];
});