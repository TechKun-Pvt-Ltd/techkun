export const deviceBreakpoint = {
    mobileS: 320 / 16,
    mobileM: 375 / 16,
    mobileL: 425 / 16,
    tablet: 768 / 16,
    laptop: 1024 / 16,
    laptopMid: 1232 / 16,
    laptopL: 1440 / 16,
    desktop: 2560 / 16
};

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