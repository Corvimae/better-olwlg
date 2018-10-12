const createLabel = (text, inputId) => ({
	matches: window.modifyDiv.requireText(text, "text"),
	wrap: "label",
	attributes: {
		for: inputId
	},
	transformHTML: content => content.replace(":", "").trim()
});

const createSelect = (name, id) => ({
	matches: node => node.tagName === "SELECT" && node.name === name,
	preWrapAttributes: {
		id: id
	},
	wrap: "div",
	className: "select"
});

const createHelpText = (text, transform) => ({
	matches: window.modifyDiv.requireText(text, "text"),
	combineRest: "div",
	className: "help-text",
	transformHTML: transform
});

const createCheckboxRow = (text, inputId, transform) => ({
	matches: node => node.tagName === "TD" && node.textContent.indexOf(text) !== -1,
	transform: node => {
		const checkbox = node.children[0];

		checkbox.setAttribute("id", inputId);

		node.appendChild(window.modifyDiv.buildCheckboxElement(node, inputId, transform));
	}
});

const capitalizeAndPunctuate = nodes => {
	const text = nodes[0].textContent.trim();

	nodes[0].textContent = text.charAt(0).toUpperCase() + text.slice(1);

	nodes[nodes.length - 1].textContent = nodes[nodes.length - 1].textContent.trim() + ".";
};

const processFilters = (matchText, prefix, transformHeader, additionalMatchRequirement) => ({
	matches: node => window.modifyDiv.requireText(matchText, "text")(node) && (!additionalMatchRequirement || additionalMatchRequirement(node)),
	combineRest: "div",
	combineUntil: node => node.tagName === "BR",
	className: "list-visibility-title",
	transformHTML: transformHeader,
	transform: node => {
		let checkboxes = [
			{
				id: "ignore-owned",
				text: "Ignore games I own"
			},
			{
				id: "notify-of-sales",
				text: "Notify of sales"
			},
			{
				id: "pre-ordered",
				text: "Show games I've preordered"
			},
			{
				id: "wanted-in-trade",
				text: "Show games I want in trades"
			},
			{
				id: "want-to-buy",
				text: "Show games I want to buy"
			},
			{
				id: "want-to-play",
				text: "Show games I want to play"
			},
			{
				id: "wishlist",
				text: "Show games in my wishlist"
			}
		];
		let nextSibling = node.nextSibling;
		let processed = 0;

		while(nextSibling !== null) {
			if(nextSibling.tagName === "INPUT") {
				nextSibling.setAttribute("id", prefix + "-" + checkboxes[processed].id);

				const textNode = nextSibling.nextSibling;

				nextSibling.after(window.modifyDiv.buildCheckboxElement(
					textNode,
					prefix + "-" + checkboxes[processed].id,
					() => checkboxes[processed].text)
				);

				textNode.parentElement.removeChild(textNode);

				processed += 1;
			}

			nextSibling = nextSibling.nextSibling;
		}
	}
});

const tableModifications = [
	createLabel("Language", "language-selector"),
	createSelect("LANG", "language-selector"),
	createHelpText(
		"German, French",
		content => `Additional languages coming soon. <a href="http://www.boardgamegeek.com/article/13129674#13129674">` +
			`Volunteer to translate your language!</a>`
	),
	createLabel("Timezone", "timezone-selector"),
	createSelect("TZ", "timezone-selector"),
	{
		matches: node => node.tagName === "SPAN" && node.textContent.indexOf("if you do not see") !== -1,
		className: "help-text",
		transformHTML: content => `If you do not see your timezone, please <a href="https://boardgamegeek.com/guild/1838">` +
			`contact the administrator.</a>`
	},
	processFilters(
		"For magnify glass",
		"collection-filter",
		content => `<img src="../icon/magglass.jpg" height="25"> When filtering by items in my collection...`
	),
	processFilters(
		"For",
		"auction-filter",
		content => `<img src="../icon/auction.png" height="25"> When filtering the <a href="../auctions/">auction finder</a>...`,
		node => node.parentElement.classList.contains("auctions")
	),
	{
		matches: node => node.tagName === "SPAN" && node.classList.contains("auctions"),
		transform: node => {
			const value = node.querySelector("input").value;

			node.innerHTML = `<label for="max-wishlist-priority">Maximum wish list priority</label>` +
				`<input type="text" id="max-wishlist-priority" name="MAXWISHPRIORITY" size="3" value/>`;

			node.querySelector("input").value = value;
		}
	},
	{
		matches: window.modifyDiv.requireText("this will apply to both", "i"),
		className: "help-text",
		transformHTML: content => "Applies to both collection filter and the auction finder."
	},
	{
		matches: window.modifyDiv.requireText("step 3 highlighting colors", "text"),
		wrap: "div",
		transformHTML: content => "Trade listing highlight colors",
		transform: node => {
			const table = node.nextElementSibling;
			const highlightNames = {
				default: "Default",
				notifysale: "Notify of sale",
				own: "Owned",
				preordered: "Pre-ordered",
				prevowned: "Previously owned",
				want: "Want in trade",
				wanttobuy: "Want to buy",
				wanttoplay: "Want to play",
				wishlistpriority1: "In wishlist (1 - Must have)",
				wishlistpriority2: "In wishlist (2 - Love to have)",
				wishlistpriority3: "In wishlist (3 - Like to have)",
				wishlistpriority4: "In wishlist (4 - Thinking about it)",
				wishlistpriority5: "In wishlist (5 -Don't buy this)"
			};

			table.classList.add("highlight-colors");

			[].slice.apply(table.querySelectorAll("tr")).forEach(row => {
				const [labelCell, inputCell] = row.querySelectorAll("td");

				labelCell.classList.add("highlight-margin");

				const colorSpan = labelCell.querySelector("span");
				const elementId = colorSpan.textContent;

				colorSpan.innerHTML = "";
				colorSpan.classList.add("color-block");

				const label = document.createElement("label");

				label.setAttribute("for", elementId);
				label.innerHTML = highlightNames[elementId];

				inputCell.classList.add("highlight-option");

				inputCell.querySelector("input").setAttribute("type", "text");

				inputCell.prepend(colorSpan);
				inputCell.prepend(label);
			});
		}
	}
];

