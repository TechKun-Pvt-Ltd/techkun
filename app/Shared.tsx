/** @jsxImportSource react */
import React from "react";
import logoPath from "@/public/logo-path.json";

declare module "react" {
    interface HTMLAttributes<T> {
        xmlns?: string;
    }
}

const BR_BRAND_GRADIENT_ID = "br-brand-gradient";
const LOGO_PATH_ID = "logo-path";
const LINKEDIN_LOGO_CLIP_PATH_ID = "linked-in-icon";
const X_LOGO_CLIP_PATH_ID = "x-icon";

function createHref(id: string) {
    return "#" + id;
}

export const BR_BRAND_GRADIENT_HREF = createHref(BR_BRAND_GRADIENT_ID);
export const LOGO_PATH_HREF = createHref(LOGO_PATH_ID);
export const LINKEDIN_LOGO_CLIP_PATH_HREF = createHref(LINKEDIN_LOGO_CLIP_PATH_ID);
export const X_LOGO_CLIP_PATH_HREF = createHref(X_LOGO_CLIP_PATH_ID);

export default function Shared() {
    return <>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="0" height="0" style={{gridArea: 'none', position: 'fixed'}}
            viewBox="0 0 0 0"
        >
            <defs>
                <linearGradient id={BR_BRAND_GRADIENT_ID} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary-500)" />
                    <stop offset="50%" stopColor="var(--primary-500)" />
                    <stop offset="70%" stopColor="var(--secondary-500)" />
                    <stop offset="100%" stopColor="var(--tertiary-500)" />
                </linearGradient>
                <path id={LOGO_PATH_ID} d={logoPath.value} />
                <clipPath id={X_LOGO_CLIP_PATH_ID}>
                    <path
                        d="M 13.6755 10.6215 L 20.2327 3 h -1.554 l -5.6932 6.618 L 8.4383 3 H 3.1935 l 6.876 10.0072 L 3.1935 21 H 4.7475 l 6.012 -6.9885 L 15.5617 21 h 5.2447 z m -2.1278 2.4743 l -0.6967 -0.9968 L 5.307 4.17 h 2.3865 l 4.4737 6.399 l 0.6967 0.9968 l 5.8155 8.3175 h -2.3865 z"
                    />
                </clipPath>
                <clipPath id={LINKEDIN_LOGO_CLIP_PATH_ID}>
                    <path
                        d="M 18.8572 3 H 5.1428 C 3.96 3 3 3.96 3 5.1428 v 13.7143 C 3 20.04 3.96 21 5.1428 21 H 18.8572 C 20.04 21 21 20.04 21 18.8572 V 5.1428 C 21 3.96 20.04 3 18.8572 3 z M 8.5715 9.8572 v 8.1428 h -2.5715 V 9.8572 H 8.5715 z M 6 7.4872 c 0 -0.6 0.5143 -1.0585 1.2857 -1.0585 s 1.2557 0.4586 1.2857 1.0585 c 0 0.6 -0.48 1.0843 -1.2857 1.0843 C 6.5143 8.5715 6 8.0872 6 7.4872 z M 18 18 h -2.5715 c 0 0 0 -3.9686 0 -4.2857 c 0 -0.8572 -0.4285 -1.7143 -1.5 -1.7315 h -0.0343 C 12.8572 11.9828 12.4286 12.8657 12.4286 13.7143 c 0 0.39 0 4.2857 0 4.2857 h -2.5715 V 9.8572 h 2.5715 v 1.0972 c 0 0 0.8272 -1.0972 2.49 -1.0972 c 1.7015 0 3.0815 1.17 3.0815 3.54 V 18 z"
                    />
                </clipPath>
            </defs>
        </svg>
    </>;
}