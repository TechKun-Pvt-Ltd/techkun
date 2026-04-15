'use client';
import React from 'react';
import {css} from "@emotion/react";
import {StaticImageData} from "next/image";
import khiz from "@/public/cofounders/khiz.jpg";
import uz from "@/public/cofounders/uz_reads.jpeg";
import me from "@/public/cofounders/me_dark.png";
import LogoImageFrame from "@/app/components/logo-image-frame";
import {device} from "@/app/theme/device-breakpoints";
import Link from "next/link";

const people: {
    title: string;
    subtitle: string;
    mail: string;
    image: StaticImageData;
}[] = [
    {
        title: "Hi, I'm Khizar, the CEO.",
        subtitle: 'khizar@tech-kun.com',
        mail: 'khizar@tech-kun.com',
        image: khiz
    },
    {
        title: "I'm Uzair, the Managing Director.",
        subtitle: 'farasat@tech-kun.com',
        mail: 'farasat@tech-kun.com',
        image: uz
    },
    {
        title: "And I'm Naved, the CTO.",
        subtitle: 'naved@tech-kun.com',
        mail: 'naved@tech-kun.com',
        image: me
    },
];

export default function Cofounders() {
    return <section>
        <div css={css`
            padding-block-end: 256px;
            display: grid;
            grid-template-columns: subgrid;
        `}>
            <h2 className="section-title" css={css`
                margin-block-end: 192px;
                grid-column: 1 / -1;
                text-align: center;
            `}>If we still feel like strangers...</h2>
            <ul css={css`
                grid-column: 1 / -1;
                display: grid;
                grid-template-columns: 1fr;
                grid-auto-rows: auto;
                justify-content: end;
                justify-items: center;
                row-gap: 768px;

                & > li {
                    width: 100%;
                    max-width: 480px;
                    display: grid;
                    grid-template-columns: 1fr;
                    align-items: center;
                    gap: 48px;
                    text-align: right;

                    & .person-img {
                        margin-inline: -16px;
                        min-width: 400px;
                        width: 100%;
                        justify-self: end;
                    }
                    @media ${device.laptop} {
                        max-width: revert;
                        grid-template-columns: 1fr 1fr;
                        text-align: revert;
                        & .person-img {
                            margin-inline: revert;
                            //max-width: 480px;
                        }
                    }
                }

            `}>
                {people.map(item => <li key={item.title}>
                    <div className="person-img" css={css`
                        scroll-snap-align: center;
                    `}>
                        <LogoImageFrame imageData={item.image} />
                        {/*<div css={css`
                            top: 0; right: 0;
                            border-radius: 50%;
                            height: 100%;
                            overflow: hidden;
                            aspect-ratio: 1 / 1;
                        `}>
                            <Image css={css`
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                object-position: left top;
                            `} src={item.image} alt={"logo-framed image"} />
                        </div>*/}
                    </div>
                    <div className="person-intro">
                        <h3 className="item-title" style={{marginBlockEnd: '0.25em'}}>{item.title}</h3>
                        <Link href={`mailto:${item.mail}`} className="item-subtitle" css={css`
                            color: oklch(0.625 0 0);
                            cursor: pointer;
                            text-decoration: none;

                            & path {
                                transition-property: d, stroke;
                                transition-duration: 0.15s;
                                transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
                            }

                            &:hover path, &:focus path {
                                d: path("M 22 2 C 22 2 22 2 22 2 L 2.1378 8.8187 C 2.1378 8.8187 2.1378 8.8187 2.1378 8.8187 L 11.3766 12.6455 L 22 2 L 15.5454 20.9298 C 15.5454 20.9298 15.5454 20.9298 15.5454 20.9298 L 15.5454 20.9298 C 15.5454 20.9298 15.5454 20.9298 15.5454 20.9298 L 11.3766 12.6455");
                                stroke: var(--primary-500);
                            }
                        `}>
                            <svg width="1em" viewBox="0 0 24 24"
                                 style={{marginInlineEnd: '10px', marginBlockEnd: '-0.1875em'}}>
                                <path d="M 22 6 C 22 4.8954 21.1046 4 20 4 L 4 4 C 2.8954 4 2 4.8954 2 6 L 12 14 L 22 6 L 22 18 C 22 19.1046 21.1046 20 20 20 L 4 20 C 2.8954 20 2 19.1046 2 18 L 2 6"
                                      fill="transparent" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"
                                ></path>
                            </svg>
                            <span>{item.subtitle}</span>
                        </Link>
                    </div>
                </li>)}
            </ul>
        </div>
    </section>;
}