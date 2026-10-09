import {iconHost} from "@/iconography/create-icon";
import type {GlyphDescriptor} from "@/iconography/glyph";

// A host whose :hover / :focus-visible drives the host trigger through CSS: the class to add to the host,
// alongside its own.
export function cssHost() {
    return iconHost;
}

// A Motion host: variant labels named after the glyph's states, for glyphs animated with motion
// (or falling back to it), which pick them up through variant propagation.
export function motionHost({states, triggers}: GlyphDescriptor<string>) {
    const active = triggers?.host;
    return {initial: states?.[0], whileHover: active, whileFocus: active, whileTap: active};
}
