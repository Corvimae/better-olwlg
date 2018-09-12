const wrapContents = cell => {
	const wrapper = document.createElement("div");

	wrapper.classList.add("cell-contents");

	[].slice.apply(cell.childNodes).forEach(child => wrapper.appendChild(child));

	cell.appendChild(wrapper);
};

document.querySelectorAll("tbody > tr").forEach(row => {
	const lastRow = row.querySelector("td:last-of-type");
	
	if(lastRow.textContent.length) {
		const date = new Date(lastRow.textContent);

		lastRow.innerHTML = date.toLocaleDateString() + " " + date.toLocaleTimeString();
	}

	wrapContents(row.querySelector("td:nth-of-type(2)"));
	wrapContents(row.querySelector("td:nth-of-type(3)"));

	if(row.bgColor === "yellow") {
		row.classList.add("related-trade");
		row.removeAttribute("bgColor");
	}

	const editedWantsCell = row.querySelector("td[bgcolor=pink]");

	if(editedWantsCell) {
		row.classList.add("edited-wants");
		editedWantsCell.removeAttribute("bgColor");
	}
});

const headerModifications = [
	{
		matches: window.modifyDiv.requireText("Note: click on column", "text"),
		remove: true
	},
	{
		matches: window.modifyDiv.requireText("Yellow background rows", "span"),
		className: ["guide-panel", "related-trade"]
	},
	{
		matches: window.modifyDiv.requireText("Pink background table", "span"),
		className: ["guide-panel", "edited-wants"]
	},
	{
		matches: window.modifyDiv.requireTextExactly(".", "text"),
		remove: true
	},
	{
		matches: node => node.tagName === "BR" && node.nextElementSibling.tagName === "SPAN",
		remove: true
	},
	{
		matches: window.modifyDiv.requireText("Users", "H2"),
		remove: true
	},
	{
		matches: window.modifyDiv.requireText("General Statistics", "H2"),
		combineRest: "div",
		combineUntil: node => node.style && node.style.backgroundColor === "yellow",
		className: "guide-panel",
		childRules: [
			{
				matches: window.modifyDiv.requireText("General Statistics", "H2"),
				className: "guide-panel-title"
			}
		]
	}
];

window.modifyDiv(document.querySelector(".header + div"), headerModifications);