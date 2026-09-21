import type {TypeTokensLayer} from "./shared.ts";
import PrimitiveLayer from "./primitive-layer.ts";
import SemanticLayer from "./semantic-layer.ts";
import ContextLayer from "./context-layer.ts";

// This module is a registry as well as a parser
const layers: TypeTokensLayer[] = [PrimitiveLayer, SemanticLayer, ContextLayer];

export const declarations = layers
    .map(l => l.getCSSDeclarations())
    .filter(v => v !== null)
    .reduce((acc, cur) => Object.assign(acc, cur), {});

export const rules = layers
    .map(l => l.getCSSRules())
    .filter(v => v !== null)
    .reduce((acc, cur) => Object.assign(acc, cur), {});