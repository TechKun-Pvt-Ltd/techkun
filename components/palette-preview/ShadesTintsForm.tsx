"use client";

import styles from "./PalettePreviewOverlay.module.css";
import { LinkedPairInput } from "./LinkedPairInput";
import { ColorTextInput } from "./ColorTextInput";
import CubicBezierEditor from "@/components/CubicBezierEditor";
import {TintsShadesCustomization} from "@/app/styles/generated-css/css-palette-customization";
import {cubicBezierEasing} from "times-fps";

interface ShadesTintsFormProps {
    value: TintsShadesCustomization;
    onChange: <K extends keyof TintsShadesCustomization>(key: K, value: TintsShadesCustomization[K]) => void;
}

export function ShadesTintsForm({ value, onChange }: ShadesTintsFormProps) {
    return (
        <div className={styles.formBody}>
            <div className={styles.field}>
                <span className={styles.fieldLabel}>Base color</span>
                <ColorTextInput
                    initialValue={value.baseColor}
                    placeholder="Base color"
                    onChange={v => onChange("baseColor", v)}
                />
            </div>

            <LinkedPairInput
                label="Mix strength"
                primaryLabel="Tint"
                secondaryLabel="Shade"
                value={value.mixStrength}
                onChange={(mixStrength) => onChange("mixStrength", typeof mixStrength === "number" ? mixStrength : { tints: mixStrength[0], shades: mixStrength[1] })}
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

            {/*<LinkedPairInput*/}
            {/*    label="Easing"*/}
            {/*    primaryLabel="Tint"*/}
            {/*    secondaryLabel="Shade"*/}
            {/*    value={value.easing}*/}
            {/*    onChange={(easing) => onChange({ ...value, easing })}*/}
            {/*    renderInput={(v, onChangeEasing) => (*/}
            {/*        <select className={styles.select} value={v} onChange={(e) => onChangeEasing(e.target.value)}>*/}
            {/*            {EASING_OPTIONS.map((opt) => (*/}
            {/*                <option key={opt.value} value={opt.value}>*/}
            {/*                    {opt.label}*/}
            {/*                </option>*/}
            {/*            ))}*/}
            {/*        </select>*/}
            {/*    )}*/}
            {/*/>*/}

            <CubicBezierEditor
                defaultValue={(typeof value.easing === "function" ? value.easing : value.easing?.tints)?.bezierDefinition ?? [0, 0, 1, 1]}
                onChange={bezier => {
                    const tintsEasing = cubicBezierEasing(bezier[0], bezier[1], bezier[2], bezier[3]);
                    return onChange("easing", {tints: tintsEasing, shades: value.easing && "shades" in value.easing ? value.easing.shades : tintsEasing });
                }}
            />
            <CubicBezierEditor
                defaultValue={(typeof value.easing === "function" ? value.easing : value.easing?.shades)?.bezierDefinition ?? [0, 0, 1, 1]}
                onChange={bezier => {
                    const shadesEasing = cubicBezierEasing(bezier[0], bezier[1], bezier[2], bezier[3]);
                    return onChange("easing", {tints: value.easing && "tints" in value.easing ? value.easing.tints : shadesEasing, shades: shadesEasing});
                }}
            />

            <div className={styles.field}>
                <span className={styles.fieldLabel}>White override (tint target)</span>
                <ColorTextInput
                    initialValue={value.whiteOverride ?? "white"}
                    placeholder="White override"
                    onChange={(v) => onChange("whiteOverride", v)}
                />
            </div>

            <div className={styles.field}>
                <span className={styles.fieldLabel}>Black override (shade target)</span>
                <ColorTextInput
                    initialValue={value.blackOverride ?? "black"}
                    placeholder="Black override"
                    onChange={(v) => onChange("blackOverride", v)}
                />
            </div>
        </div>
    );
}