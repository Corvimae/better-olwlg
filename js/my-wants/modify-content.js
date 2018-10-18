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
		matches: window.modifyDiv.hasClass("autocheckinfo"),
		remove: true
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

const instructionsModification = {
	matches: window.modifyDiv.requireText("How to Use", "h2"),
	combineRest: "div",
	className: ["alert", "info", "how-to-use-duplicate-protection"]
};

const duplicateProtectionModifications = [
	{
		matches: window.modifyDiv.requireText("Create a New Dummy Item", "h2"),
		combineRest: "div",
		combineUntil: element => element.tagName === "H2",
		className: ["alert", "new-dummy-item-panel"]
	},
	instructionsModification
];

const newDummyModifications = [
	{
		matches: node => {
			return node.tagName === "INPUT" && node.type.toLowerCase() === "checkbox";
		},
		combineRest: "div",
		combineUntil: node => node.tagName === "BR",
		transform: node => {
			const checkbox = node.children[0];

			checkbox.setAttribute("id", "group");

			node.appendChild(window.modifyDiv.buildCheckboxElement(node, "group"));
		}
	}
];

const autoDuplicateModifications = [
	instructionsModification,
	{
		matches: node => node.tagName === "TABLE",
		className: "auto-dummy-table"
	},
	{
		matches: node => node.tagName === "INPUT" && node.name === "autoadd",
		combineRest: "div",
		combineUntil: node => node.tagName === "INPUT" && node.type === "submit",
		className: "auto-add-toggle",
		transform: node => {
			const checkbox = node.children[0];

			checkbox.setAttribute("id", "autoadd");

			node.appendChild(window.modifyDiv.buildCheckboxElement(node, "autoadd"));
		}
	}
];

export default function modifyContent() {
	// This is bad.
	const content = document.body.children[5];

	content.classList.add("content");

	window.modifyDiv(content, mainModifications);

	const helpText = document.querySelector("#gamedesc");

	if(helpText) {
		helpText.classList.add("alert", "info", "help-text");
		helpText.removeAttribute("id");
	}

	window.modifyDiv(document.querySelector("#dummy"), duplicateProtectionModifications);

	window.modifyDiv(document.querySelector("#newdummy"), newDummyModifications);

	const autoAddToggle = document.querySelector("input[name='autoadd']");

	if(autoAddToggle) {
		window.modifyDiv(autoAddToggle.parentElement, autoDuplicateModifications);

		document.querySelectorAll(".auto-dummy-table tbody input[type='checkbox']").forEach(checkbox => {
			const container = document.createElement("div");

			checkbox.setAttribute("id", checkbox.name);

			checkbox.parentElement.insertBefore(container, checkbox);

			container.appendChild(checkbox);
			container.appendChild(window.modifyDiv.buildCheckboxElement(checkbox, checkbox.name));
		});
	}

	document.querySelectorAll(".ondummy2").forEach(warning => warning.classList.add("alert", "error"));

	document.querySelectorAll(".tab").forEach(tab => {
		const button = document.createElement("button");

		button.classList.add("mode-button", tab.getAttribute("bgcolor"));
		button.onclick = tab.onclick;

		tab.removeAttribute("onclick");
		tab.removeAttribute("bgcolor");

		button.innerHTML = tab.innerHTML;
		tab.innerHTML = "";

		tab.appendChild(button);
	});
}