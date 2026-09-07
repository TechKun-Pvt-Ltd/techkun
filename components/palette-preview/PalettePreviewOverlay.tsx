"use client";

import { useRef, useState } from "react";
import styles from "./PalettePreviewOverlay.module.css";
import { PALETTE_ITEM_CONFIG, PALETTE_ITEM_KEYS } from "./palette-items.config";
import { createDefaultCustomizationState } from "./default-state";
import { buildPaletteCssRules } from "./build-palette-css-rules";
import { usePaletteStyleInjector } from "./use-palette-style-injector";
import {anchorStyleMap, getPositionSide, OverlayPosition} from "./anchor-position";
import { ShadesTintsForm } from "./ShadesTintsForm";
import { InterpolatedForm } from "./InterpolatedForm";
import { PaletteStrip } from "./PaletteStrip";
import type { CustomizationState, PaletteCustomization, PaletteItemKey } from "./types";

interface PalettePreviewOverlayProps {
    /** Where the floating overlay anchors. Defaults to center-right. */
    position?: OverlayPosition;
}

const DEFAULT_CUSTOMIZATION_STATE = createDefaultCustomizationState();
export function PalettePreviewOverlay({ position = "center-right" }: PalettePreviewOverlayProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<PaletteItemKey>(PALETTE_ITEM_KEYS[0]);
    const customizations = useRef<CustomizationState>(DEFAULT_CUSTOMIZATION_STATE);

    const { applyRules, clear } = usePaletteStyleInjector();

    // Regenerate + apply CSS for ALL tabs whenever any tab's state changes,
    // so switching tabs never loses another tab's edits.
    // useEffect(() => {
    //     applyRules(buildPaletteCssRules(customizations));
    // }, [customizations, applyRules]);

    const anchorStyle = anchorStyleMap[position];
    const side = getPositionSide(position);

    const activeConfig = PALETTE_ITEM_CONFIG[activeTab];
    const activeValue = customizations.current[activeTab];

    const updateActive = (value: PaletteCustomization) => {
        customizations.current[activeTab] = value;
        applyRules(buildPaletteCssRules(customizations.current));
    };

    const handleReset = () => {
        clear();
        customizations.current = DEFAULT_CUSTOMIZATION_STATE;
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
                    <div className={styles.tabs} role="tablist">
                        {PALETTE_ITEM_KEYS.map((key) => (
                            <button
                                key={key}
                                type="button"
                                role="tab"
                                aria-selected={key === activeTab}
                                className={key === activeTab ? `${styles.tab} ${styles.tabActive}` : styles.tab}
                                onClick={() => setActiveTab(key)}
                            >
                                {PALETTE_ITEM_CONFIG[key].label}
                            </button>
                        ))}
                    </div>
                    <button type="button" className={styles.collapseButton} onClick={() => setIsOpen(false)} aria-label="Collapse palette preview">
                        ×
                    </button>
                </div>

                <div className={styles.formScroll}>
                    {activeConfig.type === "shades-tints" && activeValue.type === "shades-tints" && (
                        <ShadesTintsForm config={activeConfig} value={activeValue} onChange={updateActive} />
                    )}
                    {activeConfig.type === "interpolated" && activeValue.type === "interpolated" && (
                        <InterpolatedForm config={activeConfig} value={activeValue} onChange={updateActive} />
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