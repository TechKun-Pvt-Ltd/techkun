/** @jsxImportSource react */
import TechKunLogoSvg from "@/app/photos/TechKunLogoSvg.tsx";
import {SOCIAL_CARD_SIZE} from "@/app/brand-social-card.tsx";

/** This component is not supposed to use any theme variables. It is supposed to be a pure image. */
export default function SocialCard() {
    return <div style={{ ...SOCIAL_CARD_SIZE, paddingBlock: "36px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px"}}>
        <TechKunLogoSvg xPadding={0} xOffset={0} yOffset={0} width={360} height={360} />
        <div style={{ textAlign: "center" }}>
            <h1 style={{ letterSpacing: "0.06em", fontSize: "56px", marginBlockEnd: "0.2em" }}>TechKun</h1>
            <p style={{ fontSize: "24px", color: "oklch(.74 .05 276)" }}>We build software with beauty,<br/>precision, and identity.</p>
        </div>
    </div>;
}