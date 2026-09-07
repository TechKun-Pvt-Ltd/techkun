/**
 * Uses the browser's own CSS parser to validate any color syntax the user
 * types — including oklch(), lab(), color-mix(), var() references, etc.
 * No color-parsing library needed.
 */
export function isValidCssColor(value: string): boolean {
    if (!value.trim()) return false;
    if (typeof window === "undefined" || !window.CSS?.supports) return true;
    return CSS.supports("color", value);
}