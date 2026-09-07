"use client";

import React, {useRef} from "react";
import styles from "./PalettePreviewOverlay.module.css";
import { isValidCssColor } from "./color-validation";

interface ColorTextInputProps extends Omit<React.ComponentProps<"input">, "onChange"> {
    initialValue: string;
    placeholder: string;
    onChange(value: string): void;
}

/** Free-text color input (any CSS syntax, including oklch()), validated on
 * blur via CSS.supports so nothing invalid ever reaches the generator. */
export function ColorTextInput({ initialValue, placeholder, onChange }: ColorTextInputProps) {
    const colorPreviewRef = useRef<HTMLSpanElement>(null);
    const isValid = isValidCssColor(initialValue);
    return (
        <div className={styles.colorInputRow}>
            <span ref={colorPreviewRef} className={styles.colorSwatch} style={{ backgroundColor: initialValue }} aria-hidden />
            <input
                type="text"
                className={styles.textInput}
                defaultValue={initialValue}
                data-valid={isValid}
                placeholder={placeholder}
                onChange={e => {
                    const latest = e.target.value;
                    e.target.setAttribute("data-valid", String(isValidCssColor(latest)));
                    if (colorPreviewRef.current)
                        colorPreviewRef.current.style.backgroundColor = latest;
                    onChange(latest);
                }}
                onKeyDown={e => {
                    if (e.key === "Enter") e.currentTarget.blur();
                }}
            />
        </div>
    );
}