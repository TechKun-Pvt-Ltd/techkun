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

// What a host binder receives: the glyph's identity and how its states are reached.
export type GlyphDescriptor<S extends string> = {
    readonly name: string;
    readonly kind: GlyphKind;
    readonly states: readonly [S, ...S[]] | undefined;
    readonly triggers: Glyph<S>["triggers"];
};

// Generates what one kind of host (CSS, Motion, …) needs to drive the icon. Its states are typed as
// plain strings: a binder written inline in a glyph can't be typed from states inferred in the same call.
export type HostBinder = (glyph: GlyphDescriptor<string>) => unknown;

export type HostBinders = {
    readonly [key: string]: HostBinder;
};

// Keys that would overwrite a function component's own properties.
type ReservedHostBindingKey = Extract<keyof Function, string> | "displayName" | "propTypes" | "defaultProps" | "contextTypes";
export type NoReservedHostBindingKeys<B> = [Extract<keyof B, ReservedHostBindingKey>] extends [never] ? object : never;

export type Glyph<S extends string = string, B extends HostBinders & NoReservedHostBindingKeys<B> = HostBinders> = {
    // Kebab-case, as in Naming; also the component's displayName.
    readonly name: string;
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
    // Each binder's result is set on the component under the binder's key, e.g. Mail.motion.
    // Intersected with HostBinders so binders written inline get their parameter typed.
    readonly hostBindings?: B & HostBinders;
};
