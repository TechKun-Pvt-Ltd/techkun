'use client'
import Image, {StaticImageData} from "next/image";
import {css} from "@emotion/react";
import logoPathImageFrame from "@/public/logo-path-image-frame.json";
import {Once, useRenderOnce} from "@/components/Once";
import React from "react";

const LOGO_IMAGE_FRAME_ID = "logo-image-frame";
const LOGO_IMAGE_FRAME_GRADIENT_ID = "logo-image-frame-gradient";

export default function LogoImageFrame({imageData, alt, ...props}: {
    imageData: StaticImageData;
    alt?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
    return <div
        {...props}
        css={css`
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
        `}
    >
        <svg viewBox={logoPathImageFrame.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
            <Once id="logo-image-frame-gradient">
                <defs>
                    <linearGradient id={LOGO_IMAGE_FRAME_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="20%" stopColor="var(--primary-500)" />
                        <stop offset="50%" stopColor="var(--secondary-500)" />
                    </linearGradient>
                </defs>
            </Once>
            {useRenderOnce("logo-image-frame") ?
                <path id={LOGO_IMAGE_FRAME_ID} d={logoPathImageFrame.value} fill={`url(#${LOGO_IMAGE_FRAME_GRADIENT_ID})`}/> :
                <use href={"#" + LOGO_IMAGE_FRAME_ID}/>
            }
        </svg>
        <Image src={imageData} alt={alt ?? "logo-framed image"} />
    </div>;
}