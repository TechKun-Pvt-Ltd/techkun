export default {
	reactStrictMode: false
	reactStrictMode: false,
	turbopack: {
		rules: {
			"*.gen-css.mjs": {
				loaders: ["./loaders/gen-css-loader.mjs"],
				as: "*.css"
			},
		},
	},
};