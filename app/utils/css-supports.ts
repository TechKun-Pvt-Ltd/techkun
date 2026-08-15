import cssSupportsQuery from "@/app/utils/css-supports-query";

const cssSupports = {
	d: typeof CSS !== 'undefined' && CSS.supports(cssSupportsQuery.d),
	shape: typeof CSS !== 'undefined' && CSS.supports(cssSupportsQuery.shape),
};

export default cssSupports;