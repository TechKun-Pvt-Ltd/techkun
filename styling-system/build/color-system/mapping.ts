import {flattenComponentMapping, flattenSemanticMapping, primitiveTokens, semanticTokens} from "./schema.ts";
import type {ComponentMapping, SemanticMapping, Theme, TokenRef} from "./schema.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";

const darkSemanticMapping: SemanticMapping = {
    bg: {
        canvas: ref(primitiveTokens.neutral["950"]),
        surface: ref(primitiveTokens.neutral["900"]),
        "surface-raised": ref(primitiveTokens.neutral["800"]),
        overlay: ref(primitiveTokens["brand-2"]["950"], 0.96),
        accent: ref(primitiveTokens["brand-2"]["900"]),
        selection: ref(primitiveTokens["brand-1"]["950"])
    },
    text: {
        primary: ref(primitiveTokens.neutral["50"]),
        secondary: ref(primitiveTokens["neutral-tinted"]["300"]),
        tertiary: ref(primitiveTokens.neutral["500"]),
        accent: ref(primitiveTokens["brand-1"]["300"]),
        "on-accent": ref(primitiveTokens["brand-2"]["50"])
    },
    border: {
        default: ref(primitiveTokens.neutral["800"]),
        strong: ref(primitiveTokens["neutral-tinted"]["700"]),
        accent: ref(primitiveTokens["brand-2"]["900"])
    },
    brand: {
        "1": ref(primitiveTokens["brand-1"]["500"]),
        "2": ref(primitiveTokens["brand-2"]["500"]),
        "3": ref(primitiveTokens["brand-3"]["500"])
    }
};
const semanticMappingByTheme: { [T in Theme]: SemanticMapping } = {
    dark: darkSemanticMapping
};

const componentMappingGrouped: ComponentMapping = {
    "btn-primary": {
        bg: ref(semanticTokens.bg.accent),
        text: ref(semanticTokens.text["on-accent"])
    },
    "btn-secondary": {
        bg: ref(semanticTokens.bg.overlay),
        border: ref(semanticTokens.border.accent)
    },
    toolbar: {
        bg: ref(semanticTokens.bg.overlay),
        border: ref(semanticTokens.border.accent),
        text: ref(semanticTokens.text.secondary)
    },
    "toolbar-divider": {
        bg: ref(semanticTokens.border.accent)
    }
};

function ref(tokenRef: TokenRef["tokenRef"], alpha?: number): TokenRef {
    return {tokenRef, alpha};
}

export const semanticMapping = ObjectStream.of(semanticMappingByTheme)
    .mapValues(flattenSemanticMapping)
    .collect();
export const componentMapping = flattenComponentMapping(componentMappingGrouped);
