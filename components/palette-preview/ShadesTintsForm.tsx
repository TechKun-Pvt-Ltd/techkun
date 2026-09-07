"use client";

import styles from "./PalettePreviewOverlay.module.css";
import { LinkedPairInput } from "./LinkedPairInput";
import { ColorTextInput } from "./ColorTextInput";
import { EASING_OPTIONS } from "./easing-options";
import type { ShadesTintsItemConfig } from "./palette-items.config";
import type { ShadesTintsCustomization } from "./types";

interface ShadesTintsFormProps {
    config: ShadesTintsItemConfig;
    value: ShadesTintsCustomization;
    onChange: (value: ShadesTintsCustomization) => void;
}

export function ShadesTintsForm({ config, value, onChange }: ShadesTintsFormProps) {
    return (
        <div className={styles.formBody}>
            <div className={styles.field}>
                <span className={styles.fieldLabel}>Base color</span>
                <ColorTextInput
                    value={value.baseColorOverride ?? ""}
                    placeholder={config.baseColorVar}
                    onChange={(v) => onChange({ ...value, baseColorOverride: v })}
                />
            </div>

            <LinkedPairInput
                label="Mix strength"
                primaryLabel="Tint"
                secondaryLabel="Shade"
                value={value.mixStrength}
                onChange={(mixStrength) => onChange({ ...value, mixStrength })}
                renderInput={(v, onChangeNum) => (
                    <input
                        type="number"
                        className={styles.numberInput}
                        min={0}
                        max={1}
                        step={0.01}
                        defaultValue={v}
                        onChange={(e) => {
                            const num = Number(e.target.value);
                            const newValue = Number.isNaN(num) ? 0 : Math.min(1, Math.max(0, num));
                            e.target.value = String(newValue);
                            onChangeNum(newValue);
                        }}
                    />
                )}
            />

            <LinkedPairInput
                label="Easing"
                primaryLabel="Tint"
                secondaryLabel="Shade"
                value={value.easing}
                onChange={(easing) => onChange({ ...value, easing })}
                renderInput={(v, onChangeEasing) => (
                    <select className={styles.select} value={v} onChange={(e) => onChangeEasing(e.target.value)}>
                        {EASING_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                )}
            />

            <div className={styles.field}>
                <span className={styles.fieldLabel}>White (tint target)</span>
                <ColorTextInput
                    value={value.whiteColorOverride ?? ""}
                    placeholder={config.defaultWhiteColor}
                    onChange={(v) => onChange({ ...value, whiteColorOverride: v })}
                />
            </div>

            <div className={styles.field}>
                <span className={styles.fieldLabel}>Black (shade target)</span>
                <ColorTextInput
                    value={value.blackColorOverride ?? ""}
                    placeholder={config.defaultBlackColor}
                    onChange={(v) => onChange({ ...value, blackColorOverride: v })}
                />
            </div>
        </div>
    );
}