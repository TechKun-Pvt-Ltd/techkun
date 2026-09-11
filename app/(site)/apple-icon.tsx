/** @jsxImportSource react */
import {ImageResponse} from "next/og";
import logoPath from "@/public/logo-path.json";
import {viewBoxString} from "@/app/utils/graphics-utils.ts";
import {oklchToHex} from "@/app/(site)/utils/color-conversion.ts";
import {PRIMARY_CHROMA, PRIMARY_HUE, PRIMARY_LIGHTNESS} from "@/app/styles/theme/color-constants.ts";

export const size = {width: 180, height: 180};
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: oklchToHex(PRIMARY_LIGHTNESS, PRIMARY_CHROMA, PRIMARY_HUE),
                }}
            >
                <svg
                    width="108" height="90"
                    viewBox={viewBoxString(logoPath.viewBox)}
                >
                    <path d={logoPath.value} fill="#FFFFFF" />
                </svg>
            </div>
        ),
        {...size}
    );
}
