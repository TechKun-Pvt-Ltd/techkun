'use client';
import React, {ComponentType, useId, useRef} from 'react';
import {css} from "@emotion/react";
import {StaticImageData} from "next/image";
import khiz from "@/public/cofounders/khiz.jpg";
import uz from "@/public/cofounders/uz_reads.jpeg";
import me from "@/public/cofounders/me_dark.png";
import LogoImageFrame from "@/app/components/logo-image-frame";
import {deviceQuery} from "@/app/styles/device-query";
import EmailLink from "@/app/components/EmailLink";
import {LINKEDIN_LOGO_PATH_HREF, X_LOGO_PATH_HREF} from "@/app/Shared";
import Link from "next/link";
import {gradientColor1, gradientColor2} from "@/app/utils/custom-properties";

function LinkedIcon() {
    const FILL_GRADIENT_ID = "linkedin-icon-fill-gradient" + useId();
    return <svg viewBox="0 0 24 24">
        <defs>
            <linearGradient id={FILL_GRADIENT_ID} x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="20%" stopColor={`var(${gradientColor1})`} />
                <stop offset="80%" stopColor={`var(${gradientColor2})`} />
            </linearGradient>
        </defs>
        <use href={LINKEDIN_LOGO_PATH_HREF} fill={`url(#${FILL_GRADIENT_ID})`} />
    </svg>;
}
function XIcon() {
    const FILL_GRADIENT_ID = "x-icon-fill-gradient" + useId();
    return <svg viewBox="0 0 24 24">
        <defs>
            <linearGradient id={FILL_GRADIENT_ID} x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="20%" stopColor={`var(${gradientColor1})`} />
                <stop offset="80%" stopColor={`var(${gradientColor2})`} />
            </linearGradient>
        </defs>
        <use href={X_LOGO_PATH_HREF} fill={`url(#${FILL_GRADIENT_ID})`} />
    </svg>;
}

const people: {
    title: string;
    subtitle: string;
    mail: string;
    image: StaticImageData;
    imageAlt: string;
    links: {
        Icon: ComponentType;
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
            Icon: LinkedIcon,
            link: "https://www.linkedin.com/in/khizar-shakir-932003210/"
        }, {
            Icon: XIcon,
            link: "https://x.com/mohdkhizar36"
        }]
    },
    {
        title: "I'm\u00A0Uzair, the\u00A0Managing\u00A0Director.",
        subtitle: 'farasat@tech-kun.com',
        mail: 'farasat@tech-kun.com',
        image: uz,
        imageAlt: "The image of the managing director, Uzair.",
        links: [{
            Icon: LinkedIcon,
            link: "https://www.linkedin.com/in/mirza-farasat-89baba288/"
        }, {
            Icon: XIcon,
            link: "https://x.com/mirza_uzr"
        }]
    },
    {
        title: "And I'm\u00A0Naved, the\u00A0CTO.",
        subtitle: 'naved@tech-kun.com',
        mail: 'naved@tech-kun.com',
        image: me,
        imageAlt: "The image of the CTO, Naved.",
        links: [{
            Icon: LinkedIcon,
            link: "https://www.linkedin.com/in/navedm1424/"
        }, {
            Icon: XIcon,
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
    const ulRef = useRef<HTMLUListElement>(null);

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
        @media ${deviceQuery.laptop} {
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

    const contactsCss = css`
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 16px;

        .links {
            display: flex;
            gap: inherit;
            .link {
                color: inherit;
            }
        }

        .links .link > svg {
            display: block;

            width: 1em;
            transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
            transition-property: ${gradientColor1}, ${gradientColor2};
            ${gradientColor1}: currentColor;
            ${gradientColor2}: currentColor;
        }
        .links .link:is(:hover, :focus-visible) > svg {
            ${gradientColor1}: var(--primary-500);
            ${gradientColor2}: var(--secondary-500);
        }
    `;

    const indicatorCss = css`
        height: 4px;
        width: 32px;
        border-radius: 100px;
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
                @media ${deviceQuery.laptop} {
                    text-align: revert;
                }
            `}>If we still feel like strangers...</h2>
            <ul ref={ulRef} css={ulCss}>
                {people.map((item, personIndex) => <li
                    key={item.title}
                    className="cofounder" css={liCss}
                >
                    <div className="person-intro">
                        <div style={{ display: "flex", gap: "16px", marginBlockEnd: "32px" }}>
                            {people.map((_, iconIndex) => {
                                return <div
                                    key={iconIndex}
                                    className="person-index-indicator" css={indicatorCss}
                                    style={{
                                        "--i": iconIndex,
                                        background: iconIndex === personIndex ?
                                            "linear-gradient(to right, var(--primary-400), var(--secondary-400))" :
                                            "var(--secondary-neutral-200)",
                                        cursor: "pointer"
                                    } as React.CSSProperties}
                                    onClick={() => {
                                        if (!ulRef.current) return;

                                        ulRef.current.children[iconIndex].scrollIntoView({
                                            behavior: "smooth",
                                            block: "center"
                                        });
                                    }}
                                />;
                            })}
                        </div>
                        <h3 className="item-title" style={{marginBlockEnd: '0.4em'}}>{item.title}</h3>
                        <div css={contactsCss} className="item-subtitle">
                            <EmailLink
                                style={{ whiteSpace: "nowrap", color: "inherit" }}
                                address={item.mail} text={item.subtitle}
                                iconSize="1em" iconStrokeWidth="1.4"
                            />
                            <div className="links">
                                {item.links.map(item => <Link
                                    className="link"
                                    key={item.link} href={item.link}
                                    target="_blank" rel="noopener noreferrer"
                                ><item.Icon /></Link>)}
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
};