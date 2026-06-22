'use client'
import Image, {StaticImageData} from "next/image";
import {css} from "@emotion/react";
import logoPathImageFrame from "@/public/logo-path-image-frame.json";

export default function LogoImageFrame({imageData, alt}: {imageData: StaticImageData, alt?: string}) {
    return <div css={css`
        position: relative;
        & > svg, & > img {
            display: block;
        }
        & > img {
            position: absolute;
            inset: -0.5px -0.5px -0.5px auto;
            height: calc(100% + 1px);
            width: auto;
            aspect-ratio: 1 / 1;
            border-radius: 50%;
            object-fit: cover;
            object-position: left top;
            mask-image: linear-gradient(
                to right,
                transparent 0%,
                black 40%
            );
        }
    `}>
        <svg viewBox={logoPathImageFrame.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={logoPathImageFrame.value} fill="var(--primary-500)"/>
        </svg>
        <Image src={imageData} alt={alt ?? "logo-framed image"} />
    </div>;
}