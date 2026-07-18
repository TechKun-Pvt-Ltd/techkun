'use client';
import React, {ReactNode} from 'react';
import {css} from "@emotion/react";
import {StaticImageData} from "next/image";
import khiz from "@/public/cofounders/khiz.jpg";
import uz from "@/public/cofounders/uz_reads.jpeg";
import me from "@/public/cofounders/me_dark.png";
import LogoImageFrame from "@/app/components/logo-image-frame";
import {device} from "@/app/styles/device-breakpoints";
import EmailLink from "@/app/components/EmailLink";
import {LINKEDIN_ICON_HREF, X_ICON_HREF} from "@/app/Shared";

const people: {
    title: string;
    subtitle: string;
    mail: string;
    image: StaticImageData;
    imageAlt: string;
    links: {
        icon: ReactNode;
        iconAlt: string;
        link: string;
    }[];
}[] = [
    {
        title: "Hi, I'm\u00A0Khizar, the\u00A0CEO.",
        subtitle: 'khizar@tech-kun.com',
        mail: 'khizar@tech-kun.com',
        image: khiz,
        imageAlt: "The image of the CEO, Khizar.",
        links: [{
            icon: <use href={LINKEDIN_ICON_HREF} />,
            iconAlt: "LinkedIn Icon",
            link: "https://www.linkedin.com/in/khizar-shakir-932003210/"
        }, {
            icon: <use href={X_ICON_HREF} />,
            iconAlt: "X Icon",
            link: "https://x.com/navedm1424"
        }]
    },
    {
        title: "I'm\u00A0Uzair, the\u00A0Managing\u00A0Director.",
        subtitle: 'farasat@tech-kun.com',
        mail: 'farasat@tech-kun.com',
        image: uz,
        imageAlt: "The image of the managing director, Uzair.",
        links: [{
            icon: <use href={LINKEDIN_ICON_HREF} />,
            iconAlt: "LinkedIn Icon",
            link: "https://www.linkedin.com/in/mirza-farasat-89baba288/"
        }, {
            icon: <use href={X_ICON_HREF} />,
            iconAlt: "X Icon",
            link: "https://x.com/navedm1424"
        }]
    },
    {
        title: "And I'm\u00A0Naved, the\u00A0CTO.",
        subtitle: 'naved@tech-kun.com',
        mail: 'naved@tech-kun.com',
        image: me,
        imageAlt: "The image of the CTO, Naved.",
        links: [{
            icon: <use href={LINKEDIN_ICON_HREF} />,
            iconAlt: "LinkedIn Icon",
            link: "https://www.linkedin.com/in/navedm1424/"
        }, {
            icon: <use href={X_ICON_HREF} />,
            iconAlt: "X Icon",
            link: "https://x.com/navedm1424"
        }]
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
        //align-items: start;
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
            //justify-content: end;
        }
        @media ${device.laptop} {
            max-width: revert;
            grid-template-columns: 5fr 7fr;
            gap: 16px;
            //text-align: revert;
            & .person-intro {
                grid-row: 1 / span 1;
                //grid-column: 1 / span 2;
                padding-block-start: calc(550.287 / 1541 * 100%);
                padding-block-end: calc((1 - 1325.29 / 1541) * 100%);
                display: flex;
                flex-direction: column;
                //justify-content: space-between;
            }
            & .person-img {
                grid-row: 1 / span 1;
                //grid-column: 2 / span 2;
                //margin-inline: revert;
                justify-self: revert;
                //max-width: 480px;
            }
        }
    `;

    const linksCss = css`
        display: flex;
        align-items: center;
        gap: 16px;
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
                        <div css={linksCss} className="text-xl">
                            <EmailLink
                                style={{ whiteSpace: "nowrap", color: "var(--secondary-neutral-200)" }}
                                address={item.mail} text={item.subtitle}
                                iconSize="1em" iconStrokeWidth="1.2"
                            />
                            {item.links.map(item => <a key={item.link} href={item.link}>
                                <svg role="img" viewBox="0 0 24 24" width="1em" style={{ display: "block", color: "var(--secondary-neutral-200)" }}>
                                    {item.icon}
                                </svg>
                            </a>)}
                        </div>
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