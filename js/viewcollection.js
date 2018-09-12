const modifyFlagCount = (text, template) => ({
	matches: window.modifyDiv.requireText(text + "=", "span"),
	className: "info-pill",
	transformHTML: content => {
		const [match, count] = content.match(/\S+=([0-9]+)/);

		return template.replace("{0}", count).replace("{s}", count === 1 ? "" : "s");
	}
});

const collectionModifications = [
	{
		matches: window.modifyDiv.requireText("Collection data is for", "h3"),
		transformHTML: content => content.replace("Collection data is for", "").trim() + "'s Collection"
	},
	{
		matches: window.modifyDiv.requireText("resync BGG collection data now", "a"),
		className: "resync-button",
		transformHTML: content => "Resync Collection"
	},
	{
		matches: node => node.previousElementSibling && node.previousElementSibling.tagName === "TABLE",
		combineRest: "div",
		className: "flag-counts",
		childRules: [
			modifyFlagCount("noflags", "{0} unflagged"),
			modifyFlagCount("own", "{0} owned"),
			modifyFlagCount("preordered", "{0} preordered"),
			modifyFlagCount("prevowned", "{0} previously owned"),
			modifyFlagCount("rating", "{0} rated"),
			modifyFlagCount("wishlistpriority", "{0} on wishlist")
		]
	}
];

window.modifyDiv(document.querySelector(".header + div"), collectionModifications);

const nameCol = document.querySelector("col:nth-of-type(2)");

nameCol.setAttribute("width", "35%");
document.querySelector("col:nth-of-type(1)").remove();

const ratingCol = document.createElement("col");

ratingCol.setAttribute("width", "10%");

nameCol.parentElement.insertBefore(ratingCol, nameCol.nextElementSibling);

document.querySelector("thead tr th:nth-of-type(1)").remove();

const nameHeader = document.createElement("th");

nameHeader.textContent = "Rating";

document.querySelector("thead tr").insertBefore(nameHeader, document.querySelector("thead tr th:nth-of-type(2)"));

document.querySelectorAll("tbody tr").forEach(row => {
	const flagCell = row.querySelector("td:nth-of-type(1)");
	const nameCell = row.querySelector("td:nth-of-type(2)");
	let rating = "";

	flagCell.querySelectorAll("span").forEach(flag => {

		if(flag.classList.contains("rating")) {
			rating = flag.textContent;
			flag.remove();
		} else {
			flag.classList.add("info-pill");
			nameCell.appendChild(flag);
		}
	});

	const descriptionCell = row.querySelector("td:nth-of-type(4)");

	descriptionCell.innerHTML = descriptionCell.innerHTML.replace(
		/\[(\S+)=([0-9]+)]([\s\S]*?)\[\/\1]/gm,
		(match, tag, id, content) => `<a href="https://boardgamegeek.com/thing/${id}">${content}</a>`
	);
	
	flagCell.remove();

	const ratingCell = document.createElement("td");

	ratingCell.textContent = rating.replace("rating=", "");
	
	nameCell.parentElement.insertBefore(ratingCell, nameCell.nextElementSibling);
});