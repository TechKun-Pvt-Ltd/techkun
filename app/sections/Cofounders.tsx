'use client';
import React from 'react';
import {css} from "@emotion/react";
import {StaticImageData} from "next/image";
import khiz from "@/public/cofounders/khiz.jpg";
import uz from "@/public/cofounders/uz_reads.jpeg";
import me from "@/public/cofounders/me_dark.png";
import LogoImageFrame from "@/app/components/logo-image-frame";
import {device} from "@/app/styles/device-breakpoints";

const people: {
    title: string;
    subtitle: string;
    image: StaticImageData;
}[] = [
    {
        title: "Hi, I'm Khizar, the CEO.",
        subtitle: 'khizar@tech-kun.com',
        image: khiz
    },
    {
        title: "I'm Uzair, the Managing Director.",
        subtitle: 'farasat@tech-kun.com',
        image: uz
    },
    {
        title: "And I'm Naved, the CTO.",
        subtitle: 'naved@tech-kun.com',
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
            <h2 css={css`
                margin-block-end: 192px;
                grid-column: 1 / -1;
                text-align: center;
            `}>If we still feel like strangers...</h2>
            <div css={css`
                grid-column: 1 / -1;
                display: grid;
                grid-template-columns: subgrid;
                align-items: center;
                column-gap: 2.5rem;

                & .person-img, & .person-intro {
                    grid-column: 1 / -1;
                }
                & .person-img {
                    margin-inline: -16px;
                    margin-block-end: 48px;
                }
                & .person-intro {
                    text-align: right;
                    margin-block-end: 768px;
                }
                @media ${device.tablet} {
                    & .person-img {
                        grid-column: span 3;
                        margin-inline: revert;
                    }
                    & .person-intro {
                        grid-column: span 3;
                        text-align: revert;
                    }
                    & .person-img, & .person-intro {
                        margin-block-end: 768px;
                    }
                }
            `}>
                {people.map(item => <React.Fragment key={item.title}>
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
                        <h3 className="text-3xl" style={{marginBlockEnd: '0.25em'}}>{item.title}</h3>
                        <p className="text-2xl" style={{color: 'oklch(0.625 0 0)'}}>{item.subtitle}</p>
                    </div>
                </React.Fragment>)}
            </div>
        </div>
    </section>;
}