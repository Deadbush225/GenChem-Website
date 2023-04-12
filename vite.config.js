import { defineConfig } from "vite";
import { splitVendorChunkPlugin } from "vite";

import { resolve } from "path";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "docs");

export default defineConfig({
	plugins: [splitVendorChunkPlugin()],

	base: "./",
	publicDir: false,
	mode: "Development",
	root,

	build: {
		target: "es2020",

		outDir,
		emptyOutDir: true,
		rollupOptions: {
			external: ["src/flickity"],

			input: {
				main: resolve(root, "script.ts"),
				// flickity: resolve(root, "flickity", "flickity.pkgd.min.js"),

				index: resolve(root, "index.html"),
				// indedx: resolve(root, "pages", "team.html"),
			},
		},

		modulePreload: {
			polyfill: false,
		},

		commonjsOptions: {
			include: [/src\/flickity/, /node_modules/],
			extensions: extensions,
			requireReturnsDefault: "auto",
		},
	},

	optimizeDeps: {
		include: ["src/flickity"],
	},

	resolve: {
		extensions: [".cjs", ".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
		// mainFields: ["module", "main", "jsnext:main", "browser"],
	},
});
