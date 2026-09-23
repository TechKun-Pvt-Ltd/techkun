import type {Category, PaletteRef, PaletteToken, SemanticRef, Theme} from "./types.ts";

function palette(token: PaletteToken, alpha?: number): PaletteRef {
    return {kind: "palette", token, alpha};
}
function semantic(token: SemanticToken, alpha?: number): SemanticRef {
    return {kind: "semantic", token, alpha};
}

/* Semantic tokens: one color per role, grouped by category. Every theme defines the same roles. */
const darkSemanticGrouped = {
    bg: {
        canvas: palette("neutral-950"),
        surface: palette("neutral-900"),
        "surface-raised": palette("neutral-800"),
        overlay: palette("brand-2-950", 0.96),
        accent: palette("brand-2-900"),
        selection: palette("brand-1-950")
    },
    text: {
        primary: palette("neutral-50"),
        secondary: palette("neutral-tinted-300"),
        tertiary: palette("neutral-500"),
        accent: palette("brand-1-300"),
        "on-accent": palette("brand-2-50")
    },
    border: {
        default: palette("neutral-800"),
        strong: palette("neutral-tinted-700"),
        accent: palette("brand-2-900")
    },
    brand: {
        "1": palette("brand-1-500"),
        "2": palette("brand-2-500"),
        "3": palette("brand-3-500")
    }
} satisfies { [C in Category]?: { [role: string]: PaletteRef } };

type SemanticGrouped = typeof darkSemanticGrouped;
type ThemedSemanticGrouped = { [C in keyof SemanticGrouped]: { [R in keyof SemanticGrouped[C]]: PaletteRef } };
const semanticGroupedByTheme = {
    dark: darkSemanticGrouped
} satisfies Record<Theme, ThemedSemanticGrouped>;

/* Component tokens: one color per general-purpose component and category. `btn-primary` below declares two
   tokens, `color-bg-btn-primary` and `color-text-btn-primary` - grouping them is only for authoring. Colors
   specific to one component's structure (artwork, one-off sections) live inside that component instead. */
const componentGrouped = {
    "btn-primary": {
        bg: semantic("color-bg-accent"),
        text: semantic("color-text-on-accent")
    },
    "btn-secondary": {
        bg: semantic("color-bg-overlay"),
        border: semantic("color-border-accent")
    },
    toolbar: {
        bg: semantic("color-bg-overlay"),
        border: semantic("color-border-accent"),
        text: semantic("color-text-secondary")
    },
    "toolbar-divider": {
        bg: semantic("color-border-accent")
    }
} satisfies { [component: string]: { [C in Category]?: PaletteRef | SemanticRef } };


export type SemanticToken = {
    [C in keyof SemanticGrouped & string]: `color-${C}-${keyof SemanticGrouped[C] & string}`
}[keyof SemanticGrouped & string];

type ComponentGrouped = typeof componentGrouped;
export type ComponentToken = {
    [K in keyof ComponentGrouped & string]: `color-${keyof ComponentGrouped[K] & string}-${K}`
}[keyof ComponentGrouped & string];

type Flattened<Token extends string, Ref> = { token: Token; category: Category; ref: Ref };
function flattenSemantic(grouped: ThemedSemanticGrouped): Flattened<SemanticToken, PaletteRef>[] {
    return Object.entries(grouped).flatMap(([category, roles]) => Object
        .entries(roles as Record<string, PaletteRef>)
        .map(([role, ref]) => ({token: `color-${category}-${role}` as SemanticToken, category: category as Category, ref}))
    );
}
function flattenComponent(grouped: ComponentGrouped): Flattened<ComponentToken, PaletteRef | SemanticRef>[] {
    return Object.entries(grouped).flatMap(([component, categories]) => Object
        .entries(categories as Record<string, PaletteRef | SemanticRef>)
        .map(([category, ref]) => ({token: `color-${category}-${component}` as ComponentToken, category: category as Category, ref}))
    );
}

const semanticFlat = Object.fromEntries(Object
    .entries(semanticGroupedByTheme)
    .map(([theme, grouped]) => [theme, flattenSemantic(grouped)])
) as Record<Theme, Flattened<SemanticToken, PaletteRef>[]>;
const componentFlat = flattenComponent(componentGrouped);
// Every theme defines the same roles, so any theme can stand in for the token list and their categories.
const [referenceSemanticFlat] = Object.values(semanticFlat);

export const SemanticTokens: SemanticToken[] = referenceSemanticFlat.map(({token}) => token);
export const SemanticToPaletteMap = Object.fromEntries(Object
    .entries(semanticFlat)
    .map(([theme, entries]) => [theme, Object.fromEntries(entries.map(({token, ref}) => [token, ref]))])
) as Record<Theme, Record<SemanticToken, PaletteRef>>;

export const ComponentTokens: ComponentToken[] = componentFlat.map(({token}) => token);
export const ComponentToRefMap = Object.fromEntries(componentFlat
    .map(({token, ref}) => [token, ref])
) as Record<ComponentToken, PaletteRef | SemanticRef>;

export const TokenCategories = Object.fromEntries([...referenceSemanticFlat, ...componentFlat]
    .map(({token, category}) => [token, category])
) as Record<SemanticToken | ComponentToken, Category>;
