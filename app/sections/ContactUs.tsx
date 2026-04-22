'use client';
import {css, keyframes} from "@emotion/react";
import {AnimationSequence, motion, useAnimate} from "motion/react";
import React, {useCallback, useEffect, useRef} from "react";
import {AnimationPlaybackControlsWithThen} from "motion";
import {device} from "@/app/theme/device-breakpoints";
import Link from "next/link";
import {AnimationsRecord} from "@/app/utils/animation-utils";

const rotateConicGradient = keyframes`
    0% {
        --gradient-angle: 0deg;
    }
    100% {
        --gradient-angle: 360deg;
    }
`;

const VISIBILITY_DURATION = 5;
const FADE_IN_DURATION = 1.2;

const initialAnimations: AnimationsRecord<['idle', 'fadeIn', 'fadeOut']> = {
    idle: null, fadeIn: null, fadeOut: null
};

function ContactOptions() {
    const [scope, animate] = useAnimate<HTMLDivElement>();
    const animationsRef = useRef(initialAnimations);
    const elementsRef = useRef<Record<
        'first' | 'second' | 'hovered' | 'other',
        HTMLSpanElement | null
    >>({
        first: null, second: null, hovered: null, other: null
    });

    function startIdleAnimation(first: HTMLSpanElement, second: HTMLSpanElement) {
        const sequence: AnimationSequence = [
            [first, { opacity: 0 }, { delay: VISIBILITY_DURATION }],
            [second, { opacity: 1 }, { at: `-${FADE_IN_DURATION}`}],
            [first, { opacity: 1 }, { delay: VISIBILITY_DURATION }],
            [second, { opacity: 0 }, { at: `-${FADE_IN_DURATION}`}],
        ];
        animationsRef.current.idle = animate(sequence, {
            repeat: Infinity,
            repeatType: 'loop',
            defaultTransition: { duration: FADE_IN_DURATION, ease: 'easeInOut' }
        });
    }

    useEffect(() => {
        const options = scope.current.querySelectorAll<HTMLSpanElement>(".contact-option > span");
        elementsRef.current.first = options.item(0);
        elementsRef.current.second = options.item(1);
        startIdleAnimation(elementsRef.current.first!, elementsRef.current.second!);
    }, []);

    const onHoverStart = useCallback((e: HTMLSpanElement) => {
        animationsRef.current.idle?.stop();
        animationsRef.current.fadeIn?.stop();
        if (elementsRef.current.other === e)
            animationsRef.current.fadeOut?.stop();

        const other = e === elementsRef.current.first ?
            elementsRef.current.second : elementsRef.current.first;
        elementsRef.current.hovered = e;
        elementsRef.current.other = other;
        animationsRef.current.fadeIn = animate(e, { opacity: 1 }, { duration: FADE_IN_DURATION });
        animationsRef.current.fadeOut = animate(other, { opacity: 0 }, { duration: FADE_IN_DURATION });
    }, []);
    const onHoverEnd = useCallback(() => {
        animationsRef.current.idle?.stop();
        const {hovered, other} = elementsRef.current;
        animationsRef.current.fadeIn!.then(() => {
            animationsRef.current.fadeIn?.stop();
            animationsRef.current.fadeIn = null;
            animationsRef.current.fadeOut?.stop();
            animationsRef.current.fadeOut = null;
            elementsRef.current.hovered = null;
            elementsRef.current.other = null;
            startIdleAnimation(hovered!, other!);
        });
    }, []);

    return <motion.div ref={scope}
        onMouseOver={e => {
            let element = e.target;
            if (element instanceof HTMLButtonElement)
                element = element.children[0];
            if (!(element instanceof HTMLSpanElement))
                return;
            onHoverStart(element);
        }}
        onMouseOut={e => {
            let element = e.target;
            if (element instanceof HTMLButtonElement)
                element = element.children[0];
            if (!(element instanceof HTMLSpanElement))
                return;
            if (elementsRef.current.hovered !== null)
                onHoverEnd();
        }}
        css={css`
            @property --gradient-angle {
                syntax: "<angle>";
                inherits: true;
                initial-value: 0deg;
            }
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-inline: auto;
            width: 100%;
            text-align: center;

            @media ${device.mobileL} {
                width: max-content;
            }

            & .contact-option {
                background-color: transparent;
                color: var(--foreground);
                padding-block: 0.75rem;
                border-radius: 100vw;
                position: relative;
                padding-inline: 0;
                width: 100%;
    
                @media ${device.mobileL} {
                    padding-inline: 3rem;
                    width: revert;
                }
    
                &::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border: 1px solid var(--border);
                    border-radius: inherit;
                    transition: transform 0.1s ease-in-out;
                }
                & > span {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.1s ease-in-out, opacity 1s ease-in-out;
                    border: 2px solid transparent;
                    border-radius: inherit;
                    background: border-box conic-gradient(
                        from var(--gradient-angle) at 50% 50%,
                        var(--primary-200),
                        var(--primary-800),
                        transparent,
                        transparent,
                        var(--primary-800),
                        var(--primary-200)
                    ) 50% / 100%;
                    mask: linear-gradient(#000 0 0) padding-box subtract,
                        linear-gradient(#000 0 0);
                    animation: ${rotateConicGradient} 4s linear infinite;
                }
                &:active::before, &:active > span {
                    transform: scale(0.98);
                }
            }
        `}
    >
        <button className="contact-option large-text">
            <motion.span initial={{ opacity: 1 }} />
            Schedule a quick call with us
        </button>
        <p className="large-text" css={css`
            color: var(--muted-foreground);
            text-box-trim: trim-both;
            font-family: var(--script-12-bt), sans-serif;
        `}>or</p>
        <Link href="mailto:farasat@tech-kun.com" className="contact-option large-text" style={{ textDecoration: 'none' }}>
            <motion.span initial={{ opacity: 0 }} />
            Chat with us on email
        </Link>
    </motion.div>;
}

