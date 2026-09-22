"use client";

import styles from "./PalettePreviewOverlay.module.css";
import colorRampsStatic from "@/styling-system/build/js/color-ramps.mjs";
import {ColorRampKey} from "@/styling-system/build/color-system/css-palette-generation-config.ts";

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