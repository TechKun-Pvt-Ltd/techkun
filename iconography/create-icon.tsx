import React, {useEffect, useId, useState} from "react";
import type {Glyph, GlyphContext, HostBinders, NoReservedHostBindingKeys} from "@/iconography/glyph";
import {ObjectStream} from "@/lib/object-stream.ts";
import {cssHost} from "@/iconography/host-bindings.ts";

// Class for the interactive element whose :hover / :focus-visible drives its icons' host trigger.
export const iconHostClassNameSuffix = "-host";

const SIZE_STEPS = ["sm", "md", "lg", "xl"] as const;
type SizeStep = typeof SIZE_STEPS[number];
type Alignment = "cap" | "ex" | "baseline";

export type IconProps<S extends string> = {
    // A step of the fixed scale, or a CSS length for a text-relative size. Omitted: 1em.
    size?: SizeStep | (string & {});
    // Omitted: cap for text-relative sizes, baseline for size steps.
    align?: Alignment;
    // Omitted: the icon is decorative and hidden from assistive technology.
    label?: string;
    // Controls the state. Omitted: the mount trigger's state after mount, else the first state.
    state?: S;
    // 0–1, for progress-driven glyphs.
    progress?: number;
} & Omit<React.SVGProps<SVGSVGElement>, "viewBox" | "children" | "role" | "aria-label" | "aria-hidden" | "focusable">;

function isSizeStep(size: string): size is SizeStep {
    return (SIZE_STEPS as readonly string[]).includes(size);
}

// True from the first frame after mount, so a mount transition starts from the committed initial state.
function useMounted(enabled: boolean) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        if (!enabled) return;
        const frame = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(frame);
    }, [enabled]);
    return mounted;
}

// Returns the component that renders the glyph inside the icon frame. Glyph modules calling it
// are client modules ("use client"): the component uses hooks and emotion's css prop.
export default function createIcon<const S extends string = never, const B extends HostBinders & NoReservedHostBindingKeys<B> = {}>(glyph: Glyph<S, B>) {
    const Render = glyph.render;

    function Icon({size, align, label, state, progress, className, style, ...props}: IconProps<S>) {
        const scope = useId().replace(/[^\w-]/g, "");
        const mounted = useMounted(glyph.triggers?.mount !== undefined && state === undefined);

        const currentState = state ?? (mounted ? glyph.triggers?.mount : undefined) ?? glyph.states?.[0];
        const step = size !== undefined && isSizeStep(size) ? size : undefined;
        const alignment = align ?? (step ? "baseline" : "cap");

        const iconHostClassName = cssHost(descriptor);
        const context: GlyphContext<S> = {
            id: local => `${local}-${scope}`,
            url: local => `url(#${local}-${scope})`,
            state: currentState,
            progress,
            inState: function (state: string): string {
                return `&[data-state="${state}"], .${iconHostClassName}:is(:hover, :focus-visible) &[data-host-state="${state}"]`;
            }
        };
        const styles = typeof glyph.styles === "function" ? glyph.styles(context) : glyph.styles;

        const classNames = [
            "icon",
            glyph.kind !== "outline" && "icon-solid",
            step && `icon-${step}`,
            alignment !== "baseline" && `icon-align-${alignment}`,
            className
        ].filter(Boolean).join(" ");
        const customProperties = {
            ...(size !== undefined && !step ? {"--icon-size": size} : null),
            ...(progress !== undefined ? {"--icon-progress": progress} : null)
        };

        return <svg
            viewBox="0 0 24 24"
            className={classNames}
            css={styles}
            style={{...customProperties, ...style} as React.CSSProperties}
            focusable="false"
            data-state={currentState}
            data-host-state={glyph.triggers?.host}
            {...(label ? {role: "img", "aria-label": label} : {"aria-hidden": true})}
            {...props}
        >
            <Render {...context} />
        </svg>;
    }
    Icon.displayName = glyph.name;

    const descriptor = {name: glyph.name, kind: glyph.kind, states: glyph.states, triggers: glyph.triggers};
    const bindings = ObjectStream.of<HostBinders>(glyph.hostBindings ?? {})
    .mapValues(bind => bind(descriptor))
    .collect() as {readonly [K in keyof B]: B[K] extends (...args: never) => infer R ? R : never};

    return Object.assign(Icon, bindings);
}
