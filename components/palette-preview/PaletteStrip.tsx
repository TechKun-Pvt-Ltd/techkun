"use client";

import styles from "./PalettePreviewOverlay.module.css";
import { getVarNames } from "./palette-items.config";
import type { PaletteItemKey } from "./types";

export function PaletteStrip({ itemKey }: { itemKey: PaletteItemKey }) {
    const varNames = getVarNames(itemKey).filter(Boolean);

    return (
        <div className={styles.strip}>
            {varNames.map((varName) => (
                <div key={varName} className={styles.stripSwatch} style={{ background: `var(${varName})` }} title={varName} />
            ))}
        </div>
    );
}