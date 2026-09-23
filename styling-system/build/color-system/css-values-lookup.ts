import primitiveValues from "./primitive-values.ts";
import {Palettes} from "./schema.ts";
import {ComponentToRefMap, SemanticToPaletteMap} from "./mapping.ts";
import type {ComponentToken, SemanticToken} from "./mapping.ts";
import {lookupPrimitiveCssToken, lookupSemanticCssToken} from "./css-tokens-lookup.ts";
import type {Palette, PaletteRef, PaletteToken, SemanticRef, Theme} from "./types.ts";
import type {CSSValue} from "../shared/types.ts";
import {createObjectFromEntries, toVarRef} from "../shared/utils.ts";

/* Resolved values, one query function per level. Primitive values are read straight off the generated
   palettes; semantic and component values are var() references to whichever token their mapping points at. */

const primitiveCssValuesLookup: Record<PaletteToken, CSSValue> = createObjectFromEntries((Object.keys(Palettes) as Palette[])
    .flatMap(palette => Palettes[palette].map(step =>
        [`${palette}-${step}`, primitiveValues[palette][step]] as const
    ))
);

function resolveRef(ref: PaletteRef | SemanticRef): CSSValue {
    const varRef = toVarRef(ref.kind === "palette" ? lookupPrimitiveCssToken(ref.token) : lookupSemanticCssToken(ref.token));
    return ref.alpha === undefined ? varRef : `oklch(from ${varRef} l c h / ${ref.alpha})`;
}

export function lookupPrimitiveCssValue(token: PaletteToken): CSSValue {
    return primitiveCssValuesLookup[token];
}
export function lookupSemanticCssValue(theme: Theme, token: SemanticToken): CSSValue {
    return resolveRef(SemanticToPaletteMap[theme][token]);
}
export function lookupComponentCssValue(token: ComponentToken): CSSValue {
    return resolveRef(ComponentToRefMap[token]);
}
