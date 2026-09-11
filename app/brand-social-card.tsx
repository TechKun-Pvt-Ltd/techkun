/** @jsxImportSource react */
import {ImageResponse} from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
import {viewBoxString} from "@/app/utils/graphics-utils.ts";
import logoPath from "@/public/logo-path.json";
import {PRIMARY_HUE, PRIMARY_LIGHTNESS, PRIMARY_CHROMA} from "@/app/styles/theme/color-constants";

export const SOCIAL_CARD_ALT = "TechKun — we build software with beauty, precision, and identity.";
export const SOCIAL_CARD_SIZE = {width: 1200, height: 630};
export const SOCIAL_CARD_CONTENT_TYPE = "image/png";

// Satori (used by ImageResponse) doesn't support oklch(), so the brand color has to be
// converted to sRGB hex ahead of time. Conversion via Björn Ottosson's OKLab formulas:
// https://bottosson.github.io/posts/oklab/
function oklchToHex(l: number, c: number, hueDegrees: number) {
    const hueRadians = (hueDegrees * Math.PI) / 180;
    const a = c * Math.cos(hueRadians);
    const b = c * Math.sin(hueRadians);

    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

    const l3 = l_ ** 3;
    const m3 = m_ ** 3;
    const s3 = s_ ** 3;

    const linear = {
        r: 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
        g: -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
        b: -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3,
    };

    const toSrgbChannel = (v: number) => {
        const clamped = Math.min(Math.max(v, 0), 1);
        const encoded = clamped <= 0.0031308
            ? 12.92 * clamped
            : 1.055 * clamped ** (1 / 2.4) - 0.055;
        return Math.round(encoded * 255).toString(16).padStart(2, "0");
    };

    return `#${toSrgbChannel(linear.r)}${toSrgbChannel(linear.g)}${toSrgbChannel(linear.b)}`;
}

const PRIMARY_HEX = oklchToHex(PRIMARY_LIGHTNESS, PRIMARY_CHROMA, PRIMARY_HUE);

const logoWidth = 336;
export async function renderSocialCard() {
    const font = await fs.readFile(
        path.join(process.cwd(), "app/fonts/Quicksand-Regular.ttf")
    );
    return new ImageResponse(
        <div style={{
            ...SOCIAL_CARD_SIZE,
            fontFamily: "Quicksand",
            paddingTop: 80, paddingBottom: 80,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 48,
            backgroundColor: "#030304"
        }}>
            <svg
                width={logoWidth} height={logoWidth * logoPath.viewBox.height / logoPath.viewBox.width}
                viewBox={viewBoxString(logoPath.viewBox)}
            >
                <path d={logoPath.value} fill={PRIMARY_HEX} />
            </svg>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, color: "#dddee1" }}>
                <h1 style={{ margin: 0, letterSpacing: "0.06em", fontSize: "60px", lineHeight: 1 }}>TechKun</h1>
                <p
                    style={{
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        fontSize: "28px",
                        lineHeight: 1.3,
                        color: "#a2a9cb",
                    }}
                >
                    <span>We build software with beauty,</span>
                    <span>precision, and identity.</span>
                </p>
            </div>
        </div>,
        {
            ...SOCIAL_CARD_SIZE,
            fonts: [
                {
                    name: "Quicksand",
                    data: font,
                    weight: 400,
                    style: "normal"
                },
            ]
        }
    );
}
