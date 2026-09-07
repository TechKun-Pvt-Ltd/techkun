import supportsQuery from "@/app/utils/css/supports-query";

const cssIsDefined = typeof CSS !== 'undefined';
const cssSupports: { [key: string]: boolean } = {};

for (const key in supportsQuery) {
	cssSupports[key] = cssIsDefined && CSS.supports(supportsQuery[key as keyof typeof supportsQuery]);
}

export default cssSupports as  { [K in keyof typeof supportsQuery]: boolean };