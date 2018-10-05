const path = require("path");
const ChromeExtensionReloader = require("webpack-chrome-extension-reloader");

module.exports = [{
	output: {
		path: path.resolve(__dirname, "./build"),
		publicPath: "/build/",
		filename: "my-wants.js"
	},
	name: "mywants",
	entry: "./js/my-wants/my-wants.js",
	mode: "production",
	target: "web",
	resolve: {
		symlinks: false
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: {
					esModule: true
				}
			}
		]
	},
	plugins: []
}];

if(process.env.NODE_ENV === "development") {
	module.exports[0].plugins.push(new ChromeExtensionReloader());
}