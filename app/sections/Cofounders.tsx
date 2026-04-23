'use client';
import React from 'react';
import {css} from "@emotion/react";
import {StaticImageData} from "next/image";
import khiz from "@/public/cofounders/khiz.jpg";
import uz from "@/public/cofounders/uz_reads.jpeg";
import me from "@/public/cofounders/me_dark.png";
import LogoImageFrame from "@/app/components/logo-image-frame";
import {device} from "@/app/theme/device-breakpoints";
import EmailLink from "@/app/components/EmailLink";

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
    const ulCss = css`
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: 1fr;
        grid-auto-rows: auto;
        justify-content: end;
        justify-items: center;
        row-gap: 768px;
    `;
    const liCss = css`
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
    `;

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
            <ul css={ulCss}>
                {people.map(item => <li key={item.title} css={liCss}>
                    <div className="person-img" css={css`
                        scroll-snap-align: center;
                    `}>
                        <LogoImageFrame imageData={item.image} />
                    </div>
                    <div className="person-intro">
                        <h3 className="item-title" style={{marginBlockEnd: '0.25em'}}>{item.title}</h3>
                        <EmailLink address={item.mail} text={item.subtitle} />
                    </div>
                </li>)}
            </ul>
        </div>
    </section>;
}