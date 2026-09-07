import type { CSSProperties } from "react";

const overlayPositions = ["center-right", "center-left", "top-right", "top-left", "bottom-right", "bottom-left"] as const;

export type OverlayPosition = typeof overlayPositions[number];

export const anchorStyleMap: { [K in OverlayPosition]: CSSProperties } = {} as any;
for (const pos of overlayPositions) {
    anchorStyleMap[pos] = getAnchorStyle(pos);
}

function getAnchorStyle(position: OverlayPosition): CSSProperties {
    const style: CSSProperties = { position: "fixed" };

    if (position.startsWith("top")) {
        style.top = "24px";
    } else if (position.startsWith("bottom")) {
        style.bottom = "24px";
    } else {
        style.top = "0";
        style.bottom = "0";
        style.marginBlock = "auto";
    }

    if (position.endsWith("left")) {
        style.left = "24px";
    } else {
        style.right = "24px";
    }

    return style;
}

/** Which screen edge the panel hugs — used to put the swatch strip on the
 * outer edge (flush with the screen side) and controls toward the center. */
export function getPositionSide(position: OverlayPosition): "left" | "right" {
    return position.endsWith("left") ? "left" : "right";
}