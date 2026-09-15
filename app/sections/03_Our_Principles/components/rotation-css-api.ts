import type {CSSProperties} from "react";
import {css} from "@emotion/react";
import supportsQuery from "@/app/utils/css/supports-query.ts";

/*
 * The rules this module declares depend on custom properties it does not declare:
 *  1.  --angle                     set by the caller on whatever element he/she uses to scope a live angle.
 *  2.  --center-x                  set by the caller directly (this module has no opinion on geometry), wherever is convenient in the same subtree.
 *      --center-y
 *  3.  --rotation-threshold-start  set per-element
 *      --rotation-threshold-end
 */
export const rotationCssVars = {
	angle: "--angle",
	activeQuadrantIndex: "--active-quadrant-index",
	centerX: "--center-x",
	centerY: "--center-y",
	thresholdStart: "--rotation-threshold-start",
	thresholdEnd: "--rotation-threshold-end"
} satisfies Record<string, string>;

export const rotationCssScope = css`
	${rotationCssVars.activeQuadrantIndex}: round(down, var(${rotationCssVars.angle}) / (90deg), 1);
	@supports not ${supportsQuery.unitStripping} {
		${rotationCssVars.activeQuadrantIndex}: round(down, tan(atan2(var(${rotationCssVars.angle}), 90deg)), 1);
	}

	.rotating {
		transform: rotate(var(${rotationCssVars.angle}));
		transform-box: view-box;
		transform-origin: var(${rotationCssVars.centerX}) var(${rotationCssVars.centerY});
	}

	.rotating-clamped {
		transform: rotate(calc(
			clamp(
				var(${rotationCssVars.thresholdStart}),
				var(${rotationCssVars.angle}),
				var(${rotationCssVars.thresholdEnd}, calc(var(${rotationCssVars.thresholdStart}) + 360deg))
			) - var(${rotationCssVars.thresholdStart})
		));
		transform-box: view-box;
		transform-origin: var(${rotationCssVars.centerX}) var(${rotationCssVars.centerY});
	}
`;

export const rotationClasses = {
	rotating: "rotating",
	rotatingClamped: "rotating-clamped"
};

// For use alongside rotationCssApi.rotatingClamped, which reads these vars.
export function rotationThresholdStyle(start: string, end?: string): CSSProperties {
	const properties: { [key: string]: string } = { [rotationCssVars.thresholdStart]: start };
	if (end)
		properties[rotationCssVars.thresholdEnd] = end;
	return properties;
}
