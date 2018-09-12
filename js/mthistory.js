const tradeHistoryModifications = [
	{
		matches: node => node.classList && node.classList.contains("guide-panel-title"),
		combineRest: "div",
		combineUntil: node => node.tagName === "H3",
		className: ["guide-panel", "icon-guide-container"],
		transformHTML: content => content.replace(/(?![^<]*>)(?:=|,)/g, "")
	}
];

window.modifyDiv(document.querySelector(".header + div"), tradeHistoryModifications);