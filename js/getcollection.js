const modifications = [
	{
		matches: window.modifyDiv.requireText("collection data (from BGG)", "text"),
		wrap: "div",
		className: ["alert", "info", "clock", "large", "single-line"],
		transformHTML: content => content.replace("collection data (from BGG)", "BoardGameGeek collection data")
			.replace("resynced", "synced")
			.trim() + "."
	}
];

window.modifyDiv(document.querySelector(".header + div"), modifications);

