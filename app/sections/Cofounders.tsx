'use client';
import React from 'react';
import {css} from "@emotion/react";
import {StaticImageData} from "next/image";
import khiz from "@/public/cofounders/khiz.jpg";
import uz from "@/public/cofounders/uz_reads.jpeg";
import me from "@/public/cofounders/me_dark.png";
import LogoImageFrame from "@/app/components/logo-image-frame";
import {device} from "@/app/styles/device-breakpoints";
import EmailLink from "@/app/components/EmailLink";

const people: {
    title: string;
    subtitle: string;
    mail: string;
    image: StaticImageData;
    imageAlt: string;
}[] = [
    {
        title: "Hi, I'm\u00A0Khizar, the\u00A0CEO.",
        subtitle: 'khizar@tech-kun.com',
        mail: 'khizar@tech-kun.com',
        image: khiz,
        imageAlt: "The image of the CEO, Khizar."
    },
    {
        title: "I'm\u00A0Uzair, the Managing\u00A0Director.",
        subtitle: 'farasat@tech-kun.com',
        mail: 'farasat@tech-kun.com',
        image: uz,
        imageAlt: "The image of the managing director, Uzair."
    },
    {
        title: "And I'm\u00A0Naved, the\u00A0CTO.",
        subtitle: 'naved@tech-kun.com',
        mail: 'naved@tech-kun.com',
        image: me,
        imageAlt: "The image of the CTO, Naved."
    },
];

export default function Cofounders() {
    const ulCss = css`
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: 1fr;
        grid-auto-rows: auto;
        justify-content: start;
        //justify-items: center;
        row-gap: 768px;
    `;
    const liCss = css`
        min-width: 0;
        width: 100%;
        max-width: 640px;
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
        gap: 48px;
        //text-align: right;

        & .person-intro {
            grid-row: 2 / span 1;
        }
        & .person-img {
            grid-row: 1 / span 1;
            //margin-inline: -8px;
            width: 100%;
            min-width: 0;
            justify-self: end;
            display: flex;
            justify-content: end;
        }
        @media ${device.laptop} {
            max-width: revert;
            grid-template-columns: 1fr 2fr;
            //text-align: revert;
            & .person-intro {
                grid-row: revert;
                h3.item-title {
                    margin-block-start: 240px;
                }
            }
            & .person-img {
                grid-row: revert;
                //margin-inline: revert;
                justify-self: revert;
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
            `}>If we still feel like strangers...</h2>
            <ul css={ulCss}>
                {people.map(item => <li key={item.title} css={liCss}>
                    <div className="person-intro">
                        <h3 className="item-title" style={{marginBlockEnd: '0.25em'}}>{item.title}</h3>
                        <EmailLink
                            className="item-subtitle"
                            style={{ whiteSpace: "nowrap" }}
                            address={item.mail} text={item.subtitle}
                            iconSize="0.8em" iconVerticalAlign="-0.1em"
                        />
                    </div>
                    <div className="person-img" css={css`
                        scroll-snap-align: center;
                    `}>
                        <LogoImageFrame imageData={item.image} alt={item.imageAlt} style={{minWidth: "400px", flex: "1"}} />
                    </div>
                </li>)}
            </ul>
        </div>
    </section>;
}