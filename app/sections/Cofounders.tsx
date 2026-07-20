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
import {PathBuilder, Point2D} from "svg-path-kit";

const people: {
    title: string;
    subtitle: string;
    mail: string;
    image: StaticImageData;
    imageAlt: string;
    links: {
        icon: ReactNode;
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
            link: "https://www.linkedin.com/in/khizar-shakir-932003210/"
        }, {
            icon: <use href={X_ICON_HREF} />,
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
            link: "https://www.linkedin.com/in/mirza-farasat-89baba288/"
        }, {
            icon: <use href={X_ICON_HREF} />,
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
            link: "https://www.linkedin.com/in/navedm1424/"
        }, {
            icon: <use href={X_ICON_HREF} />,
            link: "https://x.com/navedm1424"
        }]
    },
];

// function PersonIcon({size = 32, active = false}: {
//     size?: string | number;
//     active?: boolean;
// }) {
//     const headRadius = 4;
//     const headWidth = 2 * headRadius;
//     const gap = 4;
//
//     const rectY = headWidth + gap;
//
//     let handPb: PathBuilder | null = null;
//
//     if (active)
//         (handPb = PathBuilder.m(Point2D.of(0, rectY + 6)))
//             .bezierEllipticalArc(8, rectY + 2, Math.PI / 2, Math.PI);
//
//     const viewBoxHeight = 32;
//
//     const color = active ? "var(--secondary-400)" : "var(--secondary-neutral-200)";
//
//     return <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox={`0 0 ${headWidth} ${viewBoxHeight}`} fill="none" overflow="visible">
//         <circle cx={headRadius} cy={headRadius} r={headRadius} fill={color} />
//         <rect
//             x="0" y={rectY}
//             width={headWidth} height={viewBoxHeight - rectY}
//             rx="4" ry="8" fill={color}
//             css={css`
//             `}
//         />
//         {handPb !== null && <path
//             d={handPb.toSVGPathString()}
//             css={css`
//                 @keyframes rotate {
//                     from, to {
//                         transform: rotate(10deg);
//                     }
//                     50% {
//                         transform: rotate(-30deg);
//                     }
//                 }
//                 transform-box: stroke-box;
//                 transform-origin: bottom right;
//                 animation: rotate 0.5s infinite ease-in-out;
//             `}
//             stroke={color} strokeWidth="2" strokeLinecap="round"
//         />}
//     </svg>;
// }

export default function Cofounders() {
    const ulCss = css`
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: 1fr;
        grid-auto-rows: auto;
        justify-items: center;
        row-gap: clamp(480px, 64vh, 768px);
    `;
    const liCss = css`
        min-width: 0;
        width: 100%;
        max-width: 480px;
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
        gap: 48px;

        & .person-intro {
            min-width: 0;
            grid-row: 2 / span 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        & .person-img {
            grid-row: 1 / span 1;
            //margin-inline: -8px;
            width: 100%;
            min-width: 0;
            display: flex;
            justify-content: end;
        }
        @media ${device.laptop} {
            max-width: revert;
            grid-template-columns: 5fr 7fr;
            gap: 16px;
            & .person-intro {
                grid-row: 1 / span 1;
                padding-block-start: calc(550.287 / 1541 * 100%);
                padding-block-end: calc((1 - 1325.29 / 1541) * 100%);
                align-items: start;
                text-align: revert;
            }
            & .person-img {
                grid-row: 1 / span 1;
                //margin-inline: revert;
            }
        }
    `;

    const linksCss = css`
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
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
                
                text-align: center;
                @media ${device.laptop} {
                    text-align: revert;
                }
            `}>If we still feel like strangers...</h2>
            <ul css={ulCss}>
                {people.map((item, personIndex) => <li key={item.title} css={liCss}>
                    <div className="person-intro">
                        <div style={{ display: "flex", gap: "16px", marginBlockEnd: "32px" }}>
                            {people.map((_, iconIndex) => <div
                                key={iconIndex}
                                style={{
                                    background: iconIndex === personIndex ?
                                        "linear-gradient(to right, var(--primary-400), var(--secondary-400))" :
                                        "var(--secondary-neutral-200)",
                                    height: "4px",
                                    width: "32px",
                                    borderRadius: "100px",
                                }}
                            />)}
                            {/*people.map((_, iconIndex) => <PersonIcon key={iconIndex} active={iconIndex === personIndex} />)*/}
                        </div>
                        <h3 className="item-title" style={{marginBlockEnd: '0.4em'}}>{item.title}</h3>
                        <div css={linksCss} className="text-xl">
                            <EmailLink
                                style={{ whiteSpace: "nowrap", color: "var(--secondary-neutral-200)" }}
                                address={item.mail} text={item.subtitle}
                                iconSize="1em" iconStrokeWidth="1.4"
                            />
                            <div style={{ display: "flex", gap: "inherit" }}>
                                {item.links.map(item => <a key={item.link} href={item.link}>
                                    <svg role="img" viewBox="0 0 24 24" width="1em" style={{ display: "block", color: "var(--secondary-neutral-200)" }}>
                                        {item.icon}
                                    </svg>
                                </a>)}
                            </div>
                        </div>
                    </div>
                    <div className="person-img" css={css`
                        scroll-snap-align: center;
                    `}>
                        <LogoImageFrame imageData={item.image} alt={item.imageAlt} style={{minWidth: "400px", flex: 1 }} />
                    </div>
                </li>)}
            </ul>
        </div>
    </section>;
}