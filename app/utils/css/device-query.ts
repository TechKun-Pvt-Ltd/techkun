import {deviceBreakpoint} from "@/styling/device-breakpoints.ts";

export const deviceQuery = {
    mobileS: `(min-width: ${deviceBreakpoint.mobileS}rem)`,
    mobileM: `(min-width: ${deviceBreakpoint.mobileM}rem)`,
    mobileL: `(min-width: ${deviceBreakpoint.mobileL}rem)`,
    tablet: `(min-width: ${deviceBreakpoint.tablet}rem)`,
    laptop: `(min-width: ${deviceBreakpoint.laptop}rem)`,
    laptopMid: `(min-width: ${deviceBreakpoint.laptopMid}rem)`,
    laptopL: `(min-width: ${deviceBreakpoint.laptopL}rem)`,
    desktop: `(min-width: ${deviceBreakpoint.desktop}rem)`,
};