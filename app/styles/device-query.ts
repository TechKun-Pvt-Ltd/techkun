export const deviceBreakpoint = {
    mobileS: 320,
    mobileM: 375,
    mobileL: 425,
    tablet: 768,
    laptop: 1024,
    laptopL: 1440,
    desktop: 2560
};

export const deviceQuery = {
    mobileS: `(min-width: ${deviceBreakpoint.mobileS}px)`,
    mobileM: `(min-width: ${deviceBreakpoint.mobileM}px)`,
    mobileL: `(min-width: ${deviceBreakpoint.mobileL}px)`,
    tablet: `(min-width: ${deviceBreakpoint.tablet}px)`,
    laptop: `(min-width: ${deviceBreakpoint.laptop}px)`,
    laptopL: `(min-width: ${deviceBreakpoint.laptopL}px)`,
    desktop: `(min-width: ${deviceBreakpoint.desktop}px)`,
};