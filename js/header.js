window.OLWLG = {};

const headerContainer = document.body.children[0];

headerContainer.classList.add("header");

const headerContent = headerContainer.children[0];

headerContent.classList.add("header-content");

let reachedUserOptions = false;

const userOptionDropdown = document.createElement("button");

userOptionDropdown.href = "#";
userOptionDropdown.classList.add("user-dropdown-toggle");

userOptionDropdown.addEventListener("mouseover", evt => {
	evt.currentTarget.classList.toggle("active");
});

const userOptionDropdownContents = document.createElement("div");

userOptionDropdownContents.classList.add("user-dropdown");

const userOptionLabels = {
	profile: "My Profile",
	h: "My Trade History",
	collect: "My Collection",
	syncoll: "Resync Collection",
	help: "OLWLG Wiki",
	tipjar: "Tip Jar!",
	auction: "Auctions Home",
	favicon: "Groupon Affiliate"
};


[].slice.apply(headerContent.childNodes).forEach(node => {
	let child = node;

	if(!child.tagName) {
		headerContent.removeChild(child);
	} else if(reachedUserOptions) {
		// For some reason, resync collection is in a span.
		if(child.tagName === "SPAN") {
			child = child.children[0];
		}

		child.classList.add("user-dropdown-option");

		const optionLabel = document.createElement("span");

		const parts = child.querySelector("img").src.split("/");
		const file = parts[parts.length - 1].split(".")[0];

		optionLabel.innerText = userOptionLabels[file];

		child.appendChild(optionLabel);
		userOptionDropdownContents.appendChild(child);

	} else if(child.tagName === "I") {
		const [welcome, username] = child.textContent.split(":");

		window.OLWLG.username = username.trim();

		userOptionDropdown.innerHTML = `Hello, ${username.trim()}! <div class="user-dropdown-chevron"></div>`;
		reachedUserOptions = true;

		headerContent.removeChild(child);
	}
});

headerContent.appendChild(userOptionDropdown);
userOptionDropdown.appendChild(userOptionDropdownContents);

/*document.addEventListener("click", evt => {
	let target = evt.target;

	while(target !== null && target.classList) {
		if(target.classList.contains("user-dropdown-toggle")) {
			evt.stopPropagation();
			
			return;
		}
		target = target.parentNode;
	}

	document.querySelector(".user-dropdown-toggle").classList.remove("active");
});*/

document.querySelector(".user-dropdown-toggle").addEventListener("mouseout", evt => {
	document.querySelector(".user-dropdown-toggle").classList.remove("active");
});

const footer = document.createElement("div");

footer.innerHTML = `
Improvements from <a href="https://boardgamegeek.com/acceptableice">acceptableice</a>'s <a href="https://github.com/acceptableice/better-olwlg">Better OLWGL</a>.
<a href="https://icons8.com">Icon pack by Icons8</a>.
`;

document.body.appendChild(footer);