import { defineConfig } from "vite";
import { resolve } from "path";
// import htmlTemplate from 'vite-plugin-html-template'
// import react from '@vitejs/plugin-react'
// import sass from 'sass'

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "docs");

export default defineConfig({
	// plugins: [
	// htmlTemplate()],
	base: "./",
	publicDir: false,
	root: root,

	css: {
		preprocessorOptions: {
			scss: {
				// implementation: sass,
				// additionalData: `
				//     @import "./src/styles/styles.scss";
				//     @import "./src/styles/_colorPallete.scss";
				//     @import "./src/styles/_atomicDetails.scss";
				//     @import "./src/styles/_atomicModel.scss";
				//     @import "./src/styles/_generals.scss";
				//     @import "./src/styles/_home.scss";
				//     @import "./src/styles/_periodicTable.scss";
				//     @import "./src/styles/_responsive.scss";
				//     @import "./src/styles/_utils.scss";
				// `
			},
		},
	},

	// publicDir: "./src/",

	build: {
		outDir,
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: resolve(root, "script.ts"),
				index: resolve(root, "index.html"),
				periodicTable: resolve(root, "pages", "periodictable.html"),
			},

			output: {
				assetFileNames: (assetInfo) => {
					let extType = assetInfo.name.split(".").pop();

					console.log(extType);

					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
						// extType = "assets";
						return "assets/[name]-[hash][extname]";
					}
					if (/css|ts/i.test(extType)) {
						return "styles/[name]-[hash][extname]";
					}

					// return "assets/[name]-[hash][extname]";
					// "css" is only one so no need to catch any possible outcome
				},

				chunkFileNames: "scripts/[name]-[hash].js",

				entryFileNames: "scripts/[name]-[hash].js",

				// dir: "docs/",
			},
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
