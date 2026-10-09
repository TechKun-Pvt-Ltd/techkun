"use client"
import {css} from "@emotion/react";
import {motion} from "motion/react";
import cssSupports from "@/app/utils/css/supports";
import {easing} from "@/styling-system/build/motion.ts";
import createIcon from "@/iconography/create-icon";
import {cssHost, motionHost} from "@/iconography/host-bindings";

// Morph pair: the chevron at the start of the line, then pushed to its end, drawing the shaft behind it.
const shapes = {
    "chevron": "m 2 4 l 8 8 l -8 8 m 8 -8 h 0",
    "arrow": "m 14 4 l 8 8 l -8 8 m 8 -8 h -20"
};
const duration = 0.15;

export default createIcon({
    name: "arrow-right",
    kind: "outline",
    states: ["chevron", "arrow"],
    triggers: {host: "arrow"},
    styles: ({inState}) => css`
        path {
            transition: d ${duration}s var(--ease-out-cubic);
        }
        ${inState("arrow")} {
            path {
                d: path("${shapes["arrow"]}");
            }
        }
    `,
    hostBindings: {host: cssHost, motionHost},
    render: () => <>
        {/* Without CSS `d`, motion morphs it, driven by a motion host's variants named after the states. */}
        <motion.path
            d={shapes["chevron"]}
            {...(cssSupports.d ? null : {
                variants: {"chevron": {d: shapes["chevron"]}, "arrow": {d: shapes["arrow"]}},
                transition: {duration, ease: easing.outCubic}
            })}
        />
    </>
});
