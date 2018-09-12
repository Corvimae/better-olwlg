const mainModifications = [
	{
		matches: node => node.tagName === "CENTER",
		transformHTML: content => content.split(":")[0]
	},
	{
		matches: window.modifyDiv.requireText("Please *note*"),
		combineRest: "div",
		combineUntil: node => node.tagName === "DIV",
		className: ["alert", "info"]
	},
	{
		matches: window.modifyDiv.hasStyle("backgroundColor", "yellow"),
		className: ["alert", "news-box"]
	},
	{
		matches: node => node.tagName === "H2",
		className: ["welcome-message"]
	},
	{
		matches: window.modifyDiv.requireText("Your collection data (from BGG)", "p"),
		className: ["alert", "info"]
	},
	{
		matches: window.modifyDiv.requireText("Icons guide:", "p"),
		className: ["guide-panel", "icon-guide-container"],
		transformHTML: content => content.replace(/(?![^<]*>)(?:=|,)/g, "")
	},
	{
		matches: window.modifyDiv.requireText("Icons guide:", "text"),
		wrap: true,
		className: "guide-panel-title",
		transformHTML: content => content.replace(":", "")
	},
	window.modifyDiv.groupIcon("arrow.gif"),
	window.modifyDiv.groupIcon("plusbox.png"),
	window.modifyDiv.groupIcon("step4.gif"),
	window.modifyDiv.groupIcon("geeklist.gif"),
	window.modifyDiv.groupIcon("forum.gif"),
	window.modifyDiv.groupIcon("cart.png"),
	window.modifyDiv.groupIcon("myown.gif"),
	window.modifyDiv.groupIcon("stats.gif"),
	window.modifyDiv.groupIcon("users.gif"),
	{
		matches: node => node.tagName === "FORM",
		className: "guide-panel"
	}
];

window.modifyDiv(document.body.children[1], mainModifications);

const tradeInfoModifications = [
	{
		matches: node => {
			const parent = node.parentNode;
			
			return parent && parent.tagName === "LI" && Array.from(parent.children).indexOf(node) === 0;
		},
		combineRest: "div",
		combineUntil: node => node.tagName === "BR",
		className: "trade-statistics",
		childRules: [
			{
				matches: node => node.href && node.href.indexOf("viewlist.cgi") !== -1,
				className: "trade-link"
			},
			{
				matches: window.modifyDiv.requireText(" (by"),
				combineRest: "div",
				combineUntil: node => node.tagName === "FONT",
				className: "trade-owner"
			},
			{
				matches: node => node.tagName === "FONT" && node.color === "green",
				className: ["info-pill", "trade-total-items"]
			},
			{
				matches: node => window.modifyDiv.requireText("are yours)")(node) || window.modifyDiv.requireText("are given user's)")(node),
				wrap: true,
				className: ["info-pill", "trade-my-items"],
				transformHTML: content => content.replace(/\(|\)/g, "")
			},
			{
				matches: node => node.tagName === "FONT" && node.color === "red",
				className: ["info-pill", "trade-total-users"]
			}
		]
	},
	{
		matches: node => node.nodeType === document.TEXT_NODE && node.textContent.trim().length === 0,
		remove: true
	},
	{
		matches: node => node.previousElementSibling && node.previousElementSibling.tagName === "BR",
		combineRest: "div",
		className: "trade-options",
		childRules: [
			{
				matches: node => window.modifyDiv.isTextNode(node) && node.parentNode.classList.contains("trade-options"),
				remove: true
			},
			{
				matches: node => node.tagName === "A" && window.modifyDiv.isTextNode(node.childNodes[0]) && node.parentNode.classList.contains("trade-options"),
				className: "trade-link-action"
			},
			{
				matches: node => node.textContent === "WANTS",
				transformHTML: content => "Wants"
			},
			{
				matches: node => node.tagName === "HR",
				remove: true
			},
			{
				matches: node => node.tagName === "SPAN" && node.style.backgroundColor === "red",
				className: ["alert", "error", "trade-link-alert"]
			}
		]
	},
	{
		matches: node => node.classList && node.classList.contains("deadline"),
		className: "info-pill"
	}
];

document.querySelectorAll("div:not(.news-box) > ul > li").forEach(trade => {
	trade.classList.add("trade-row");

	window.modifyDiv(trade, tradeInfoModifications);
});


document.querySelectorAll("div:not(.news-box) > ol > li").forEach(trade => {
	trade.classList.add("trade-row");

	window.modifyDiv(trade, tradeInfoModifications);
});