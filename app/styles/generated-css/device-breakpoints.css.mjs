import {deviceBreakpoint} from "../../utils/css/device-query.ts";

// language=CSS
export default `
@layer base {
    :root {
        --mobile-s: ${deviceBreakpoint.mobileS}rem;
        --mobile-m: ${deviceBreakpoint.mobileM}rem;
        --mobile-l: ${deviceBreakpoint.mobileL}rem;
        --tablet: ${deviceBreakpoint.tablet}rem;
        --laptop: ${deviceBreakpoint.laptop}rem;
        --laptop-mid: ${deviceBreakpoint.laptopMid}rem;
        --laptop-l: ${deviceBreakpoint.laptopL}rem;
        --desktop: ${deviceBreakpoint.desktop}rem;
    }
}
`;