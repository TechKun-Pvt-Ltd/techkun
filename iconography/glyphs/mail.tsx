"use client"
import {css} from "@emotion/react";
import {motion} from "motion/react";
import cssSupports from "@/app/utils/css/supports";
import {easing} from "@/styling/motion.ts";
import createIcon from "@/iconography/create-icon";
import {cssHost, motionHost} from "@/iconography/host-bindings";
import SVGBrandGradient from "@/iconography/gradients/SVGBrandGradient";

// Morph pair: same command sequence (case aside), same subpaths.
const shapes = {
    "envelope": "M 22 7 c 0 -1.6569 -1.3431 -3 -3 -3 l -14 0 c -1.6569 0 -3 1.3431 -3 3 l 0 10 c 0 1.6569 1.3431 3 3 3 l 14 0 c 1.6569 0 3 -1.3431 3 -3 l 0 -10 m 0 1 l -8 4.8 c -2 1.2 -2 1.2 -4 0 l -8 -4.8",
    "paper-plane": "M 22.2168 3.0898 C 22.5577 2.2667 21.7333 1.4423 20.9102 1.7832 L 3.3565 9.0542 C 2.5174 9.4018 2.5388 10.5977 3.3897 10.915 L 9.2457 13.0992 C 10.0609 13.4033 10.704 14.0464 11.0081 14.8616 L 13.1923 20.7176 C 13.5097 21.5685 14.7055 21.5899 15.0531 20.7508 L 22.2168 3.0898 M 22 2 L 10.3186 13.7887 C 10.0145 13.4846 9.6486 13.2495 9.2457 13.0992 L 3.3897 10.915"
};
const duration = 0.3;

export default createIcon({
    name: "mail",
    kind: "outline",
    states: ["envelope", "paper-plane"],
    triggers: {host: "paper-plane"},
    styles: ({url, inState}) => css`
        --icon-paint: ${url("paint")};
        path {
            transition: d ${duration}s var(--ease-out-cubic);
        }
        ${inState("paper-plane")} {
            path {
                d: path("${shapes["paper-plane"]}");
            }
        }
    `,
    hostBindings: {host: cssHost, motionHost},
    render: ({id}) => <>
        <defs>
            <SVGBrandGradient id={id("paint")} />
        </defs>
        {/* Without CSS `d`, motion morphs it, driven by a motion host's variants named after the states. */}
        <motion.path
            d={shapes["envelope"]}
            {...(cssSupports.d ? null : {
                variants: {"envelope": {d: shapes["envelope"]}, "paper-plane": {d: shapes["paper-plane"]}},
                transition: {duration, ease: easing.outCubic}
            })}
        />
    </>
});
