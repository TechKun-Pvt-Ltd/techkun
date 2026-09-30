import {colorSchema} from "../spec.ts";
import type {ComponentMappingTokenRef, GroupedComponentMapping, GroupedSemanticMapping, SemanticMappingTokenRef} from "../system.ts";

function ref<R extends ComponentMappingTokenRef["ref"]>(tokenRef: R, alpha?: number): { ref: R; alpha?: number } {
    return {ref: tokenRef, alpha};
}
const semanticRef = ref<SemanticMappingTokenRef["ref"]>;
const componentRef = ref<ComponentMappingTokenRef["ref"]>;

const {primitive: primitiveTokens, semantic: semanticTokens} = colorSchema;

export const semanticMapping: GroupedSemanticMapping = {
    dark: {
        bg: {
            canvas: semanticRef(primitiveTokens.neutral[950]),
            surface: semanticRef(primitiveTokens.neutral[900]),
            "surface-raised": semanticRef(primitiveTokens.neutral[800]),
            overlay: semanticRef(primitiveTokens["brand-2"][950], 0.96),
            accent: semanticRef(primitiveTokens["brand-2"][900]),
            selection: semanticRef(primitiveTokens["brand-1"][950])
        },
        text: {
            primary: semanticRef(primitiveTokens.neutral[50]),
            secondary: semanticRef(primitiveTokens["neutral-tinted"][300]),
            tertiary: semanticRef(primitiveTokens.neutral[500]),
            accent: semanticRef(primitiveTokens["brand-1"][300]),
            "on-accent": semanticRef(primitiveTokens["brand-2"][50])
        },
        border: {
            default: semanticRef(primitiveTokens.neutral[800]),
            strong: semanticRef(primitiveTokens["neutral-tinted"][700]),
            accent: semanticRef(primitiveTokens["brand-2"][900])
        },
        brand: {
            "1": semanticRef(primitiveTokens["brand-1"][500]),
            "2": semanticRef(primitiveTokens["brand-2"][500]),
            "3": semanticRef(primitiveTokens["brand-3"][500])
        }
    }
};

export const componentMapping: GroupedComponentMapping = {
    "btn-primary": {
        bg: componentRef(semanticTokens.bg.accent),
        text: componentRef(semanticTokens.text["on-accent"])
    },
    "btn-secondary": {
        bg: componentRef(semanticTokens.bg.overlay),
        border: componentRef(semanticTokens.border.accent)
    },
    toolbar: {
        bg: componentRef(semanticTokens.bg.overlay),
        border: componentRef(semanticTokens.border.accent),
        text: componentRef(semanticTokens.text.secondary)
    },
    "toolbar-divider": {
        bg: componentRef(semanticTokens.border.accent)
    }
};
