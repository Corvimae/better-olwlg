window.OLWLG = {};

const headerContent = document.querySelector("#navbar");

if(headerContent) {
	headerContent.classList.add("header", "header-content");

	let reachedUserOptions = false;

	const userOptionContainer = document.createElement("div");

	userOptionContainer.classList.add("user-dropdown-container");

	const userOptionDropdown = document.createElement("button");

	userOptionDropdown.href = "#";
	userOptionDropdown.classList.add("user-dropdown-toggle");

	let mouseOutDebounce = null;

	let isClickedOpen = false;

	const setDropdownVisibility = (target, state) => {
		if(state) {
			target.classList.add("active");
			target.setAttribute("aria-expanded", true);
			target.querySelector(".accessibility-text").textContent = "Press to hide account options.";
		} else {
			target.classList.remove("active");
			target.setAttribute("aria-expanded", false);
			target.querySelector(".accessibility-text").textContent = "Press to expand account options.";
		}
	};

	userOptionDropdown.addEventListener("mouseover", evt => {
		if(mouseOutDebounce) {
			clearTimeout(mouseOutDebounce);
		}

		if(!isClickedOpen) {
			setDropdownVisibility(evt.currentTarget, true);
		}
	});

	userOptionDropdown.addEventListener("click", evt => {
		setDropdownVisibility(evt.currentTarget, !isClickedOpen);
		isClickedOpen = !isClickedOpen;
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

			// Hide the icon for a11y users.
			const icon = child.querySelector("img");

			if(icon) {
				icon.setAttribute("aria-hidden", true);
				icon.setAttribute("role", "presentation");
			}

			child.appendChild(optionLabel);
			userOptionDropdownContents.appendChild(child);
		} else if(child.tagName === "I") {
			const [welcome, username] = child.textContent.split(":");

			window.OLWLG.username = username.trim();

			userOptionDropdown.innerHTML = `Hello, ${username.trim()}! <div class="user-dropdown-chevron" aria-hidden="true"></div>`;
			reachedUserOptions = true;

			headerContent.removeChild(child);
		}
	});

	const addSettingsDropdownItem = (image, text, link, accessibilityText) => {
		const extensionSettingsLink = document.createElement("a");

		extensionSettingsLink.classList.add("user-dropdown-option");
		extensionSettingsLink.setAttribute("title", accessibilityText || text);
		extensionSettingsLink.setAttribute("target", "_blank");
		if(typeof link === "function") {
			extensionSettingsLink.onclick = link;
		} else {
			extensionSettingsLink.setAttribute("href", link);
		}

		const extensionSettingsImage = document.createElement("img");

		extensionSettingsImage.setAttribute("src", chrome.extension.getURL(`icons/${image}.png`));
		extensionSettingsImage.setAttribute("height", 24);
		extensionSettingsImage.setAttribute("aria-hidden", true);
		extensionSettingsImage.setAttribute("role", "presentation");

		const extensionSettingsText = document.createElement("span");

		extensionSettingsText.textContent = text;

		extensionSettingsLink.appendChild(extensionSettingsImage);
		extensionSettingsLink.appendChild(extensionSettingsText);

		userOptionDropdownContents.appendChild(extensionSettingsLink);
	};

	addSettingsDropdownItem("logo", "Better OLWLG Settings", chrome.extension.getURL("pages/settings/index.html"));

	// Add accessibility text explaining the purpose of the dropdown.
	const dropdownAccessibilityText = document.createElement("span");

	dropdownAccessibilityText.classList.add("accessibility-text");

	dropdownAccessibilityText.textContent = "Press to expand account options.";

	userOptionDropdown.appendChild(dropdownAccessibilityText);

	// Append the dropdown elements to the header.
	headerContent.appendChild(userOptionContainer);

	userOptionContainer.appendChild(userOptionDropdown);
	userOptionContainer.appendChild(userOptionDropdownContents);

	document.querySelector(".user-dropdown").addEventListener("mouseover", evt => {
		if(mouseOutDebounce) {
			clearTimeout(mouseOutDebounce);
		}
	});

	const onMouseOut = evt => {
		mouseOutDebounce = setTimeout(() => {
			if(!isClickedOpen) {
				setDropdownVisibility(document.querySelector(".user-dropdown-toggle"), false);
			}

			mouseOutDebounce = null;
		}, 50);
	};

	document.querySelector(".user-dropdown").addEventListener("mouseout", onMouseOut);
	document.querySelector(".user-dropdown-toggle").addEventListener("mouseout", onMouseOut);

	const footer = document.createElement("div");

	footer.innerHTML = `
Improvements from <a href="https://boardgamegeek.com/user/corvimae">Corvimae</a>'s <a href="https://github.com/Corvimae/better-olwlg">Better OLWLG</a>.
<a href="https://icons8.com">Icon pack by Icons8</a>.
`;

	document.body.appendChild(footer);
}