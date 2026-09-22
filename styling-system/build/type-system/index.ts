import primitiveValues, {standaloneValues} from "./values.ts";
import {mergeAll} from "./utils.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";
import {
    ContextualToSemanticMap, SemanticToPrimitiveMap
} from "./mapping.ts";
import getPrimitiveLayer from "./primitive-layer.ts";
import getSemanticLayer from "./semantic-layer.ts";
import getContextualLayer from "./contextual-layer.ts";
import type {TypeTokensLayer} from "./types.ts";

function buildTypeSystem() {
    const primitiveLayer = getPrimitiveLayer(primitiveValues);

    const resolvedSemanticValues = ObjectStream.of(SemanticToPrimitiveMap)
        .mapValues(primitiveLayer.resolvePrimitiveMapping)
        .collect();
    const semanticLayer = getSemanticLayer(resolvedSemanticValues);

    const resolvedContextualValues = ObjectStream.of(ContextualToSemanticMap)
        .mapValues(mapping => ({
            ...semanticLayer.resolveSemanticToken(mapping.semanticToken),
            ...(mapping.primitiveOverrides ? primitiveLayer.resolvePrimitiveMapping(mapping.primitiveOverrides) : null)
        }))
        .collect();
    const contextualLayer = getContextualLayer(resolvedContextualValues);

    const layers: TypeTokensLayer[] = [primitiveLayer, semanticLayer, contextualLayer];
    return {
        declarations: mergeAll([
            {
                "--scale-ratio": standaloneValues.scaleRatio,
                "--ls-offset": standaloneValues.letterSpacingOffset
            },
            ...layers.map(l => l.getCSSTokenDeclarations())
        ]),
        rules: mergeAll(layers.map(l => l.getCSSRules()))
    };
}

export const {declarations, rules} = buildTypeSystem();
