/** @jsxImportSource react */
import {ImageResponse} from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
import {viewBoxString} from "@/app/utils/graphics-utils.ts";
import logoPath from "@/public/logo-path.json";

export const SOCIAL_CARD_ALT = "TechKun — we build software with beauty, precision, and identity.";
export const SOCIAL_CARD_SIZE = {width: 1200, height: 630};
export const SOCIAL_CARD_CONTENT_TYPE = "image/png";

const logoWidth = 360;
export async function renderSocialCard() {
    const font = await fs.readFile(
        path.join(process.cwd(), "app/fonts/Quicksand-Regular.ttf")
    );
    return new ImageResponse(
        <div style={{
            ...SOCIAL_CARD_SIZE,
            fontFamily: "Quicksand",
            paddingTop: 72, paddingBottom: 72,
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
                <path d={logoPath.value} fill="#1572db" />
            </svg>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", color: "#dddee1" }}>
                <h1 style={{ margin: 0, letterSpacing: "0.06em", fontSize: "56px", lineHeight: 1 }}>TechKun</h1>
                <p
                    style={{
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        fontSize: "24px",
                        lineHeight: 1,
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
