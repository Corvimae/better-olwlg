const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
var ZipPlugin = require("zip-webpack-plugin");

const baseConfig = require("./webpack.config")[0];

const copy = (file) => ({
	from: file,
	to: file
});

Object.assign(baseConfig, {
	output: {
		path: path.resolve(__dirname, "./bundle"),
		publicPath: "/bundle",
		filename: "build/my-wants.js"
	},
	plugins: [
		...baseConfig.plugins,
		new CleanWebpackPlugin(["bundle", "./bundle.zip"]),
		new CopyWebpackPlugin([
			copy("css"),
			copy("fonts"),
			copy("icons"),
			copy("js"),
			copy("pages"),
			copy("manifest.json"),
			copy("icon.png")
		]),
		new ZipPlugin({
			path: "..",
			filename: "bundle.zip",
			pathPrefix: "bundle"
		})
	]
});

module.exports = [baseConfig];