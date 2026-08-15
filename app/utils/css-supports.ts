import cssSupportsQuery from "@/app/utils/css-supports-query";

const cssIsDefined = typeof CSS !== 'undefined';
const cssSupports: { [key: string]: boolean } = {};

for (const key in cssSupportsQuery) {
	cssSupports[key] = cssIsDefined && CSS.supports(cssSupportsQuery[key as keyof typeof cssSupportsQuery]);
}

export default cssSupports as  { [K in keyof typeof cssSupportsQuery]: boolean };