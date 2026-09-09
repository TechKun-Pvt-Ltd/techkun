/** @jsxImportSource react */
import {SOCIAL_CARD_SIZE} from "@/app/brand-social-card.tsx";
import {viewBoxString} from "@/app/utils/graphics-utils.ts";
import logoPath from "@/public/logo-path.json";
import {TECHKUN_LOGO_PATH_HREF} from "@/app/Shared.tsx";
import React from "react";

/** This component is not supposed to use any theme variables. It is supposed to be a pure image. */
export default function SocialCard() {
    return <div style={{ ...SOCIAL_CARD_SIZE, paddingBlock: "36px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", backgroundColor: "#030304" }}>
        <svg
            width="360" height="auto"
            viewBox={viewBoxString(logoPath.viewBox)}
        >
            <use href={TECHKUN_LOGO_PATH_HREF} fill="#1572db" />
        </svg>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", color: "#dddee1" }}>
            <h1 style={{ letterSpacing: "0.06em", fontSize: "56px", marginBlockEnd: "0.2em" }}>TechKun</h1>
            <p style={{ fontSize: "24px", color: "#a2a9cb" }}>We build software with beauty,<br/>precision, and identity.</p>
        </div>
    </div>;
}