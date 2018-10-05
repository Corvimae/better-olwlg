export default function loadCSS(filename) {
	const linkTag = document.createElement("link");

	linkTag.setAttribute("rel", "stylesheet");
	linkTag.setAttribute("type", "text/css");
	linkTag.setAttribute("href", chrome.extension.getURL(`css/${filename}.css`));

	document.head.appendChild(linkTag);
}