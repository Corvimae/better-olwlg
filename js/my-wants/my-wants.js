import mountTable from "./mount-table";
import modifyContent from "./modify-content";
import legacyFormat from "./my-wants-legacy";
import { getSettingsValue } from "../utils/settings";
import loadCSS from "../utils/loadCSS";

getSettingsValue("vue_wants_editor").then(enabled => {
	if(enabled) {
		loadCSS("mywants");
		modifyContent();
		mountTable();
	} else {
		loadCSS("mywants-legacy");
		legacyFormat();
	}
});