import {Palettes} from "./schema.ts";
import type {Palette, PaletteToken} from "./types.ts";
import type {ComponentToken, SemanticToken} from "./mapping.ts";
import type {CSSToken} from "../shared/types.ts";
import {createObjectFromEntries} from "../shared/utils.ts";

/* Naming only: which CSS custom property a given token resolves to. Palettes emit under their own names -
   the colors' real names live only with their values, in primitive-values.ts. */

const primitiveCssTokensLookup: Record<PaletteToken, CSSToken> = createObjectFromEntries((Object.keys(Palettes) as Palette[])
    .flatMap(palette => Palettes[palette].map(step =>
        [`${palette}-${step}`, `--color-${palette}-${step}`] as const
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
