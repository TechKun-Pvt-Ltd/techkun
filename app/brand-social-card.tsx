/** @jsxImportSource react */
import {ImageResponse} from "next/og";
import SocialCard from "@/app/photos/social-card/SocialCard.tsx";

export const SOCIAL_CARD_ALT = "TechKun — we build software with beauty, precision, and identity.";
export const SOCIAL_CARD_SIZE = {width: 1200, height: 630};
export const SOCIAL_CARD_CONTENT_TYPE = "image/png";

export function renderSocialCard() {
    return new ImageResponse(
        <SocialCard />,
        { ...SOCIAL_CARD_SIZE }
    );
}
