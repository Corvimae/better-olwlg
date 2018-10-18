import Vue from "vue";
import WantsEditor from "better-olwlg-wants-editor";

const table = document.querySelector("#wants");

function getHiddenValue(name) {
	const element = document.querySelector(`input[name="${name}"]`);

	return element && element.value;
}

export default function mountTable() {
	const tableData = {
		listId: getHiddenValue("listid"),
		editable: getHiddenValue("modify") === "1",
		wants: [],
		listings: []
	};

	const matchId = (element, prefix, dummyClass) => {
		const idAttribute = element.getAttribute("id");

		if(!idAttribute) return undefined;

		const matchData = idAttribute.match(new RegExp(`${prefix}([0-9]+)`));

		if(matchData && matchData[1]) {
			return matchData[1];
		} else if(!dummyClass || element.classList.contains(dummyClass)) {
			const dummyMatchData = idAttribute.match(new RegExp(`${prefix}([a-zA-Z0-9]+)`));

			return dummyMatchData && dummyMatchData[1];
		}

		return undefined;
	};

	const getBGGIdFromLink = link => {
		if(link) {
			const matches = link.match(/boardgamegeek\.com\/[\S]*?\/([0-9]+)/);

			return matches && matches[1];
		} else {
			return undefined;
		}
	};

	[].slice.apply(table.querySelectorAll("thead tr th")).slice(2).forEach((header, index) => {
		const id = matchId(header, "gm", "isdummy");

		if(!id) return;

		// This might be a problem.
		const isDummy = !id.match(/^([0-9]+)$/);

		if(id) {
			const listing = {
				id,
				name: header.getAttribute("title"),
				wants: [],
				isDummy: isDummy
			};

			if(isDummy) listing.children = [];

			tableData.listings.push(listing);
		} else {
			throw new Error(`No ID found in column ${index}! Is something misformatted?`);
		}
	});

	const rows = [].slice.apply(table.querySelectorAll("tbody tr"));

	rows.forEach((row, index) => {
		const id = matchId(row, "gn");

		if(id) {
			const nameCell = row.querySelector("td:nth-of-type(2)");
			const nameLink = nameCell.querySelector("a[href*='boardgamegeek.com/thing/'], a[target='_blank']");
			const name = nameLink.textContent;
			const bgg_id = getBGGIdFromLink(nameLink.getAttribute("href"));
			const owner = nameCell.querySelector(".owner").textContent;
			const valueCell = nameCell.querySelector("input[name*='value']");
			const value = valueCell ? Number(valueCell.value) : 0;

			let want;
			let dummy;

			if(id.match(/^([0-9]+)$/)) {
				want = {
					id,
					name,
					bgg_id,
					owner,
					value,
					order: index,
					sweeteners: [] // TODO: enumerate sweeteners
				};

				row.querySelectorAll("font").forEach(sweetener => {
					const bggLink = sweetener.querySelector("a");

					want.sweeteners.push({
						name: bggLink.textContent,
						bgg_id: getBGGIdFromLink(bggLink.getAttribute("href"))
					});
				});

				tableData.wants.push(want);
			} else {
				dummy = tableData.listings.filter(listing => listing.id === id)[0];

				dummy.order = index;
				dummy.value = value;

				if(!dummy) {
					throw new Error(`Row has a dummy ID but does not match any dummy listings! (ID: ${id})`);
				}
			}

			[].slice.apply(row.querySelectorAll("td")).slice(2).forEach((cell, cellIndex) => {
				if(cell.querySelector("input")) {
					const listing = tableData.listings[cellIndex];

					if(listing) {
						if(want) {
							listing.wants.push(want.id);
						} else {
							// This row is a dummy, which is stored with the listings. We want to make the
							// column's listing a child of this dummy.
							dummy.children.push(listing.id);
						}
					} else {
						throw new Error(`There is no matching listing for column ${cellIndex}.`);
					}
				}
			});
		} else if(index !== rows.length - 1) {
			// The last row may be a copy of the header if there are a lot of wants; don't throw
			// an error if that's the case.
			throw new Error(`No ID found in column ${index}! Is something misformatted?`);
		}
	});

	document.querySelector("#table").innerHTML = `<div id="wants-editor"></div>`;

	console.log("- -Scraped table data - -");
	console.log(`List ID: ${tableData.listId} | Editable: ${tableData.editable}`);
	console.log(`Found ${tableData.listings.length} listing(s) and ${tableData.wants.length} want(s).`);
	console.table(tableData.listings);
	console.table(tableData.wants);

	console.log(JSON.stringify(tableData));

	window.WantsEditor = new Vue({
		el: "#wants-editor",
		render: h => h(WantsEditor, { props: { data: tableData } })
	});
}