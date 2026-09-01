import {deviceBreakpoint} from "../../utils/css/device-query.ts";

// language=CSS
export default `
@layer base {
    :root {
        --mobile-s: ${deviceBreakpoint.mobileS}px;
        --mobile-m: ${deviceBreakpoint.mobileM}px;
        --mobile-l: ${deviceBreakpoint.mobileL}px;
        --tablet: ${deviceBreakpoint.tablet}px;
        --laptop: ${deviceBreakpoint.laptop}px;
        --laptop-mid: ${deviceBreakpoint.laptopMid}px;
        --laptop-l: ${deviceBreakpoint.laptopL}px;
        --desktop: ${deviceBreakpoint.desktop}px;
    }
}
`;