import {Palettes} from "./schema.ts";
import type {Palette, PaletteToken} from "./types.ts";
import type {ComponentToken, SemanticToken} from "./mapping.ts";
import type {CSSToken} from "../shared/types.ts";
import {createObjectFromEntries} from "../shared/utils.ts";

/* Naming only: which CSS custom property a given token resolves to. Palettes are what the typed code calls
   its primitives; the color names below exist only here, in the custom properties the palettes emit as. */

const PaletteCssNames = {
    "brand-1": "mariner",
    "brand-2": "royal-blue",
    "brand-3": "fuchsia-blue",
    neutral: "gray",
    "neutral-tinted": "comet"
} as const satisfies Record<Palette, string>;

const primitiveCssTokensLookup: Record<PaletteToken, CSSToken> = createObjectFromEntries((Object.keys(Palettes) as Palette[])
    .flatMap(palette => Palettes[palette].map(step =>
        [`${palette}-${step}`, `--color-${PaletteCssNames[palette]}-${step}`] as const
    ))
);

export function lookupPrimitiveCssToken(token: PaletteToken): CSSToken {
    return primitiveCssTokensLookup[token];
}
export function lookupSemanticCssToken(token: SemanticToken): CSSToken {
    return `--${token}`;
}
export function lookupComponentCssToken(token: ComponentToken): CSSToken {
    return `--${token}`;
}
