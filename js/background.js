/*chrome.webRequest.onBeforeRequest.addListener(
	info => {
		return {
			redirectUrl: chrome.extension.getURL("icons/profile.png")
		};
	},
	{
		urls: ["*://cf.geekdo-static.com/avatars/*"],
		types: ["image"]
	},
	["blocking"]
);*/

const iconMap = {
	"e.gif": "chevron-right",
	"arrow.gif": "view-in-geeklist",
	"hello.gif": "add-to-list",
	"1click.png": "add-to-box",
	"ds.gif": "price-history-graph",
	"ds2.gif": "price-history-table",
	"photo.gif": "photo",
	"ok.gif": "checkmark",
	"h.jpg": "history",
	"redsquarex.gif": "close",
	"step4.gif": "edit",
	"stats.gif": "chart",
	"users.gif": "mt-members",
	"3.jpg": "list",
	"magglass.jpg": "wishlist",
	"gc.png": "giftcard",
	"pp.png": "paypal",
	"gg.gif": "geekgold",
	"cart.png": "added-thus-far",
	"myown.gif": "my-listing",
	"plusbox.png": "add-item",
	"geeklist.gif": "view-in-geeklist",
	"forum.gif": "forum",
	"profile.gif": "profile",
	"collect.png": "my-collection",
	"syncoll.gif": "sync",
	"help.png": "help",
	"tipjar.png": "tipjar",
	"auction.png": "auction",
	"changed.png": "changed-item",
	"wantedmine.gif": "who-wanted-mine",
	"mostwanted.jpg": "most-wanted"
};

chrome.webRequest.onBeforeRequest.addListener(
	info => {
		const parts = info.url.split("/");
		const icon = parts[parts.length - 1];

		if(iconMap[icon]) {
			return {
				redirectUrl: chrome.extension.getURL(`icons/${iconMap[icon]}.png`)
			};
		}
	},
	{
		urls: ["*://bgg.activityclub.org/*"],
		types: ["image", "object"]
	},
	["blocking"]
);

