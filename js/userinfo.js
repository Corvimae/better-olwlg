const parts = document.body.innerText.trim().split("\n").filter(item => item.length);

const userData = {
	accountAge: undefined,
	name: undefined,
	username: undefined,
	tradeRating: undefined,
	country: undefined,
	itemsInMathTrade: undefined,
	numberOfMathTrades: undefined,
	firstTrade: undefined,
	firstTradeDate: undefined
};

const links = {
	bggLink: undefined,
	tradeLink: undefined,
	itemsInTradeLink: undefined,
	previousTradesLink: undefined,
	firstTradeLink: undefined
};

let keyToUserDataMap = {
	"bgg registered": "accountAge",
	name: "name",
	bgg: "username",
	"trade rating": "tradeRating",
	country: "country",
	"number of items in this math trade": "itemsInMathTrade",
	"number of math trades": "numberOfMathTrades"
};

parts.forEach(part => {
	const [key, ...remainder] = part.split(":");
	const value = remainder.join(":");
	const userDataKey = keyToUserDataMap[key.toLowerCase()];

	if(userDataKey) {
		userData[userDataKey] = value.trim();
	} else if(key.toLowerCase() === "first math trade") {
		const date = document.querySelector("p > i").innerText;

		userData.firstTrade = value.replace(date, "").trim();
		userData.firstTradeDate = new Date(date);
	}
});

let urlContentToLinkMap = {
	"boardgamegeek.com/user": "bggLink",
	"boardgamegeek.com/trandmgr.php3": "tradeLink",
	"viewlist.cgi": "itemsInTradeLink",
	"mthistory.cgi": "previousTradesLink",
	"boardgamegeek.com/geeklist": "firstTradeLink"
};

document.querySelectorAll("a").forEach(item => {
	Object.keys(urlContentToLinkMap).forEach(linkPart => {
		if(item.href.indexOf(linkPart) !== -1) {
			links[urlContentToLinkMap[linkPart]] = item.href;
		}
	});
});

function pluralize(word, count, suffix) {
	return count === 1 ? word : word + ("s" || suffix);
}

const matches = window.location.search.match(/profile=([0-9]+)/);
const profile = matches && matches[1];

let output =
	`
<div class="user-page ${profile ? "fromProfile" : ""}">
	<div class="user-name-row">
		<div class="user-image" ${profile ? "style='background-image: url(https://cf.geekdo-static.com/avatars/avatar_id" + profile + ".png')'" : ""}></div>
		<div class="user-data">
			<div class="user-name">
				<span>${userData.name}</span>
				<div clas="user-link">
					(<a href="${links.bggLink}">${userData.username}</a>)
				</div>
			</div>
	
			<div class="account-age-row">BoardGameGeek user since ${userData.accountAge}</div>
		</div>
	</div>
	<div class="bgg-trade-statistics">
		<div class="statistic-block country">
			<div class="statistic-name">Country</div>
			<div class="statistic-value">${userData.country}</div>
		</div>
		<div class="statistic-block trade-rating">
			<div class="statistic-name">Trade Rating</div>
			<div class="statistic-value">
				<a href="${links.tradeLink}"> ${userData.tradeRating}</a>
			</div>
		</div>
	</div>
	<div class="math-trade-statistics">`;

if(userData.itemsInMathTrade) {
	output += `<div class="math-trade-statistic items-in-trade">
		<a href="${links.itemsInTradeLink}">
			${userData.itemsInMathTrade} ${pluralize("item", userData.itemsInMathTrade)}
		</a>
		<span> in this math trade.</span>
	</div>`;
}

if(userData.numberOfMathTrades) {
	output += `<div class="math-trade-statistic previous-trades">
		<span>Participated in </span>
		<a href="${links.previousTradesLink}">
			${userData.numberOfMathTrades} previous math ${pluralize("trade", userData.numberOfMathTrades)}.
		</a>
	</div>`;
}

if(userData.firstTradeDate) {
	output += `<div class="math-trade-statistic first-trade">
		<span>First trade: </span>
		<a href="${links.firstTradeLink}">${userData.firstTrade}</a>
		<span> (${userData.firstTradeDate.toLocaleDateString()})</span>
	</div>`;
}

output += "</div>";

document.body.innerHTML = output;