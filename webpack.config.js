const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// const devType = "production";
// const devMode = devType == "development";
const devMode = process.env.NODE_ENV !== "production";
console.log(process.env.NODE_ENV);

const fs = require("fs");

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
	});

// console.log("+++");
// console.log(MYhtmlFiles);

module.exports = {
	mode: "development",
	// node: { fs: "empty" },
	// mode: "production",
	entry: {
		main: path.resolve(__dirname, "src/script.ts"),
		// css: path.resolve(__dirname, "src/styles/styles.css"),
		// main: {
		// import
		// import: path.resolve(__dirname, "src/script.ts"),
		// dependOn: "vendor",
		// }, // this is where the [name] is
		// style: path.resolve(__dirname, "src/styles/styles.scss"),
		// vendor: path.resolve(__dirname, "src/vendor.js"),
	},
	output: {
		// publicPath: path.resolve(__dirname, "docs"), // use static directory instead
		// path: "./docs",
		path: path.resolve(__dirname, "docs"),
		filename: "[name].js",
		// filename: "[name][contenthash].js",
		clean: true,
		assetModuleFilename: "assets/[name].[ext]",
	},
	devtool: devMode ? "source-map" : "", // webpack bundles js to minified, and sourcemap will make it posible to debug it in the browser
	devServer: {
		static: {
			directory: path.resolve(__dirname, "docs"),
		},
		// contentBase: ["./docs"],
		port: 3000,
		open: true,
		hot: true,
		// liveReload: true,
		// compress: true,
		// historyApiFallback: true,
	},
	// RANDOM TRY
	optimization: {
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				vendor: {
					name: "vendor",
					//				chunks: "initial",
					//				minChunks: 2
				},
			},
		},
	},
	resolve: {
		// so webpack knows what to resolve when importing
		extensions: [".css", ".js", ".html", ".ts"],
	},
	module: {
		// loaders
		rules: [
			{
				test: /\.scss$/,
				use: [
					// MiniCssExtractPlugin.loader,
					devMode ? "style-loader" : MiniCssExtractPlugin.loader,
					// {
					"css-loader",
					// options: {
					// outputPath: "styles/",
					// },
					// },
					"sass-loader",
				],
			},
			{
				test: /\.css$/,
				// use: ["style-loader", "css-loader"],
				use: [
					devMode ? "style-loader" : MiniCssExtractPlugin.loader,
					"css-loader",
				],
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
				test: /\.ts$/,
				use: ["ts-loader"],
				include: path.resolve(__dirname, "src"),
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
			inject: "body",
		}),
		// new HtmlWebpackPlugin({
		// 	filename: "pages/periodictable.html",
		// 	template: "src/pages/periodictable.html",
		// }),
		...MYhtmlFiles,
		new MiniCssExtractPlugin(),
		//new BundleAnalyzerPlugin(),
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: true,
		}),
	],
};
