import {declarations, themeDeclarations, customPropertyRegistrations} from "./css-declarations.ts";
import {rules} from "./css-rules.ts";

export { declarations, themeDeclarations, customPropertyRegistrations, rules };
// export const themes = ObjectStream.of(themeCssDeclarations)
//     .mapValues(themeBlock => {
//         // Theme blocks are declared separately but share the same element, so their names must not collide either.
//         mergeAll([declarations, themeBlock.declarations]);
//         return themeBlock;
//     })
//     .collect();