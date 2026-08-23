import {css} from "@emotion/react";
import React, {useEffect, useRef} from "react";
import {deviceQuery} from "@/app/styles/device-query";
import cssSupportsQuery from "@/app/utils/css-supports-query";
import {Angle} from "svg-path-kit";
import {MotionValue} from "motion";

export default function PrincipleTitles({angle, angleRangeStart, titles}: {
    angle: MotionValue<Angle>;
    angleRangeStart: number;
    titles: {
        title: string
        subtitle: string
    }[];
}) {
    const scope = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scope.current) return;

        const container = scope.current;
        let currentIndex = 0;
        requestAnimationFrame(() => container.removeAttribute("data-initial"));
        function callback(a: Angle) {
            const targetIndex = Math.min(Math.floor((+a - angleRangeStart) / +Angle.HALF_PI), titles.length - 1);
            if (targetIndex === currentIndex) return;

            container.style.setProperty("--active-index", targetIndex.toString());
            currentIndex = targetIndex;
        }
        callback(angle.get());
        return angle.on("change", callback);
    }, []);

    return <div
        ref={scope}
        data-initial
        style={{ '--active-index': 0 } as React.CSSProperties}
        css={css`
            align-self: stretch;
            position: relative;
            isolation: isolate;

            @property --active-index {
                syntax: "<number>";
                inherits: true;
                initial-value: 0;
            }
            --transition: --active-index 0.8s ease-in-out;
            &[data-initial] {
                --transition: none;
            }

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
                mask-position: calc(var(--active-index) * var(--_direction) * -133.33%) 0;
                transition: var(--transition);
            }
            div.title-group {
                position: absolute;
                inset: 0;

                display: grid;
                grid-template-rows: 1fr 1fr;
                row-gap: 8px;
                @media ${deviceQuery.tablet} {
                    row-gap: 32px;
                }
                transition: var(--transition);

                --active-offset: calc(var(--_direction) * (var(--i) - var(--active-index)));
                mask-image: linear-gradient(to right, transparent 10%, black 33.33%, black 66.66%, transparent 90%);
                mask-size: 300% 100%;
                mask-repeat: no-repeat;
                -webkit-mask-position-x: calc(50% + var(--active-offset) * 100%);

                & > .title {
                    align-self: end;
                }
                & > .subtitle {
                    text-wrap: pretty;
                }
            }

            // &.slide-swap div.title-group {
            //     transition: 0.3s ease;
            //     transition-property: transform, opacity, filter;
            //
            //     --_switch: clamp(-1, var(--active-offset), 1);
            //     --switch-abs: abs(var(--_switch));
            //     @supports not ${cssSupportsQuery.abs} {
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