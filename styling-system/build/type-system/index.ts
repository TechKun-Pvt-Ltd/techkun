import primitiveValues, {standaloneValues} from "./values.ts";
import {
    mapObjectValues, mapObjectEntries, mergeAll
} from "./shared.ts";
import {
    ContextualToSemanticMap, SemanticToPrimitiveMap, type TypeTokensLayer
} from "./config.ts";
import getPrimitiveLayer from "./primitive-layer.ts";
import getSemanticLayer from "./semantic-layer.ts";
import getContextualLayer from "./contextual-layer.ts";

function buildTypeSystem() {
    const primitiveLayer = getPrimitiveLayer(primitiveValues);

    const resolvedSemanticValues = mapObjectValues(SemanticToPrimitiveMap, primitiveLayer.resolvePrimitiveMapping);
    const semanticLayer = getSemanticLayer(resolvedSemanticValues);

    const resolvedContextualValues = mapObjectEntries(
        ContextualToSemanticMap, (contextualToken, mapping) => [
            contextualToken, {
                ...semanticLayer.resolveSemanticToken(mapping.semanticToken),
                ...(mapping.primitiveOverrides ? primitiveLayer.resolvePrimitiveMapping(mapping.primitiveOverrides) : null)
            }
        ]
    );
    const contextualLayer = getContextualLayer(resolvedContextualValues);

    const layers: TypeTokensLayer[] = [primitiveLayer, semanticLayer, contextualLayer];
    return {
        declarations: mergeAll([
            {
                "--scale-ratio": standaloneValues.scaleRatio,
                "--ls-offset": standaloneValues.letterSpacingOffset
            },
            ...layers.map(l => l.getCSSDeclarations())
        ]),
        rules: mergeAll(layers.map(l => l.getCSSRules()))
    };
}

export const {declarations, rules} = buildTypeSystem();
