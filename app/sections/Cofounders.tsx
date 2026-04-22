'use client';
import React, {forwardRef} from 'react';
import {css} from "@emotion/react";
import {StaticImageData} from "next/image";
import khiz from "@/public/cofounders/khiz.jpg";
import uz from "@/public/cofounders/uz_reads.jpeg";
import me from "@/public/cofounders/me_dark.png";
import LogoImageFrame from "@/app/components/logo-image-frame";
import {device} from "@/app/theme/device-breakpoints";
import NextLink from "next/link";
import {mapEasingToNativeEasing, Easing, motion} from "motion/react";

const Link = motion.create(NextLink);

const emailSendAnimation: {
    duration: number;
    easing: Easing;
    pathData: [string, string];
} = {
    duration: 0.2,
    easing: [0.215, 0.61, 0.355, 1],
    pathData: [
        "M 22 6 C 22 4.8954 21.1046 4 20 4 L 4 4 C 2.8954 4 2 4.8954 2 6 L 2 18 C 2 19.1046 2.8954 20 4 20 L 20 20 C 21.1046 20 22 19.1046 22 18 L 22 6 L 12 14 L 2 6",
        "M 22 2 C 22 2 22 2 22 2 L 4.0295 8.1693 C 3.1583 8.4684 3.1205 9.6865 3.9715 10.039 L 10.9006 12.9091 C 10.9006 12.9091 10.9006 12.9091 10.9006 12.9091 L 13.6505 19.8868 C 13.9882 20.7438 15.2068 20.7271 15.5209 19.8612 L 22 2 L 10.9006 12.9091 L 3.9715 10.039"
    ]
};

const EmailSend = motion.create(forwardRef<SVGPathElement>((_, ref) => {
    return <svg width="1em" viewBox="0 0 24 24"
        style={{marginInlineEnd: '10px', marginBlockEnd: '-0.1875em'}}
    >
        <motion.path ref={ref}
            fill="transparent" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"
            variants={{
                initial: { d: emailSendAnimation.pathData[0] },
                focused: { d: emailSendAnimation.pathData[1] }
            }}
            transition={{
                duration: emailSendAnimation.duration,
                ease: emailSendAnimation.easing
            }}
        ></motion.path>
    </svg>
}));

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
                    </div>
                    <div className="person-intro">
                        <h3 className="item-title" style={{marginBlockEnd: '0.25em'}}>{item.title}</h3>
                        <Link href={`mailto:${item.mail}`} className="item-subtitle"
                            css={css`
                                cursor: pointer;
                                text-decoration: none;

                                & path {
                                    transition: stroke ${emailSendAnimation.duration}s ${mapEasingToNativeEasing(emailSendAnimation.easing, emailSendAnimation.duration)};
                                    stroke: currentColor;
                                }
                                &:hover path, &:focus-visible path {
                                    stroke: var(--primary-500);
                                }
                            `}
                            initial="initial"
                            whileHover="focused" whileFocus="focused"
                        >
                            <EmailSend />
                            <span>{item.subtitle}</span>
                        </Link>
                    </div>
                </li>)}
            </ul>
        </div>
    </section>;
}