/** @jsxImportSource react */
import {ImageResponse} from "next/og";
import logoPath from "@/public/logo-path.json";
import {viewBoxString} from "@/app/utils/graphics-utils";

export const SOCIAL_CARD_ALT = "TechKun — we build software with beauty, precision, and identity.";
export const SOCIAL_CARD_SIZE = {width: 1200, height: 630};
export const SOCIAL_CARD_CONTENT_TYPE = "image/png";

export function renderSocialCard() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #1572DB 0%, #1572DB 45%, #5B64DB 70%, #8056D0 100%)",
                    fontFamily: "sans-serif",
                }}
            >
                <svg
                    width="132" height="110"
                    viewBox={viewBoxString(logoPath.viewBox)}
                    style={{marginBottom: 36}}
                >
                    <path d={logoPath.value} fill="#FFFFFF" />
                </svg>
                <div style={{display: "flex", fontSize: 104, fontWeight: 700, color: "#FFFFFF", letterSpacing: -2}}>
                    TechKun
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: 34,
                        fontWeight: 500,
                        color: "rgba(255, 255, 255, 0.86)",
                        marginTop: 24,
                        maxWidth: 860,
                        textAlign: "center",
                    }}
                >
                    We build software with beauty, precision, and identity.
                </div>
            </div>
        ),
        {
            ...SOCIAL_CARD_SIZE,
        }
    );
}
