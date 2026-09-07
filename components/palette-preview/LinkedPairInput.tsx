"use client";

import type { ReactNode } from "react";
import styles from "./PalettePreviewOverlay.module.css";

interface LinkedPairInputProps<T> {
    label: string;
    value: T | { tints: T; shades: T; };
    onChange: (value: T | [T, T]) => void;
    renderInput: (value: T, onChange: (v: T) => void) => ReactNode;
    primaryLabel?: string;
    secondaryLabel?: string;
}

/**
 * Figma-style "expand into two" control. Whether it's expanded is derived
 * from the value's shape (number vs tuple) — no separate boolean to keep
 * in sync.
 */
export function LinkedPairInput<T>({
                                       label,
                                       value,
                                       onChange,
                                       renderInput,
                                       primaryLabel = "Start",
                                       secondaryLabel = "End",
                                   }: LinkedPairInputProps<T>) {
    const isSplit = value && typeof value === "object" && "tints" in value && "shades" in value;
    const pair = (isSplit ? value : [value, value]) as [T, T];

    const toggle = () => {
        onChange(isSplit ? pair[0] : [pair[0], pair[1]]);
    };

    return (
        <div className={styles.field}>
            <div className={styles.fieldHeader}>
                <span className={styles.fieldLabel}>{label}</span>
                <button
                    type="button"
                    className={styles.linkToggle}
                    aria-pressed={isSplit}
                    title={isSplit ? "Link values" : "Set separately"}
                    onClick={toggle}
                >
                    {isSplit ? "⇋" : "="}
                </button>
            </div>

            {!isSplit ? (
                renderInput(pair[0], (v) => onChange(v))
            ) : (
                <div className={styles.fieldPairRow}>
                    <label className={styles.subField}>
                        <span className={styles.subLabel}>{primaryLabel}</span>
                        {renderInput(pair[0], (v) => onChange([v, pair[1]]))}
                    </label>
                    <label className={styles.subField}>
                        <span className={styles.subLabel}>{secondaryLabel}</span>
                        {renderInput(pair[1], (v) => onChange([pair[0], v]))}
                    </label>
                </div>
            )}
        </div>
    );
}