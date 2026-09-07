"use client";

import { useCallback, useEffect, useRef } from "react";

const STYLE_ELEMENT_ID = "palette-preview-style-overrides";
const ROOT_ATTRIBUTE = "data-palette-preview";

/**
 * Owns a single <style> tag in <head> plus a `data-palette-preview`
 * attribute on <html>. Rules are scoped as `html[data-palette-preview] {…}`
 * rather than `:root`, so they win on specificity over the page's own
 * `:root` theme rules regardless of stylesheet insertion order — no
 * `!important` needed. Removing the attribute + clearing the tag fully
 * reverts to the page's original look.
 */
export function usePaletteStyleInjector() {
    const styleElRef = useRef<HTMLStyleElement | null>(null);

    useEffect(() => {
        document.documentElement.setAttribute(ROOT_ATTRIBUTE, "");
        let el = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
        if (!el) {
            el = document.createElement("style");
            el.id = STYLE_ELEMENT_ID;
            document.head.appendChild(el);
        }
        styleElRef.current = el;

        return () => {
            document.documentElement.removeAttribute(ROOT_ATTRIBUTE);
            el?.parentNode?.removeChild(el);
            styleElRef.current = null;
        };
    }, []);

    const applyRules = useCallback((rules: Record<string, string>) => {
        const el = styleElRef.current;
        if (!el) return;
        const body = Object.entries(rules)
            .map(([prop, value]) => `${prop}: ${value};`)
            .join("\n");
        // language=CSS
        el.textContent = `:root[${ROOT_ATTRIBUTE}] { ${body} }`;
    }, []);

    const clear = useCallback(() => {
        if (styleElRef.current) styleElRef.current.textContent = "";
    }, []);

    return { applyRules, clear };
}