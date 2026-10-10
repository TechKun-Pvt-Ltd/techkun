import {CompositeCSSEmitter} from "../../styling-system/shared/composite-tokens/emitter.ts";
import {TypeTokenStore} from "../../styling-system/type-system/system.ts";
import {typeSchema} from "./spec.ts";
import {STANDALONES, typeProperties} from "./custom-properties.ts";
import {typeNaming} from "./naming.ts";
import {standalones} from "./content/standalones.ts";
import primitiveValues from "./content/primitives.ts";
import {componentMapping, semanticMapping} from "./content/mapping.ts";

const typeTokens = new TypeTokenStore(typeSchema, STANDALONES, {
    standalones,
    primitive: primitiveValues,
    semantic: semanticMapping,
    component: componentMapping
});

export const typeEmitter = new CompositeCSSEmitter(typeProperties, typeTokens, typeNaming);
