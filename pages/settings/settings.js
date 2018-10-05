import { SettingsItems } from "../../js/utils/settings.js";

function createElementWithAttributes(type, attributes) {
	const element = document.createElement(type);

	Object.keys(attributes).forEach(attribute => {
		const value = attributes[attribute];

		if(attribute === "className") {
			if(Array.isArray(value)) {
				value.forEach(className => element.classList.add(className));
			} else {
				element.classList.add(value);
			}
		} else if(attribute === "textContent") {
			element.textContent = value;
		} else {
			element.setAttribute(attribute, value);
		}
	});

	return element;
}

function createContainer(field) {
	return createElementWithAttributes("div", {
		className: "field"
	});
}

function createLabel(field) {
	return createElementWithAttributes("label", {
		for: field.key,
		textContent: field.name
	});
}

function createFormElement(field) {
	const TYPES = {
		boolean: {
			element: "input",
			type: "checkbox"
		},
		number: {
			element: "input",
			type: "number"
		},
		string: {
			element: "input",
			type: "text"
		},
		enum: {
			element: "select",
			options: true,
			optionElement: "option"
		}
	};

	const fieldType = TYPES[field.type];

	if(!fieldType) throw new Error(`Field ${field.key} has the invalid type ${field.type}.`);

	const formElement = createElementWithAttributes(fieldType.element, {
		id: field.key,
		name: field.key
	});

	if(fieldType.type) formElement.setAttribute("type", fieldType.type);

	if(fieldType.options) {
		field.options.forEach(option => {
			const optionElement = document.createElement(fieldType.optionElement);

			optionElement.value = option.value;
			optionElement.textContent = option.label;

			formElement.appendChild(optionElement);
		});
	}

	return formElement;
}

function buildCheckbox(field) {
	const checkboxContainer = createElementWithAttributes("div", {
		className: "checkbox-container"
	});

	const parentLabel = document.createElement("label");

	parentLabel.setAttribute("for", field.key);
	parentLabel.classList.add("checkbox-label-container");

	const fakeCheckbox = document.createElement("span");

	fakeCheckbox.classList.add("checkbox-interactable");

	const checkboxLabel = document.createElement("span");

	checkboxLabel.classList.add("checkbox-label");
	checkboxLabel.textContent = field.name;

	parentLabel.appendChild(fakeCheckbox);
	parentLabel.appendChild(checkboxLabel);

	checkboxContainer.appendChild(createFormElement(field));
	checkboxContainer.appendChild(parentLabel);

	return checkboxContainer;
}

// Arguments as in "for or against", not program method inputs.
function createArgumentsList(argumentList, additionalClasses) {
	let classList = ["argument-list"];

	if(additionalClasses) {
		if(Array.isArray(additionalClasses)) {
			classList = classList.concat(additionalClasses);
		} else {
			classList.push(additionalClasses);
		}
	}

	const argumentContainer = createElementWithAttributes("div", {
		className: classList
	});

	argumentList.forEach(arg => {
		argumentContainer.appendChild(
			createElementWithAttributes("div", {
				className: "argument",
				textContent: arg
			})
		);
	});

	return argumentContainer;
}

function createDescription(field) {
	const descriptionContainer = createElementWithAttributes("div", {
		className: "description-container"
	});

	if(field.description) {
		descriptionContainer.appendChild(
			createElementWithAttributes("div", {
				className: "description",
				textContent: field.description
			})
		);
	}

	if(field.pros || field.cons) {
		const prosAndConsContainer = createElementWithAttributes("div", {
			className: "pros-and-cons"
		});

		prosAndConsContainer.appendChild(
			createElementWithAttributes("div", {
				className: "pros-and-cons-toggle"
			})
		);

		const prosAndConsTooltip = createElementWithAttributes("div", {
			className: ["tooltip", "bottom", "pros-and-cons-tooltip"]
		});

		if(field.pros) {
			prosAndConsTooltip.appendChild(createArgumentsList(field.pros, "pros"));
		}

		if(field.cons) {
			prosAndConsTooltip.appendChild(createArgumentsList(field.cons, "cons"));
		}

		prosAndConsContainer.appendChild(prosAndConsTooltip);

		descriptionContainer.appendChild(prosAndConsContainer);
	}

	return descriptionContainer;
}

function generateFieldDOMContent(field) {
	const container = createContainer(field);

	if(field.type === "boolean") {
		container.appendChild(buildCheckbox(field));
	} else {
		container.appendChild(createLabel(field));
		container.appendChild(createFormElement(field));
	}

	container.appendChild(createDescription(field));

	return container;
}

function toggleSavedAlert(status) {
	document.querySelector(".saved-alert").style.display = status ? "block" : "none";
}

const container = document.querySelector(".settings");

SettingsItems.forEach(field => container.appendChild(generateFieldDOMContent(field)));

toggleSavedAlert(false);

document.querySelector(".save-button").addEventListener("click", evt => {
	const settings = {};

	toggleSavedAlert(false);

	SettingsItems.forEach(field => {
		const fieldInput = document.getElementById(field.key);

		if(fieldInput.type === "checkbox") {
			settings[field.key] = fieldInput.checked;
		} else {
			settings[field.key] = fieldInput.value;
		}
	});

	chrome.storage.sync.set(settings, () => {
		toggleSavedAlert(true);
	});
});

// Restore saved settings.
const settingDefaults = {};

SettingsItems.forEach(field => {
	settingDefaults[field.key] = field.default;
});

chrome.storage.sync.get(settingDefaults, items => {
	Object.keys(items).forEach(item => {
		const element = document.getElementById(item);

		if(element.tagName === "INPUT" && element.type && element.type.toLowerCase() === "checkbox") {
			element.checked = items[item];
		} else {
			element.value = items[item];
		}
	});
});
