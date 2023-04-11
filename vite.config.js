import { defineConfig } from "vite";
import { splitVendorChunkPlugin } from "vite";

import { resolve } from "path";

import fs from "fs";
// import react from '@vitejs/plugin-react'
// import sass from 'sass'

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "docs");

const htmlFiles = fs
	.readdirSync(resolve(root, "pages"))
	.filter((file) => {
		console.log(file);
		return file.endsWith(".html");
	})
	.map((file, index) => {
		return ["html_page" + index, resolve(root, "pages", file)];
	});

export default defineConfig({
	// plugins: [htmlTemplate()],
	plugins: [splitVendorChunkPlugin()],

	base: "./",
	publicDir: false,
	root: root,

	mode: "Development",

	// css: {
	// 	preprocessorOptions: {
	// 		scss: {
	// 		},
	// 	},
	// },

	// publicDir: "./src/",

	build: {
		outDir,
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: resolve(root, "script.ts"),
				flickity: resolve(root, "flickity", "flickity.pkgd.min.js"),

				index: resolve(root, "index.html"),

				...Object.fromEntries(htmlFiles),
			},

			output: {
				assetFileNames: (assetInfo) => {
					let extType = assetInfo.name.split(".").pop();

					console.log(extType);

					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
						// extType = "assets";
						return "assets/[name]-[hash][extname]";
					} else if (/css|ts/i.test(extType)) {
						return "styles/[name]-[hash][extname]";
					} else if (/html/i.test(extType)) {
						return "pages/[name]-[hash][extname]";
					}

					// return "styles";

					return "assets/[name]-[hash][extname]";
					// "css" is only one so no need to catch any possible outcome
				},

				chunkFileNames: "scripts/[name]-[hash].js",

				entryFileNames: "scripts/[name]-[hash].js",

				// dir: "docs/",
				generatedCode: "es2015",
			},
		},
		modulePreload: {
			polyfill: false,
		},
		// sourcemap: "hidden",
	},

	server: {
		port: 8888,
		strictPort: true,
		open: true,
	},

	//   optimizeDeps: {
	// entries: ["src/*.html", "src/script.ts"],
	// include: ["src/script.ts"],
	// force: true
	//   },

	// resolve: {
	// conditions: ["\"import\": \"./src/script.ts\""]
	// }
});
