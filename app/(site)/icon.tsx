import logoPath from "@/public/logo-path.json";
import {viewBoxString} from "@/app/utils/graphics-utils.ts";
import {PRIMARY_HUE, PRIMARY_LIGHTNESS, PRIMARY_CHROMA} from "@/app/styles/theme/color-constants.ts";

const PRIMARY_COLOR = `oklch(${PRIMARY_LIGHTNESS} ${PRIMARY_CHROMA} ${PRIMARY_HUE} / 1)`;

export const contentType = "image/svg+xml";

export default function Icon() {
    const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxString(logoPath.viewBox)}">
    <path d="${logoPath.value}" fill="${PRIMARY_COLOR}" />
</svg>`;

    return new Response(markup, {
        headers: {"Content-Type": contentType},
    });
}
