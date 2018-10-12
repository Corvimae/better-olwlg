window.modifyDiv = (div, rules, processedNodes) => {
	const modifiedNodes = processedNodes || [];
	const childNodes = [].slice.apply(div.childNodes);

	childNodes.forEach((element, index) => {
		let node = element;

		if(modifiedNodes.indexOf(node) !== -1) return;

		rules.forEach(rule => {
			if(rule.matches(node)) {
				if(rule.wrap) {
					const nextSibling = node.nextSibling;
					const spanElement = document.createElement(rule.wrap === true ? "span" : rule.wrap);
					const parent = node.parentElement;

					if(window.modifyDiv.isTextNode(node)) {
						spanElement.textContent = node.textContent;
					} else {
						spanElement.appendChild(node);
					}

					if(rule.preWrapAttributes) {
						Object.keys(rule.preWrapAttributes).forEach(attributeName => {
							node.setAttribute(attributeName, rule.preWrapAttributes[attributeName]);
						});
					}

					if(nextSibling) {
						parent.insertBefore(spanElement, nextSibling);
					} else {
						parent.appendChild(spanElement);
					}

					if(window.modifyDiv.isTextNode(node)) {
						parent.removeChild(node);
					}

					modifiedNodes.push(spanElement.childNodes[0]);
					node = spanElement;
				}

				if(rule.combineRest) {
					const subContainer = document.createElement(rule.combineRest);
					const parent = node.parentElement;
					let count = 0;

					if(rule.combineUntil) {
						const localChildren = [].slice.apply(parent.childNodes);
						let item;

						for(item of localChildren.slice(localChildren.indexOf(node))) {
							if(count !== 0 && rule.combineUntil(item, count)) {
								break;
							} else {
								subContainer.appendChild(item);
							}

							count += 1;
						}

						if(item.parentElement === subContainer) {
							parent.appendChild(subContainer);
						} else {
							parent.insertBefore(subContainer, item);
						}
					} else {
						const remainingElements = childNodes.slice(index);

						remainingElements.forEach(item => subContainer.appendChild(item));

						parent.appendChild(subContainer);
					}

					node = subContainer;
				}

				if(rule.className) {
					if(Array.isArray(rule.className)) {
						node.classList.add.apply(node.classList, rule.className);
					} else {
						node.classList.add(rule.className);
					}
				}

				if(rule.attributes) {
					Object.keys(rule.attributes).forEach(attributeName => {
						node.setAttribute(attributeName, rule.attributes[attributeName]);
					});
				}

				if(rule.hide) {
					node.style.display = "none";
				}

				if(rule.transformHTML) {
					node.innerHTML = rule.transformHTML(node.innerHTML);
				}

				if(rule.transform) {
					rule.transform(node);
				}

				if(rule.remove) {
					node.parentElement.removeChild(node);
				}

				modifiedNodes.push(node);

				if(rule.combineRest) {
					window.modifyDiv(node, rule.childRules || [], modifiedNodes);
				} else if(!rule.wrap) {
					window.modifyDiv(node, rules, modifiedNodes);
				}
			}
		});
	});
};

window.modifyDiv.groupIconRule = {
	combineRest: "div",
	combineUntil: (element, count) => element.tagName === "BR" || count === 2,
	className: "icon-group",
	modifications: [
		{
			className: "icon-image"
		},
		{
			wrap: true,
			className: "icon-description",
			//transformHTML: content => content.
		}
	]
};

window.modifyDiv.removeLineBreakRule = {
	remove: true
};

function requireText(text, tag, matchingRule) {
	const tagTarget = tag && tag.toLowerCase();

	return node => {
		const tagName = node.tagName && node.tagName.toLowerCase();
		let tagMatches = true;

		if(tag) {
			tagMatches = tagTarget === "text" ? window.modifyDiv.isTextNode(node) : tagName === tagTarget;
		}

		return matchingRule(node, text) && tagMatches;
	};
}

window.modifyDiv.requireText = function(text, tag) {
	return requireText(text, tag, (node, value) => node.textContent.indexOf(value) !== -1);
};

window.modifyDiv.requireTextExactly = function(text, tag) {
	return requireText(text, tag, (node, value) => node.textContent.trim() === value);
};

window.modifyDiv.hasStyle = function(style, value) {
	return node => node.style && node.style[style].toLowerCase() === value;
};

window.modifyDiv.groupIcon = function(iconName) {
	return {
		matches: node => node.tagName === "IMG" && node.src.toLowerCase().indexOf(iconName.toLowerCase()) !== -1,
		combineRest: "div",
		combineUntil: (element, count) => element.tagName === "BR" || count === 2,
		className: "icon-group"
	};
};

window.modifyDiv.hasClass = function(className) {
	return node => node.classList && node.classList.contains(className);
};

window.modifyDiv.convertImageToButton = function(image, className, altText) {
	return {
		matches: node => node.tagName === "IMG" && node.src.indexOf(image) !== -1,
		wrap: "button",
		className: className ? ["image-button", className] : ["image-button"],
		transform: node => {
			const img = node.querySelector("img");

			node.appendChild(
				window.modifyDiv.createAccessibilityText(altText || img.getAttribute("title") || img.getAttribute("alt"))
			);

			node.setAttribute("onclick", img.getAttribute("onclick"));
			img.removeAttribute("onclick");
			img.removeAttribute("alt");
			img.removeAttribute("title");
			img.setAttribute("aria-hidden", true);
		}
	};
};

window.modifyDiv.isTextNode = function(node) {
	return node.nodeType === document.TEXT_NODE;
};

window.modifyDiv.createAccessibilityText = function(text) {
	const accessibilityText = document.createElement("div");

	accessibilityText.classList.add("accessibility-text");
	accessibilityText.textContent = text;

	return accessibilityText;
};

window.modifyDiv.buildCheckboxElement = function(node, inputId, transform) {
	const parentLabel = document.createElement("label");

	parentLabel.setAttribute("for", inputId);
	parentLabel.classList.add("checkbox-label-container");

	const fakeCheckbox = document.createElement("span");

	fakeCheckbox.classList.add("checkbox-interactable");

	const checkboxLabel = document.createElement("span");

	checkboxLabel.classList.add("checkbox-label");

	if(node.childNodes && node.childNodes.length) {
		let childNodes = [].slice.apply(node.childNodes);

		childNodes = childNodes.slice(childNodes.indexOf(childNodes.find(child => child.tagName === "INPUT")) + 1);

		childNodes.forEach(child => checkboxLabel.appendChild(child));

		if(transform) transform(childNodes, checkboxLabel);
	} else {
		checkboxLabel.innerHTML = transform ? transform(node.textContent) : node.textContent;
	}

	parentLabel.appendChild(fakeCheckbox);
	parentLabel.appendChild(checkboxLabel);

	return parentLabel;
};
