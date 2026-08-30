export default {
	reactStrictMode: false,
	turbopack: {
		rules: {
			"*.css.mjs": {
				loaders: ["./loaders/gen-css-loader.mjs"],
				as: "*.css"
			},
		},
	},
};