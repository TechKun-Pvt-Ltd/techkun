export {declarations, themeDeclarations, customPropertyRegistrations} from "./css/declarations.ts";
export {rules} from "./css/rules.ts";
export {SEED} from "./content/seeds.ts";

// export const themes = ObjectStream.of(themeCssDeclarations)
//     .mapValues(themeBlock => {
//         // Theme blocks are declared separately but share the same element, so their names must not collide either.
//         mergeAll([declarations, themeBlock.declarations]);
//         return themeBlock;
//     })
//     .collect();