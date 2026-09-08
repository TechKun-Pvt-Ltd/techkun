export default {
	reactStrictMode: false,
	compiler: {
		// autoLabel defaults to 'dev-only', but that check doesn't currently fire under
		// `next dev` with Turbopack (verified: default produces zero labels in dev here) —
		// 'always' is what actually works, at the cost of carrying labels into prod too.
		emotion: {autoLabel: "always"},
	},
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