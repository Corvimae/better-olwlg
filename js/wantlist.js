function addColumnNames(row) {
	const tableColumns = ["geeklist-number", "description", "rank", "rating", "bay-rating"];

	row.querySelectorAll(":scope > td, :scope > th").forEach((td, index) => {
		td.classList.add(tableColumns[index]);
	});
}

function addInstructionDivNames() {
	const contentDiv = document.body.children[1];

	contentDiv.classList.add("main-content");

	const divModifications = [
		{
			matches: node => node.tagName === "CENTER",
			className: "step-title"
		},
		{
			matches: node => [].slice.apply(node.childNodes).filter(child => child.classList && child.classList.contains("deadline")).length,
			className: "deadline-container"
		},
		{
			matches: window.modifyDiv.hasClass("deadline"),
			className: ["alert", "info", "clock", "large", "single-line"]
		},
		{
			matches: window.modifyDiv.requireText("Warning!", "h3"),
			combineRest: "div",
			combineUntil: (element, count) => element.tagName === "FONT" || count === 3,
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
			matches: window.modifyDiv.requireText("You are only viewing new items", "font"),
			className: ["alert", "warning", "medium"],
			childRules: [
				{
					matches: window.modifyDiv.requireText("You are only viewing new items", "text"),
					wrap: true,
					transformHTML: content => content.trim() + ", "
				},
				{
					matches: window.modifyDiv.requireText("click here", "a"),
					transformHTML: content => content + "."
				}
			]
		},
		{
			matches: node => node.id === "iframe",
			hide: true
		},
		{
			matches: window.modifyDiv.requireText("unique games", "text"),
			className: "item-count",
			wrap: true,
			transformHTML: content => {
				const matches = content.match(/([0-9]+) items \(([0-9]+)/);

				return `${matches[1]} items (${matches[2]} unique games, items, and sweeteners)`;
			}
		},
		{
			matches: window.modifyDiv.requireTextExactly("[", "text"),
			combineRest: "div",
			combineUntil: (node, count) => count === 3,
			className: "hide-comments"
		},
		{
			matches: node => node.classList && node.classList.contains("notsubmitted"),
			className: ["alert", "warning", "large"]
		},
		{
			matches: window.modifyDiv.requireText("Color Coding:", "text"),
			combineRest: "div",
			combineUntil: node => node.tagName === "BR",
			className: ["guide-panel", "color-coding-container"],
			childRules: [
				{
					matches: window.modifyDiv.requireText("Color Coding:", "text"),
					wrap: true,
					className: ["guide-panel-title", "color-coding-title"],
					transformHTML: text => text.replace(":", "")
				},
				{
					matches: node => node.tagName === "SPAN" && node.textContent.indexOf("Color Coding") === -1,
					className: "color-coding"
				}
			]
		},
		{
			matches: window.modifyDiv.requireText("Icon guide", "text"),
			combineRest: "div",
			combineUntil: node => node.tagName === "TABLE" || node.tagName === "FORM",
			className: ["guide-panel", "icon-guide"],
			childRules: [
				{
					matches: window.modifyDiv.requireText("Icon guide (click on icons in table to use):", "text"),
					wrap: true,
					className: ["guide-panel-title", "icon-guide-title"],
					transformHTML: text => text.replace(":", "")
				},
				{
					matches: node => node.tagName === "BR",
					remove: true
				},
				window.modifyDiv.groupIcon("e.gif"),
				window.modifyDiv.groupIcon("arrow.gif"),
				window.modifyDiv.groupIcon("hello.gif"),
				window.modifyDiv.groupIcon("ok.gif"),
				window.modifyDiv.groupIcon("photo.gif"),
				window.modifyDiv.groupIcon("ds.gif")
			]
		}
	];

	window.modifyDiv(contentDiv, divModifications);
}

function groupDescriptionTopRow(row) {
	const rowClasses = [
		"photo",
		"boardgame-text",
		"game-name",
		"game-year",
		"show-game-description",
		"price-history-graph",
		"price-history-table",
		"ships-from-text",
		"owner",
		"profile-info",
		"math-trade-history",
		"nationality",
		"location",
		"break"
	];
	const descriptionElement = row.querySelector(".description");
	const topRowChildren = [];
	let blankElementsTraversed = 0;

	if(descriptionElement.childNodes[0].tagName !== "IMG") {
		rowClasses.shift();
	}

	for(let [index, child] of [].slice.apply(descriptionElement.childNodes).entries()) {
		if(!child.classList) {
			if(child.textContent.trim().length) {
				const spanWrapper = document.createElement("span");
				const childText = child.textContent.trim();

				if(childText === "Boardgame:") {
					spanWrapper.innerHTML = `<img class="icon" title="Board Game" src="${chrome.extension.getURL("icons/dice.png")}">`;
				} else if(childText === "Rpgitem:") {
					spanWrapper.innerHTML = `<img class="icon" title="Role-playing Game" src="${chrome.extension.getURL("icons/sword.png")}">`;
				} else if(childText === "Videogame:") {
					spanWrapper.innerHTML = `<img class="icon" title="Videogame" src="${chrome.extension.getURL("icons/arcade.png")}">`;
				} else {
					spanWrapper.innerHTML = child.textContent;
				}
				spanWrapper.classList.add(rowClasses[index - blankElementsTraversed]);

				topRowChildren.push({
					element: spanWrapper,
					insert: true,
					remove: false
				});

			} else {
				blankElementsTraversed += 1;
			}

			topRowChildren.push({
				element: child,
				insert: false,
				remove: true
			});
		} else if(child.classList.contains("oi")) {
			break;
		} else {
			// If this is the game name, copy its collection status.
			if(rowClasses[index] === "game-name" && child.className) {
				descriptionElement.classList.add("in-collection", child.className);
			}

			child.classList.add(rowClasses[index - blankElementsTraversed]);

			topRowChildren.push({
				element: child,
				insert: true,
				remove: true
			});
		}
	}

	const topRowElement = document.createElement("div");

	topRowElement.classList.add("details");

	descriptionElement.insertBefore(topRowElement, descriptionElement.childNodes[0]);

	topRowChildren.forEach(child => {
		if(child.remove) descriptionElement.removeChild(child.element);
		if(child.insert) topRowElement.appendChild(child.element);
	});
}

function insertDescriptionContainer(row) {
	const container = document.createElement("div");
	const descriptionElement = row.querySelector(".description");

	container.classList.add("description-contents");

	// If there's a table in the 2nd cell, it's displaying a difference; we need to kill the table.
	if(row.querySelector("td:nth-of-type(2) table")) {
		const cell = row.querySelector("td:nth-of-type(2)");
		const subCellClasses = [
			["alert", "info", "single-line", "listing-change-original-alert"],
			["alert", "info", "single-line", "listing-change-new-alert"],
			"listing-change-original-listing",
			"listing-change-new-listing"
		];

		cell.querySelectorAll("td").forEach((subCell, index) => {
			const subContainer = document.createElement("div");

			subContainer.classList.add.apply(subContainer.classList, Array.isArray(subCellClasses[index]) ? subCellClasses[index] : [subCellClasses[index]]);

			[].slice.apply(subCell.childNodes).forEach(node => subContainer.appendChild(node));

			cell.append(subContainer);
		});

		cell.querySelector("table").remove();
	}

	[].slice.apply(descriptionElement.childNodes).forEach(child => {
		container.appendChild(child);
	});

	descriptionElement.appendChild(container);
}

function addGameInfoBox(parent, htmlContent, className) {
	const gameInfoBoxElement = document.createElement("div");

	gameInfoBoxElement.classList.add("info-pill", "collection-stat", className);

	gameInfoBoxElement.innerHTML = htmlContent;

	parent.appendChild(gameInfoBoxElement);
}

function formatGameInfo(row) {
	const rowClasses = [
		"designer",
		"player-count",
		"play-time",
		"trade"
	];

	const gameInfoElement = row.querySelector(".oi");
	const lastItemIndex = gameInfoElement.childNodes.length - 1;

	gameInfoElement.classList.add("game-info");

	[].slice.apply(gameInfoElement.childNodes).forEach((child, index) => {
		if(child.classList) {
			child.classList.add("info-pill");

			// Split trade/want/wish into separate boxes
			if(index === lastItemIndex) {
				const [categories, amounts] = child.textContent.replace("/", "").trim().split(":");

				const [trade, want, wish] = amounts.split(",").map(Number);

				gameInfoElement.removeChild(child);

				addGameInfoBox(gameInfoElement, `Trade: ${trade}`, "on-trade-list");
				addGameInfoBox(gameInfoElement, `Want: ${want}`, "on-want-list");
				addGameInfoBox(gameInfoElement, `Wish: ${wish}`, "on-wish-list");
			} else {
				child.classList.add(rowClasses[index]);
				child.textContent = child.textContent.replace("/", "").trim();
			}
		} else {
			gameInfoElement.removeChild(child);
		}
	});
}

function addClickActionOverrides() {
	const script = document.createElement("script");

	script.type = "text/javascript";
	script.src = chrome.extension.getURL("js/wantlist-overrides.js");

	document.body.appendChild(script);
}

function addUserInfoBox() {
	const container = document.createElement("div");

	container.id = "user-card";

	const iframe = document.createElement("iframe");

	iframe.id = "user-card-frame";

	const closeButton = document.createElement("button");

	closeButton.className = "user-card-close";
	closeButton.addEventListener("click", () => {
		const frameBox = document.querySelector("#user-card");

		frameBox.classList.remove("visible");
		frameBox.style.left = null;
		frameBox.style.top = null;
	});

	container.appendChild(iframe);
	container.appendChild(closeButton);

	document.body.appendChild(container);
}

function cleanUpPage() {
	const editWantsSections = [].slice.apply(document.querySelectorAll("#editwants"));

	if(editWantsSections.length > 1) {
		editWantsSections.shift();

		editWantsSections.forEach(div => {
			const parent = div.parentElement;

			parent.removeChild(div.nextElementSibling);
			parent.removeChild(div);
		});
	}
}

function styleSubmitButtons() {
	const submitButtonNames = [
		"updatetimestamps"
	];

	submitButtonNames.forEach(buttonName => {
		const button = document.querySelector(`input[name=${buttonName}]`);

		if(button) button.classList.add("submit-button");
	});
}

function modifyForViewChanged() {
	const modifications = [
		{
			matches: node => {
				const previousSibling = node.previousElementSibling;

				return previousSibling && previousSibling.tagName === "INPUT" && previousSibling.name === "updatetimestamps";
			},
			combineRest: "div",
			className: ["alert", "info", "update-timestamps-info"]
		}
	];

	document.querySelectorAll("p").forEach(possibleNode => {
		if(possibleNode.querySelector("input[name=updatetimestamps]")) {
			window.modifyDiv(possibleNode, modifications);

			possibleNode.classList.add("update-timestamps-container");
		}
	});
}

document.onreadystatechange = evt => {
	if(document.readyState === "complete") {
		addInstructionDivNames();
		addColumnNames(document.querySelector("#geeklist > thead > tr"));
		styleSubmitButtons();
		modifyForViewChanged();

		document.querySelectorAll("#geeklist > tbody > tr").forEach(row => {
			addColumnNames(row);
			groupDescriptionTopRow(row);
			insertDescriptionContainer(row);
			formatGameInfo(row);
		});
	}
};

window.addEventListener("load", evt => {
	addUserInfoBox();
	addClickActionOverrides();
	cleanUpPage();
});

/*const replacementIcon = chrome.extension.getURL("icons/profile.png");
const domObserver = new MutationObserver(mutationList => {
	for(let mutation of mutationList) {
		for(let node of mutation.addedNodes) {
			if(node.tagName === "IMG") {
				if(node.src && node.src.indexOf("cf.geekdo-static.com") !== -1) {
					node.src = replacementIcon;
				}
			}
		}
	}
});

domObserver.observe(document.documentElement, {
	childList: true,
	subtree: true
});*/