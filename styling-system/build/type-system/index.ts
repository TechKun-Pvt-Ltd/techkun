import {standaloneValues} from "./primitive-values.ts";
import {mergeAll} from "./utils.ts";
import {primitiveCssDeclarations, semanticCssDeclarations} from "./css-declarations.ts";
import {contextualCssRules, primitiveCssRules, semanticCssRules} from "./css-rules.ts";

export const declarations = mergeAll([
    {
        "--scale-ratio": standaloneValues.scaleRatio,
        "--ls-offset": standaloneValues.letterSpacingOffset
    },
    primitiveCssDeclarations,
    semanticCssDeclarations
]);
export const rules = mergeAll([primitiveCssRules, semanticCssRules, contextualCssRules]);
