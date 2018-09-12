document.querySelector(".autocheckinfo").classList.add("alert", "info");

document.querySelectorAll("#wants th").forEach(header => {
	const innerDiv = document.createElement("div");
	const innerSpan = document.createElement("span");

	const columns = [];

	(header.querySelector("tt") || header).childNodes.forEach(child => {
		if(child.tagName !== "BR") {
			for(let index = 0; index < child.textContent.length; index += 1) {
				let subindex = index / 2;

				if(index % 2 === 0) {
					if(!columns[subindex]) columns[subindex] = [];
					columns[subindex].push(child.textContent[index] || " ");
				}
			}
		}
	});

	innerSpan.textContent = columns.map(column => column.join("").trim() + " ").join("").trim();

	innerDiv.appendChild(innerSpan);

	header.innerHTML = "";
	header.appendChild(innerDiv);

	header.classList.remove("vertical");
});

document.querySelectorAll("#wants tbody tr").forEach(row => {
	const secondCell = row.querySelector("td:nth-of-type(2)");

	if(secondCell) {
		const container = document.createElement("div");

		container.classList.add("item-info-container");

		[].slice.apply(secondCell.childNodes).forEach(child => container.appendChild(child));

		secondCell.appendChild(container);

		if(secondCell.classList.contains("isdummyrow")) {
			row.querySelector("td:nth-of-type(1)").classList.add("isdummyrow");
		}
	}
});

const mainModifications = [
	{
		matches: window.modifyDiv.requireText("left to submit", "p"),
		className: ["alert", "info", "clock", "single-line", "large", "time-remaining"]
	},
	{
		matches: window.modifyDiv.requireText("Warning!", "h3"),
		combineRest: "div",
		combineUntil: (element, count) => element.tagName === "TABLE" || count === 3,
		className: ["alert", "warning"],
		childRules: [
			{
				matches: window.modifyDiv.requireText("You can click on each of the following", "text"),
				wrap: true,
				transformHTML: content => content.replace(":", "").replace("Warning!", "").trim() + "."
			}
		]
	},
	{
		matches: window.modifyDiv.hasClass("itemschanged"),
		className: ["alert", "warning"],
		transformHTML: content => {
			const [itemMatch, itemsChanged] = content.match(/([0-9]*) item/);
			const [clickMatch, clickHereLink] = content.match(/<a href="([\S]*)">click here<\/a>/);

			return `${itemsChanged} ${itemsChanged === 1 ? "item has" : "items have"} been edited by their owners after you added ` +
				`them to your wantlist. Please examine the items marked with <img src="images/changed.png" height="24"> and ` +
				`<a href="${clickHereLink}"> click here.</a>`;
		}
	},
	{
		matches: window.modifyDiv.hasClass("notsubmitted"),
		className: ["alert", "warning", "single-line"]
	}
];

const content = document.querySelector(".header").nextElementSibling;

content.classList.add("content");

window.modifyDiv(content, mainModifications);

const helpText = document.querySelector("#gamedesc");

helpText.classList.add("alert", "info", "help-text");
helpText.removeAttribute("id");

const duplicateProtectionModifications = [
	{
		matches: window.modifyDiv.requireText("Create a New Dummy Item", "h2"),
		combineRest: "div",
		combineUntil: element => element.tagName === "H2",
		className: ["alert", "new-dummy-item-panel"]
	},
	{
		matches: window.modifyDiv.requireText("How to Use", "h2"),
		combineRest: "div",
		className: ["alert", "info", "how-to-use-duplicate-protection"]
	}
];

window.modifyDiv(document.querySelector("#dummy"), duplicateProtectionModifications);

document.querySelectorAll(".ondummy2").forEach(warning => warning.classList.add("alert", "error"));

const header = document.querySelector("tr.head");
const scrollingHeader = document.createElement("div");

header.querySelectorAll("th").forEach(column => {
	const scrollingColumn = document.createElement("div");

	scrollingColumn.classList.add("scrolling-column");
	scrollingColumn.innerHTML = column.innerHTML;
	scrollingColumn.style.width = column.offsetWidth + "px";

	scrollingHeader.appendChild(scrollingColumn);
});

scrollingHeader.classList.add("scrolling-header");

document.querySelector("#table").appendChild(scrollingHeader);

const wantsTable = document.querySelector("#wants");
const tableHeader = document.querySelector("#wants thead tr");

window.addEventListener("scroll", evt => {
	const hideScrollingHeader = wantsTable.getBoundingClientRect().top > 54;

	scrollingHeader.style.display = hideScrollingHeader ? "none" : "block";
	tableHeader.style.visibility = hideScrollingHeader ? "visible" : "hidden";
});