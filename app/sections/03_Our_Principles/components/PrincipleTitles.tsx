import {css} from "@emotion/react";
import React, {useEffect, useRef} from "react";
import {deviceQuery} from "@/app/utils/css/device-query";
import supportsQuery from "@/app/utils/css/supports-query";
import {rotationCssVars} from "@/app/sections/03_Our_Principles/components/rotation-css-api.ts";

export default function PrincipleTitles({titles}: {
    titles: {
        title: string
        subtitle: string
    }[];
}) {
    const scope = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scope.current) return;

        const container = scope.current;
        requestAnimationFrame(() => container.removeAttribute("data-initial"));
    }, []);

    return <div
        ref={scope}
        data-initial
        css={css`
            align-self: stretch;
            position: relative;
            isolation: isolate;
            pointer-events: none;

			@property --_active-index {
				syntax: "<number>";
				inherits: true;
				initial-value: 0;
			}
			--transition: --_active-index 0.8s ease-in-out;
            &[data-initial] {
                --transition: none;
            }
            @media (prefers-reduced-motion: reduce) {
                --transition: none;
            }

            --_active-index: min(var(${rotationCssVars.activeQuadrantIndex}), ${titles.length - 1});
            --_direction: 1;
            &::after {
                content: "";
                position: absolute;
                z-index: 1;
                --blur-radius: 6px;
                inset: calc(-2 * var(--blur-radius));
                backdrop-filter: blur(var(--blur-radius));
                mask-image: linear-gradient(to right, transparent 25%, black 50%, black 75%, transparent 100%);
                mask-size: 400% 100%;
                mask-repeat: repeat-x;
                mask-position: calc(var(--_active-index) * var(--_direction) * -133.33%) 0;
                transition: var(--transition);
            }
            div.title-group {
                position: absolute;
                inset: 0;

                display: grid;
                grid-template-rows: 4rem 1fr;
                row-gap: var(--space-2);
                @media ${deviceQuery.tablet} {
                    grid-template-rows: 1fr 1fr;
                    row-gap: var(--space-8);
                }
                transition: var(--transition);

                --active-offset: clamp(-1, var(--_direction) * (var(--i) - var(--_active-index)), 1);
                mask-image: linear-gradient(to right, transparent 10%, black 33.33%, black 66.66%, transparent 90%);
                mask-size: 300% 100%;
                mask-repeat: no-repeat;
                -webkit-mask-position-x: calc(50% + var(--active-offset) * 100%);

                & > .title {
                    align-self: end;
                    text-wrap: balance;
                }
                & > .subtitle {
                    text-wrap: pretty;
                }
                container-type: normal;
                & > .title, & > .subtitle {
                    @container style(--active-offset = 0) {
                        pointer-events: auto;
                    }
                }
            }

            // &.slide-swap div.title-group {
            //     transition: 0.3s ease;
            //     transition-property: transform, opacity, filter;
            //
            //     --_switch: clamp(-1, var(--active-offset), 1);
            //     --switch-abs: abs(var(--_switch));
            //     @supports not ${supportsQuery.abs} {
            //         --switch-abs: max(var(--_switch), calc(-1 * var(--_switch)));
            //     }
            //     opacity: calc(1 - var(--switch-abs));
            //     filter: blur(calc(var(--switch-abs) * 16px));
            //     transform:
            //         translateY(calc(var(--_switch) * 25%))
            //         scale(calc(1 - var(--switch-abs) * 0.25));
            //     @media ${deviceQuery.tablet} {
            //         transform:
            //             translateX(calc(var(--_switch) * 25%))
            //             scale(calc(1 - var(--switch-abs) * 0.25));
            //     }
            // }
        `}
    >
        {titles.map((item, i) => {
            return <div
                key={i} className="title-group"
                style={{ "--i": i } as React.CSSProperties}
            >
                <h3 className="title item-title">{item.title}</h3>
                <p className="subtitle item-subtitle">{item.subtitle}</p>
            </div>;
        })}
    </div>;
}