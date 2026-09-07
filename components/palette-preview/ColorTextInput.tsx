"use client";

import { useEffect, useState } from "react";
import styles from "./PalettePreviewOverlay.module.css";
import { isValidCssColor } from "./color-validation";

interface ColorTextInputProps {
    value: string;
    placeholder: string;
    onChange(value: string | null): void;
}

/** Free-text color input (any CSS syntax, including oklch()), validated on
 * blur via CSS.supports so nothing invalid ever reaches the generator. */
export function ColorTextInput({ value, placeholder, onChange }: ColorTextInputProps) {
    const [draft, setDraft] = useState(value);

    const isValid = isValidCssColor(draft.trim());

    useEffect(() => {
        setDraft(value);
    }, [value]);

    return (
        <div className={styles.colorInputRow}>
            <span className={styles.colorSwatch} style={{ background: value || placeholder }} aria-hidden />
            <input
                type="text"
                className={isValid ? styles.textInput : `${styles.textInput} ${styles.invalid}`}
                value={draft}
                placeholder={placeholder}
                onChange={(e) => {
                    const latest = e.target.value;
                    setDraft(latest);
                    onChange(latest);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                }}
            />
        </div>
    );
}