const checkboxModifications = [
	createCheckboxRow("turn on", "one-click-add", capitalizeAndPunctuate),
	createCheckboxRow(
		"you are in is resynced with the geeklist",
		"resync-notifications",
		(nodes, parent) => {
			parent.innerHTML = "Receive GeekMail notifications when a trade you are in is resynced with its GeekList.";
		}
	),
	createCheckboxRow(
		"has the results uploaded",
		"upload-notifications",
		(nodes, parent) => {
			parent.innerHTML = "Receive GeekMail notifications when a trade you are in uploads results.";
		}
	),
	createCheckboxRow(
		"BGG geek auction matches your collection data",
		"auction-notifications",
		(nodes, parent) => {
			const value = parent.querySelector("select").value;

			parent.innerHTML = `Receive GeekMail notifications when a BGG auction matches your collection.
				<div class="auction-notification-container">
					<label for="auction-notification-frequency">Frequency</label>
					<div class="select">
						<select id="auction-notification-frequency" name="AUCTIONSNOTIFYFREQUENCY">
							<option value="">As they are discovered</option>
							<option value="daily">Once daily</option>
							<option value="weekly">Once weekly</option>
						</select>
					</div>
				</div>
			`;

			parent.querySelector("select").value = value;
		}
	),
	createCheckboxRow(
		"new style step 4",
		"new-style-step-four",
		(nodes, parent) => {
			parent.innerHTML = `<a href="http://www.boardgamegeek.com/article/4927326#4927326">Enable improved wants editor</a>.`;
		}
	),
	createCheckboxRow(
		"new style step 4",
		"new-style-step-four",
		(nodes, parent) => {
			parent.innerHTML = `<a href="http://www.boardgamegeek.com/article/4927326#4927326">Enable improved wants editor</a>.`;
		}
	),
	createCheckboxRow(
		"hide by default the columns",
		"hide-dummy-columns",
		(nodes, parent) => {
			parent.innerHTML = "Hide dummy columns in wants editor.";
		}
	),
	{
		matches: node => node.tagName === "TD" && node.textContent.indexOf("hide descriptions over this size") !== -1,
		transform: node => {
			const value = node.querySelector("input").value;

			node.innerHTML = `<label for="max-description-size">Maximum description size</label>` +
				`<input type="text" id="max-description-size" class="input-with-units" name="STEP3MAXBODYSIZE" size="5" value="" placeholder="2000"/>` +
				`<div class="input-units">bytes</div>` +
				`<div class="help-text">Descriptions larger than this limit will be hidden.</div>`;

			node.querySelector("input").value = value;
		}
	},
	createCheckboxRow(
		"allow duplicate copies of cash",
		"allow-duplicate-cash",
		(nodes, parent) => {
			parent.innerHTML = "Allow duplicates copies of cash offers with the Copies option.";
		}
	),
	{
		matches: window.modifyDiv.requireText("step 4 column colors", "td"),
		transform: node => {
			const value = node.querySelector("input").value;

			node.innerHTML = `<label for="column-colors">Wants editor column colors</label>` +
				`<input type="text" id="column-colors" name="STEP4COLORS" size="35" value/>` +
				`<div class="help-text">Separate each color with a space.</div>`;

			node.querySelector("input").value = value;
		}
	}
];

document.querySelectorAll("tbody tr").forEach(node => window.modifyDiv(node, checkboxModifications));
document.querySelectorAll("tbody td").forEach(node => window.modifyDiv(node, tableModifications));

const userCardCell = document.querySelector("form > table > tbody > tr:last-of-type td");

const profileImage = userCardCell.querySelector(`img[src*="avatars"]`).src;
const profileMatch = profileImage && profileImage.match(/avatar_id([0-9]*)/);
const profileId = profileMatch && profileMatch[1];

userCardCell.innerHTML = `<iframe class="user-card" src="userinfo.cgi?user=${window.OLWLG.username}&profile=${profileId}"></iframe>`;

const alertModifications = [
	{
		matches: window.modifyDiv.requireText("Success", "h2"),
		combineRest: true,
		combineUntil: node => node.tagName === "FORM",
		className: ["alert", "success"],
		childRules: [
			{
				matches: window.modifyDiv.requireText("Succssfully", "text"),
				wrap: "div",
				transformHTML: content => "Successfully saved your changes."
			}
		]
	}
];

window.modifyDiv(document.querySelector(".header + div"), alertModifications);