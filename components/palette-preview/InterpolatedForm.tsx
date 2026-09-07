"use client";

import styles from "./PalettePreviewOverlay.module.css";
import {GenericColorRampCustomization} from "@/app/styles/generated-css/css-palette-customization.ts";

interface InterpolatedFormProps {
    value: GenericColorRampCustomization;
    onChange: <K extends keyof GenericColorRampCustomization>(key: K, value: GenericColorRampCustomization[K]) => void;
}

export function InterpolatedForm({ value}: InterpolatedFormProps) {
    return (
        <div className={styles.formBody}>
            <p className={styles.hintText}>
                Interpolates between <code>{value.startColor}</code> and <code>{value.endColor}</code>.
            </p>
            <div className={styles.field}>
                <span className={styles.fieldLabel}>Easing</span>
                {/*<select*/}
                {/*    className={styles.select}*/}
                {/*    value={value.easing}*/}
                {/*    onChange={(e) => onChange({ ...value, easing: e.target.value })}*/}
                {/*>*/}
                {/*    {EASING_OPTIONS.map((opt) => (*/}
                {/*        <option key={opt.value} value={opt.value}>*/}
                {/*            {opt.label}*/}
                {/*        </option>*/}
                {/*    ))}*/}
                {/*</select>*/}
            </div>
        </div>
    );
}