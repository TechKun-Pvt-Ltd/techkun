import {mergeAll} from "../shared/utils.ts";
import {contextualCssDeclarations, primitiveCssDeclarations, semanticCssDeclarations, standaloneCssDeclarations} from "./css-declarations.ts";
import {contextualCssRules, primitiveCssRules, semanticCssRules} from "./css-rules.ts";

export const declarations = mergeAll([standaloneCssDeclarations, primitiveCssDeclarations, semanticCssDeclarations, contextualCssDeclarations]);
export const rules = mergeAll([primitiveCssRules, semanticCssRules, contextualCssRules]);
