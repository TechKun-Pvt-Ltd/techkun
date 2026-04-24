'use client'
import Image, {StaticImageData} from "next/image";
import {css} from "@emotion/react";
import logoPathImageFrame from "@/public/logo-path-image-frame.json";

export default function LogoImageFrame({imageData, alt}: {imageData: StaticImageData, alt?: string}) {
    return <div css={css`
        position: relative;
        line-height: 0;
        & > img {
            position: absolute;
            top: -0.5px; bottom: -0.5px; right: -0.5px;
            height: calc(100% + 1px);
            width: auto;
            aspect-ratio: 1 / 1;
            border-radius: 50%;
            object-fit: cover;
            object-position: left top;
            mask-image: linear-gradient(
                to right,
                rgba(255,255,255,0) 0%,
                rgba(255,255,255,1) 40%
            );
        }
    `}>
        <svg viewBox={logoPathImageFrame.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={logoPathImageFrame.value} fill="var(--primary-500)"/>
        </svg>
        <Image css={css`
            filter: grayscale(100%) contrast(1.1) brightness(0.9);
        `} src={imageData} alt={alt ?? "logo-framed image"} />
    </div>;
}