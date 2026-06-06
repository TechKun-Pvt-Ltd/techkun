export const deviceBreakpoints = {
    mobileS: 320,
    mobileM: 375,
    mobileL: 425,
    tablet: 768,
    laptop: 1024,
    laptopL: 1440,
    desktop: 2560
};

export const device = {
    mobileS: `(min-width: ${deviceBreakpoints.mobileS}px)`,
    mobileM: `(min-width: ${deviceBreakpoints.mobileM}px)`,
    mobileL: `(min-width: ${deviceBreakpoints.mobileL}px)`,
    tablet: `(min-width: ${deviceBreakpoints.tablet}px)`,
    laptop: `(min-width: ${deviceBreakpoints.laptop}px)`,
    laptopL: `(min-width: ${deviceBreakpoints.laptopL}px)`,
    desktop: `(min-width: ${deviceBreakpoints.desktop}px)`,
};