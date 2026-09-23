import type {CSSTokenDeclarations} from "../shared/types.ts";

/* TEMPORARY - the pre-refactor custom property names, aliased onto the new primitives so components keep
   rendering identically while they're moved over to semantic/component tokens. Delete once nothing reads them. */

const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
const RAMPS = {
    primary: "mariner",
    secondary: "royal-blue",
    tertiary: "fuchsia-blue",
    neutral: "gray",
    "secondary-neutral": "comet"
};

export const legacyAliases: CSSTokenDeclarations = {
    ...Object.fromEntries(Object.entries(RAMPS).flatMap(([oldName, newName]) =>
        STEPS.map(step => [`--${oldName}-${step}`, `var(--color-${newName}-${step})`])
    )),
    "--primary-color": "var(--color-mariner-500)",
    "--secondary-color": "var(--color-royal-blue-500)",
    "--tertiary-color": "var(--color-fuchsia-blue-500)",
    "--secondary-neutral-color": "var(--color-comet-500)",
    // The old aliases keep their old colors - some differ from the semantic tokens replacing them.
    "--background": "var(--color-gray-950)",
    "--foreground": "var(--color-gray-50)",
    "--muted": "var(--color-gray-900)",
    "--muted-foreground": "var(--color-gray-200)",
    "--border": "var(--color-gray-800)"
};
