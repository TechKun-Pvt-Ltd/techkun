import primitiveValues, {LS_OFFSET, SCALE_RATIO} from "./values.ts";
import {
    type TypeTokensLayer,
    mapObjectValues, mapObjectEntries
} from "./shared.ts";
import {
    ContextToSemanticMap, SemanticToPrimitiveMap
} from "./config.ts";
import getPrimitiveLayer from "./primitive-layer.ts";
import getSemanticLayer from "./semantic-layer.ts";
import getContextualLayer from "./context-layer.ts";

const layers: TypeTokensLayer[] = [];
const primitiveLayer = getPrimitiveLayer(primitiveValues);
layers.push(primitiveLayer);

const resolvedSemanticValues = mapObjectValues(SemanticToPrimitiveMap, primitiveLayer.resolvePrimitiveToken);
const semanticLayer = getSemanticLayer(resolvedSemanticValues);
layers.push(semanticLayer);

const resolvedContextualValues = mapObjectEntries(
    ContextToSemanticMap, (contextualToken, mapping) => [
        contextualToken, {
            ...semanticLayer.resolveSemanticToken(mapping.semanticToken),
            ...(mapping.primitiveOverrides ? primitiveLayer.resolvePrimitiveToken(mapping.primitiveOverrides) : null)
        }
    ]
);
layers.push(getContextualLayer(resolvedContextualValues));

export const declarations = layers
    .map(l => l.getCSSDeclarations())
    .filter(v => v !== null)
    .reduce((acc, cur) => Object.assign(acc, cur), {
        "--scale-ratio": SCALE_RATIO,
        "--ls-offset": `${LS_OFFSET}em`
    });

export const rules = layers
    .map(l => l.getCSSRules())
    .filter(v => v !== null)
    .reduce((acc, cur) => Object.assign(acc, cur), {});