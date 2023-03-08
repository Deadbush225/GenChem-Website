const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

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
		assetModuleFilename: "[name].[ext]",
	},
	// devtool: "source-map",
	devServer: {
		static: {
			directory: path.resolve(__dirname, "dist"),
		},
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
				use: ["style-loader", "css-loader"],
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
			// {
			// 	test: /\.(png|svg|jpg|jpeg|gif)$/i,
			// 	use: [
			// 		{
			// 			// type: "asset/resource",
			// 			loader: "file-loader",
			// 			options: {
			// 				name: "[name].[ext]",
			// 				outputPath: "assets/",
			// 				// publicPath: 'img/', // to reflect what will be the new path when including in the html
			// 			},
			// 		},
			// 	],
			// },
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

		// new MiniCssExtractPlugin({
		// 	insert: "head",
		// }),
		//new BundleAnalyzerPlugin(),
	],
};