function ShimmerText(
    { children }: { children?: React.ReactNode }
) {
    return <span
        css={css`
            color: transparent;
            background: linear-gradient(
                45deg,
                var(--primary-300) 0%,
                var(--primary-300) 40%,
                var(--primary-100),
                var(--primary-50),
                var(--primary-100),
                var(--primary-300) 60%,
                var(--primary-300) 100%
            ) 100% center / 400% 100%;
            background-clip: text;
            cursor: default;

            &[data-shimmer="true"] {
                transition: background-position-x 1s cubic-bezier(0.17,0.03,0.77,0.93);
                background-position-x: 0;
            }
        `}
        onMouseEnter={e => (e.target as HTMLSpanElement).setAttribute('data-shimmer', "true")}
        onTransitionEnd={e => (e.target as HTMLSpanElement).removeAttribute('data-shimmer')}
    >{children}</span>
}

export default function ContactUs() {
    return <section>
        <div css={css`
            overflow-x: clip;
            display: grid;
            grid-template-columns: subgrid;
            grid-auto-rows: max-content;
            row-gap: 4rem;
            align-content: center;
        `}>
            <div css={css`
                grid-column: 1 / -1;
                text-align: center;

                & > h2 {
                    margin-block-end: 0.5em;
                }
            `}>
                <h2 className="section-title">Enough about us!</h2>
                <p className="section-subtitle">
                    We're delighted to see you here.<br/>
                    And we want to hear about <ShimmerText>you</ShimmerText>. You can...
                </p>
            </div>
            <div style={{gridColumn: '1 / -1'}}>
                <ContactOptions />
            </div>
        </div>
        {/*<div css={css`*/}
        {/*    overflow: hidden;*/}
        {/*    margin-top: -45%;*/}
        {/*    pointer-events: none;*/}
        {/*`}>*/}
        {/*    <svg xmlns="http://www.w3.org/2000/svg" width="100%"*/}
        {/*         viewBox="-2 -2 42 30" fill="none"*/}
        {/*         css={css`*/}
        {/*             transform: translateY(30%);*/}
        {/*         `}*/}
        {/*    >*/}
        {/*        <path d="M21.9258 10.793L21.5273 11.4375C21.3867 11.6641 21.1953 11.7773 20.9531 11.7773C20.7578 11.7773 20.5859 11.7109 20.4375 11.5781C20.2891 11.4375 20.2148 11.2695 20.2148 11.0742C20.2148 10.9492 20.2539 10.8203 20.332 10.6875L20.7305 10.043C20.8711 9.81641 21.0625 9.70312 21.3047 9.70312C21.5 9.70312 21.6719 9.77344 21.8203 9.91406C21.9688 10.0469 22.043 10.2109 22.043 10.4062C22.043 10.5312 22.0039 10.6602 21.9258 10.793ZM27.7852 16.0547C27.4492 16.0547 27.1211 16.0039 26.8008 15.9023C26.8086 16.0352 26.8125 16.168 26.8125 16.3008C26.8125 18.5508 24.7852 20.3086 20.7305 21.5742C17.7305 22.5039 14.7266 22.9688 11.7188 22.9688C8.32031 22.9688 5.55078 22.5469 3.41016 21.7031C1.13672 20.8125 0 19.5977 0 18.0586C0 16.4492 1.78906 15.2578 5.36719 14.4844C7.66406 13.9922 9.97656 13.7461 12.3047 13.7461C16.75 13.7461 18.9727 15.082 18.9727 17.7539C18.9727 19.4727 17.957 22.1094 15.9258 25.6641C15.5664 26.3594 15.2734 26.707 15.0469 26.707C14.9531 26.707 14.9062 26.6289 14.9062 26.4727C14.9062 26.2383 15.0117 25.9023 15.2227 25.4648C15.8555 24.1367 16.2344 23.1992 16.3594 22.6523C17.1641 20.3242 17.5664 18.6914 17.5664 17.7539C17.5664 16.6367 16.9102 15.8828 15.5977 15.4922C14.8477 15.2656 13.75 15.1523 12.3047 15.1523C10.7266 15.1523 8.75781 15.3594 6.39844 15.7734C3.07031 16.3516 1.40625 17.1133 1.40625 18.0586C1.40625 18.9258 2.28516 19.7031 4.04297 20.3906C6.02734 21.1719 8.58594 21.5625 11.7188 21.5625C14.2734 21.5625 16.9727 21.1719 19.8164 20.3906C23.543 19.3594 25.4062 17.9961 25.4062 16.3008C25.4062 15.8086 25.1953 15.1797 24.7734 14.4141C24.6875 14.2656 24.6445 14.1172 24.6445 13.9688C24.6445 13.5234 24.8633 13.3008 25.3008 13.3008C25.5195 13.3008 25.7188 13.3984 25.8984 13.5938C26.5625 14.2969 27.1914 14.6484 27.7852 14.6484C28.2539 14.6484 28.4883 14.8828 28.4883 15.3516C28.4883 15.8203 28.2539 16.0547 27.7852 16.0547ZM38.3906 1.04297C36.8672 3.15234 34.6875 4.78125 31.8516 5.92969C31.6797 6 31.5273 6.03516 31.3945 6.03516C31.1836 6.03516 31.0781 5.95312 31.0781 5.78906C31.0781 5.58594 31.2422 5.37891 31.5703 5.16797C34.2422 3.42578 36.1484 1.80859 37.2891 0.316406C37.4453 0.105469 37.6406 0 37.875 0C38.3203 0 38.543 0.207031 38.543 0.621094C38.543 0.761719 38.4922 0.902344 38.3906 1.04297ZM31.8516 12.9492C31.8516 13.668 31.7695 14.1875 31.6055 14.5078C31.3945 14.9375 30.9727 15.2695 30.3398 15.5039C29.3633 15.8711 28.5625 16.0547 27.9375 16.0547C27.4688 16.0547 27.2344 15.8203 27.2344 15.3516C27.2344 14.8828 27.4688 14.6484 27.9375 14.6484C28.4844 14.6484 29.0742 14.5195 29.707 14.2617C30.0586 14.1133 30.2773 13.957 30.3633 13.793C30.4258 13.6758 30.457 13.4062 30.457 12.9844C30.457 12.9141 30.2734 11.1562 29.9062 7.71094V7.62891C29.9062 7.37891 29.9961 7.16016 30.1758 6.97266C30.3633 6.78516 30.5664 6.69141 30.7852 6.69141C31.0664 6.69141 31.2227 6.85156 31.2539 7.17188C31.3789 8.49219 31.5039 9.34375 31.6289 9.72656C31.7773 11.2969 31.8516 12.3711 31.8516 12.9492Z"*/}
        {/*            fill="var(--background)" stroke="var(--muted)" strokeWidth="0.1"*/}
        {/*              css={css`*/}
        {/*                  paint-order: stroke fill;*/}
        {/*              `}*/}
        {/*        />*/}
        {/*    </svg>*/}
        {/*</div>*/}
    </section>;
}