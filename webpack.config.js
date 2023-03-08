const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const fs = require("fs");

// let MYhtmlFiles = [];

let MYhtmlFiles = fs
	.readdirSync(path.resolve(__dirname, "src/pages"))
	.filter((file) => {
		console.log(file);
		return file.endsWith(".html");
	})
	.map((file) => {
		console.log(file);
		hwp = new HtmlWebpackPlugin({
			filename: "pages/" + file,
			template: "src/pages/" + file,
		});
		return hwp;
		// console.log(hwp);
		// MYhtmlFiles.push(hwp);
		// console.log(MYhtmlFiles);
	});
// console.log(htmlFiles);

console.log("+++");
console.log(MYhtmlFiles);

module.exports = {
	mode: "development",
	entry: {
		bundle: path.resolve(__dirname, "src/script.js"), // this is where the [name] is
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js",
		// filename: "[name][contenthash].js",
		// clean: true,
		assetModuleFilename: "assets/[name].[ext]",
	},
	// devtool: "source-map",
	devServer: {
		static: {
			directory: path.resolve(__dirname, "dist"),
		},
		// contentBase: "./dist",
		port: 3000,
		open: true,
		hot: true,
		compress: true,
		historyApiFallback: true,
	},
	// resolve: {
	// 	extensions: [".css", ".js"],
	// },
	module: {
		// loaders
		rules: [
			// {
			// 	test: /\.css$/,
			// 	use: [
			// 		{
			// 			loader: "css-loader",
			// 			// options: {
			// 			// 	outputPath: "styles/",
			// 			// },
			// 		},
			// 	],
			// },
			{
				test: /\.css$/,
				// use: ["style-loader", "css-loader"],
				use: [MiniCssExtractPlugin.loader, "css-loader"],
				// exclude: /node_modules/,
			},
			// {
			// 	test: /\.js$/,
			// 	exclude: /node_modules/,
			// 	use: {
			// 		loader: 'babel-loader',
			// 		options: {
			// 			presets: ['@babel/preset-env'],
			// 			},
			// 		},
			// 	},
			{
				test: /\.html$/,
				use: ["html-loader"],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
				// use: [
				// 	{
				// 		// type: "asset/resource",
				// 		loader: "file-loader",
				// 		options: {
				// 			name: "[name].[ext]",
				// 			outputPath: "assets/",
				// 			// publicPath: 'img/', // to reflect what will be the new path when including in the html
				// 		},
				// 	},
				// ],
			},
		],
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: "Webpack App",
			filename: "index.html",
			template: "src/index.html",
		}),
		// new HtmlWebpackPlugin({
		// 	filename: "pages/periodictable.html",
		// 	template: "src/pages/periodictable.html",
		// }),
		...MYhtmlFiles,
		new MiniCssExtractPlugin({
			// insert: "head",
		}),
		//new BundleAnalyzerPlugin(),
		new CleanWebpackPlugin(),
	],
};
