import "./rotation.css";

export const rotationCssApi = {
	rotating: "rotating",
	rotatingClamped: "rotating-clamped"
};
export const rotationCssVars = {
	angle: "--angle",
	centerX: "--center-x",
	centerY: "--center-y",
	thresholdStart: "--rotation-threshold-start",
	thresholdEnd: "--rotation-threshold-end"
} satisfies Record<string, string>;
