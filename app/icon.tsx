import logoPath from "@/public/logo-path.json";
import {viewBoxString} from "@/app/utils/graphics-utils.ts";
import {SEED} from "@/styling-system/build/color-system/primitive-values.ts";

export const contentType = "image/svg+xml";

export default function Icon() {
    const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxString(logoPath.viewBox)}">
    <path d="${logoPath.value}" fill="oklch(${SEED.lightness} ${SEED.chroma} ${SEED.hue} / 1)" />
</svg>`;

    return new Response(markup, {
        headers: {"Content-Type": contentType},
    });
}
