import styles from "./Rotation.module.css";

export const rotationCssApi = {
	rotating: styles.rotating,
	rotatingClamped: styles.rotatingClamped
};
export const rotationCssVars = {
	angle: "--angle",
	centerX: "--center-x",
	centerY: "--center-y",
	thresholdStart: "--rotation-threshold-start",
	thresholdEnd: "--rotation-threshold-end"
} satisfies Record<string, string>;
