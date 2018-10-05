export const SettingsItems = [
	{
		key: "vue_wants_editor",
		name: "Enable Improved Wants Editor",
		type: "boolean",
		default: true,
		description: "Enable an upgraded version of the wants editor built with modern web frameworks.",
		pros: [
			"Click-and-drag mass editing.",
			"Completely redesigned.",
			"Better support for users with disabilities."
		],
		cons: [
			"Beta feature that may have minor issues.",
			"Higher CPU and RAM usage."
		]
	}
];

export function getDefaultValue(key) {
	for(let item of SettingsItems) {
		if(item.key === key) return item.default;
	}

	return undefined;
}

export function getSettingsValue(key) {
	return new Promise((resolve, reject) => {
		const request = {};

		request[key] = getDefaultValue(key);

		chrome.storage.sync.get(request, results => {
			resolve(results[key]);
		});
	});
}