import "./rotation.css";
import type {CSSProperties} from "react";

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

// For use alongside rotationCssApi.rotatingClamped, which reads these vars.
export function rotationThresholdStyle(start: string, end?: string): CSSProperties {
	const properties: { [key: string]: string } = { [rotationCssVars.thresholdStart]: start };
	if (end)
		properties[rotationCssVars.thresholdEnd] = end;
	return properties;
}
