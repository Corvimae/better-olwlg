const path = require("path");

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
	}
}];