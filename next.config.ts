export default {
	reactStrictMode: false,
	turbopack: {
		rules: {
			"*.css.mjs": {
				loaders: ["./loaders/gen-css-loader.mjs"],
				as: "*.css"
			},
			"*.static.mjs": {
				loaders: ["./loaders/static-js-loader.mjs"],
				as: "*.js"
			},
		},
	},
};