"use client";
import React, {useEffect, useRef} from "react";
import {css} from "@emotion/react";
import {motion} from "motion/react";
import {usePathname, useRouter} from "next/navigation";
import AnimatedStrikeThrough, {StrikeThroughAnimationControls} from "@/app/components/AnimatedStrikeThrough";
import GradientBorderButton from "@/app/components/banner-components/GradientBorderButton";
import EmailLink from "@/app/components/EmailLink";

export default function NotFound() {
    const pathname = usePathname();
    const router = useRouter();
    const strikeRef = useRef<StrikeThroughAnimationControls>(null);

    useEffect(() => {
        const strikeTimer = setTimeout(() => strikeRef.current?.start(), 400);
        return () => clearTimeout(strikeTimer);
    }, []);

    return <main>
        <section css={css`
            justify-items: center;
        `}>
            <div css={css`
                min-height: var(--section-height);
                width: 100%;
                max-width: 40rem;
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
            `}>
                <div>
                    <p className="text-lg" css={css`
                        margin-block-end: 16px;
                        font-weight: 500;
                        color: var(--secondary-neutral-400);
                    `}>
                        <span style={{fontFamily: "monospace"}}>GET </span>
                        <AnimatedStrikeThrough ref={strikeRef} thickness={2} color="var(--primary-400)">
                            <span style={{fontFamily: "monospace"}}>{pathname}</span>
                        </AnimatedStrikeThrough>
                    </p>
                    <motion.h1
                        className="hero-heading" css={css`margin-block-end: 24px;`}
                        initial={{opacity: 0, y: 12}} animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, ease: "easeOut", delay: 0.15}}
                    >404</motion.h1>
                    <p className="text-lg" css={css`
                        margin-block-end: 40px;
                        font-weight: 500;
                        color: var(--secondary-neutral-400);
                    `}>
                        This route never made it to production.
                    </p>
                    <div className="text-lg" css={css`
                        display: flex;
                        gap: 24px;
                        flex-wrap: wrap;
                        align-items: center;
                        justify-content: center;
                    `}>
                        <GradientBorderButton style={{width: "max-content"}} onClick={() => router.push("/")}>
                            Take me home
                        </GradientBorderButton>
                        <EmailLink
                            style={{color: "var(--secondary-neutral-400)", fontWeight: "500", width: "max-content"}}
                            address="info@tech-kun.com" text="or tell us it's broken" iconSide="right"
                            gap="8px" iconStrokeWidth={1.6}
                        />
                    </div>
                </div>
            </div>
        </section>
    </main>;
};
