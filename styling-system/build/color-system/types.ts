import type {Categories, Palettes, Themes} from "./schema.ts";
import type {SemanticToken} from "./mapping.ts";

export type Palette = keyof typeof Palettes;
export type StepOf<P extends Palette> = typeof Palettes[P][number];
export type PaletteToken = { [P in Palette]: `${P}-${StepOf<P>}` }[Palette];

export type Category = keyof typeof Categories;
export type Theme = keyof typeof Themes;

// What a semantic or component token points at: one color, optionally at a reduced alpha.
export type PaletteRef = {
    kind: "palette";
    token: PaletteToken;
    alpha?: number;
};
export type SemanticRef = {
    kind: "semantic";
    token: SemanticToken;
    alpha?: number;
};
