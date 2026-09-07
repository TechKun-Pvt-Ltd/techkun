"use client";

import styles from "./PalettePreviewOverlay.module.css";
import { EASING_OPTIONS } from "./easing-options";
import type { InterpolatedItemConfig } from "./palette-items.config";
import type { InterpolatedCustomization } from "./types";

interface InterpolatedFormProps {
    config: InterpolatedItemConfig;
    value: InterpolatedCustomization;
    onChange: (value: InterpolatedCustomization) => void;
}

export function InterpolatedForm({ config, value, onChange }: InterpolatedFormProps) {
    return (
        <div className={styles.formBody}>
            <p className={styles.hintText}>
                Interpolates between <code>{config.startColorVar}</code> and <code>{config.endColorVar}</code>.
            </p>
            <div className={styles.field}>
                <span className={styles.fieldLabel}>Easing</span>
                <select
                    className={styles.select}
                    value={value.easing}
                    onChange={(e) => onChange({ ...value, easing: e.target.value })}
                >
                    {EASING_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}