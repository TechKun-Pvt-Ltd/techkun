"use client";

import styles from "./PalettePreviewOverlay.module.css";
import colorRampsStatic from "@/app/styles/theme/color-ramps.static.mjs";
import {ColorRampKey} from "@/app/styles/generated-css/css-palette-generation-config.ts";

export function PaletteStrip({ itemKey }: { itemKey: ColorRampKey }) {
    const varNames = colorRampsStatic[itemKey].filter(Boolean);

    return (
        <div className={styles.strip}>
            {varNames.map((varName) => (
                <div key={varName} className={styles.stripSwatch} style={{ background: `var(${varName})` }} title={varName} />
            ))}
        </div>
    );
}