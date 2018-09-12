const baseHideGameDesc = window.hidegamedesc;

const showUserInfoMatcher = /showuserinfo\("([\S]*?)"\)/;

window.showuserinfo = function(username) {
	const frameBox = document.querySelector("#user-card");
	const frame = document.querySelector("#user-card-frame");

	if(!frameBox) throw new Error("Can't find element for user card!");
	if(!frame) throw new Error("Can't find iframe for user card!");
    
	//frame.src = "about:blank";

	frameBox.classList.add("visible");

	frame.src = `userinfo.cgi?listid=${window.geeklist}&user=${username}`;

	const [sourceElement] = [].slice.apply(document.querySelectorAll(".profile-info")).filter(anchor => {
		if(anchor.tagName === "IMG") {
			const onclickMatches = anchor.onclick.toString().match(showUserInfoMatcher);

			return onclickMatches.length > 1 && onclickMatches[1] === username;
		} else {
			return false;
		}
	});
	
	const sourceLocation = sourceElement.getBoundingClientRect();

	frameBox.style.left = sourceLocation.x + window.pageXOffset - 244 + "px";
	frameBox.style.top = sourceLocation.y + window.pageYOffset + 20 + "px";
};