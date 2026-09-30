import type {CompositeCustomPropertyNaming} from "../shared/composite-tokens/custom-properties.ts";
import type {CompositeSelectorNaming} from "../shared/composite-tokens/emitter.ts";
import type {FlatSchema} from "./system.ts";
import type {Standalone} from "./custom-properties.ts";

/* Naming only, in one place. A primitive token sets only the CSS properties of its proxy property; alias
   (semantic and component) tokens set them all. */

const SEMANTIC_PREFIX = "type";

export const typeNaming = {
    standalone: standalone => `--${standalone}`,
    primitive: (variant, cssProperty) => `--${cssProperty}-${variant}`,
    semantic: (token, cssProperty) => `--${SEMANTIC_PREFIX}-${token}-${cssProperty}`,
    component: (token, cssProperty) => `--${token}-${cssProperty}`,
    // A proxy property left out gets no primitive utilities - type sizes are only reachable through semantic tokens.
    primitiveUtilitySelectors: {
        weight: variant => `.font-${variant}`
    },
    semanticUtilitySelector: token => `.${SEMANTIC_PREFIX}-${token}`,
    componentUtilitySelector: token => `.${token}`
} satisfies CompositeCustomPropertyNaming<FlatSchema, Standalone> & CompositeSelectorNaming<FlatSchema>;
