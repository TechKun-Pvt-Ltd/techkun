import type {Theme} from "../schema/lookups.ts";
import type {SemanticMappingTokenRef, ComponentMappingTokenRef} from "../schema/shapes.ts";
import primitiveValues from "../content/primitives.ts";
import {seeds} from "../content/seeds.ts";
import {themes, type ThemePresentation} from "../content/themes.ts";
import {componentMapping, semanticMapping} from "../content/mapping.ts";
import {cssCustomProperties, seedProperty, tokenVar} from "../naming.ts";
import type {CSSPropertyRegistration, CSSCustomProperty, CSSCustomPropertyDeclarations, CSSValue} from "../../shared/types.ts";
import {ObjectStream} from "../../../../lib/object-stream.ts";
import {mergeAll} from "../../shared/utils.ts";

function resolveTokenRef({ref, alpha}: SemanticMappingTokenRef | ComponentMappingTokenRef): CSSValue {
    const value = tokenVar(ref);
    return alpha === undefined ? value : `oklch(from ${value} l c h / ${alpha})`;
}

const seedCssDeclarations: CSSCustomPropertyDeclarations = ObjectStream.of(seeds)
    .mapEntries((seed, {value}) => [seedProperty(seed), value])
    .collect();
const seedCssRegistrations: Record<CSSCustomProperty, CSSPropertyRegistration> = ObjectStream.of(seeds)
    .mapEntries((seed, {registration}) => [seedProperty(seed), registration])
    .collect();

const primitiveCssDeclarations: CSSCustomPropertyDeclarations = ObjectStream.of(primitiveValues)
    .mapKeys(token => cssCustomProperties[token])
    .collect();

const themeCssDeclarations: {
    [T in Theme]: ThemePresentation & { declarations: CSSCustomPropertyDeclarations }
} = ObjectStream.of(themes)
    .mapEntryToValue((_, spec) => ({
        ...spec,
        declarations: ObjectStream.of(semanticMapping)
            .mapEntries((token, ref) => [cssCustomProperties[token], resolveTokenRef(ref)])
            .collect()
    }))
    .collect();

const componentCssDeclarations: CSSCustomPropertyDeclarations = ObjectStream.of(componentMapping)
    .mapEntries((token, ref) => [cssCustomProperties[token], resolveTokenRef(ref)])
    .collect();

export const themeDeclarations = themeCssDeclarations;
export const declarations = mergeAll([seedCssDeclarations, primitiveCssDeclarations, componentCssDeclarations]);
export const customPropertyRegistrations = seedCssRegistrations;