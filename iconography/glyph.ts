import type React from "react";
import type {SerializedStyles} from "@emotion/react";

export type GlyphKind = "outline" | "filled" | "brand";

// What a glyph's render receives from the <Icon> rendering it.
export type GlyphContext<S extends string> = {
    // Scopes a <defs> id to this rendered icon, so two icons on a page never share a mask or gradient.
    id(local: string): string;
    // `url(#…)` of a scoped id, for mask, clip-path, fill and stroke references.
    url(local: string): string;
    // The current state; undefined for a glyph without states.
    state: S | undefined;
    // The progress prop (0–1), also on the svg as --icon-progress.
    progress: number | undefined;
    // Selector, for use in the glyph's styles, matching the <svg> while the glyph is in the given state:
    // through the state prop or the mount trigger (data-state), or through the host trigger (data-host-state).
    inState(state: S): string;
};

// Declared through a method so its parameter is checked bivariantly, like render's:
// otherwise a Glyph<"idle" | "ringing"> would not be a Glyph<string>.
type GlyphStylesBuilder<S extends string> = {
    build(context: GlyphContext<S>): SerializedStyles;
}["build"];

export type Glyph<S extends string = string> = {
    readonly kind: GlyphKind;
    // The first state is the initial one.
    readonly states?: readonly [S, ...S[]];
    readonly triggers?: {
        // State while an .icon-host ancestor is hovered or focused. CSS only: see GlyphContext.inState and iconHost.
        readonly host?: NoInfer<S>;
        // State switched to right after mount.
        readonly mount?: NoInfer<S>;
    };
    // Emotion styles applied to the <svg>; as a function, built from the same context render receives.
    readonly styles?: SerializedStyles | GlyphStylesBuilder<NoInfer<S>>;
    // Rendered as a component inside the <svg>, so it may use hooks.
    render(context: GlyphContext<NoInfer<S>>): React.ReactNode;
};
