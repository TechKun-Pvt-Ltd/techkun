import {Themes} from "./schema.ts";
import {mergeAll} from "../shared/utils.ts";
import {
    componentCssDeclarations,
    primitiveCssDeclarations,
    seedCssDeclarations,
    seedCssRegistrations,
    semanticCssDeclarations
} from "./css-declarations.ts";
import {componentCssRules, semanticCssRules} from "./css-rules.ts";
import {ObjectStream} from "../../../lib/object-stream.ts";

export const registrations = seedCssRegistrations;
export const declarations = mergeAll([seedCssDeclarations, primitiveCssDeclarations, componentCssDeclarations]);
export const themes = ObjectStream.of(Themes)
    .mapEntryToValue((theme, spec) => {
        // Theme blocks are declared separately but share the same element, so their names must not collide either.
        mergeAll([declarations, semanticCssDeclarations[theme]]);
        return {...spec, declarations: semanticCssDeclarations[theme]};
    })
    .collect();
export const rules = mergeAll([semanticCssRules, componentCssRules]);
