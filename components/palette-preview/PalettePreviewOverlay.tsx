"use client";

import {useRef, useState} from "react";
import styles from "./PalettePreviewOverlay.module.css";
import {usePaletteStyleInjector} from "./use-palette-style-injector";
import {anchorStyleMap, getPositionSide, OverlayPosition} from "./anchor-position";
import {ShadesTintsForm} from "./ShadesTintsForm";
import {InterpolatedForm} from "./InterpolatedForm";
import {PaletteStrip} from "./PaletteStrip";
import {processConfig} from "@/app/styles/generated-css/css-palette-generation-utils";
import {PALETTE_CUSTOMIZATION, PaletteCustomization} from "@/app/styles/generated-css/css-palette-customization";
import {COLOR_RAMP_KEYS, ColorRampKey, ColorRampType} from "@/app/styles/generated-css/css-palette-generation-config";

interface PalettePreviewOverlayProps {
    /** Where the floating overlay anchors. Defaults to center-right. */
    position?: OverlayPosition;
}

const colorRampLabels: Record<ColorRampKey, string> = {
    primary: "Primary",
    secondary: "Secondary",
    tertiary: "Tertiary",
    secondaryNeutral: "Secondary Neutral",
    neutral: "Neutral"
};

export function PalettePreviewOverlay({ position = "center-right" }: PalettePreviewOverlayProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ColorRampKey>(COLOR_RAMP_KEYS[0]);
    const customizations = useRef<PaletteCustomization>(PALETTE_CUSTOMIZATION);

    const { applyRules, clear } = usePaletteStyleInjector();

    // Regenerate + apply CSS for ALL tabs whenever any tab's state changes,
    // so switching tabs never loses another tab's edits.
    // useEffect(() => {
    //     applyRules(buildPaletteCssRules(customizations));
    // }, [customizations, applyRules]);

    const anchorStyle = anchorStyleMap[position];
    const side = getPositionSide(position);

    const activeValue = customizations.current[activeTab];

    const updateActive = (value: PaletteCustomization) => {
        customizations.current[activeTab] = value;
        applyRules(processConfig(customizations.current));
    };

    const handleReset = () => {
        clear();
        customizations.current = PALETTE_CUSTOMIZATION;
    };

    if (!isOpen) {
        return (
            <button
                type="button"
                className={styles.circleButton}
                style={anchorStyle}
                onClick={() => setIsOpen(true)}
                aria-label="Open palette preview"
            />
        );
    }

    return (
        <div
            className={styles.panel}
            style={{ ...anchorStyle, flexDirection: side === "left" ? "row-reverse" : "row" }}
            role="dialog"
            aria-label="Palette preview"
        >
            <PaletteStrip itemKey={activeTab} />

            <div className={styles.panelMain}>
                <div className={styles.panelHeader}>
                    <h6 className={styles.heading}>Palette Previewer</h6>
                    <button type="button" className={styles.collapseButton} onClick={() => setIsOpen(false)} aria-label="Collapse palette preview">
                        ×
                    </button>
                </div>
                <div className={styles.panelHeader}>
                    <div className={styles.tabs} role="tablist">
                        {COLOR_RAMP_KEYS.map((key) => (
                            <button
                                key={key}
                                type="button"
                                role="tab"
                                aria-selected={key === activeTab}
                                className={key === activeTab ? `${styles.tab} ${styles.tabActive}` : styles.tab}
                                onClick={() => setActiveTab(key)}
                            >
                                {colorRampLabels[key]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.formScroll}>
                    {activeValue.type === ColorRampType.TINTS_SHADES && (
                        <ShadesTintsForm value={activeValue} onChange={updateActive} />
                    )}
                    {activeValue.type === ColorRampType.DEFAULT && (
                        <InterpolatedForm value={activeValue} onChange={updateActive} />
                    )}
                </div>

                <div className={styles.panelFooter}>
                    <button type="button" className={styles.resetButton} onClick={handleReset}>
                        Reset customizations
                    </button>
                </div>
            </div>
        </div>
    );
}