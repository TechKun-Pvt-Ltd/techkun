import {renderSocialCard, SOCIAL_CARD_ALT, SOCIAL_CARD_SIZE, SOCIAL_CARD_CONTENT_TYPE} from "@/app/brand-social-card";

export const alt = SOCIAL_CARD_ALT;
export const size = SOCIAL_CARD_SIZE;
export const contentType = SOCIAL_CARD_CONTENT_TYPE;

export default async function Image() {
    return await renderSocialCard();
}
