"use client";

import styles from "./PalettePreviewOverlay.module.css";
import {ColorRampKey} from "@/app/styles/theme/color.config";
import colorRampsStatic from "@/app/styles/theme/color-ramps.static.mjs";

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