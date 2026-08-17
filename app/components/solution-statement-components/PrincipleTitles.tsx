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

        let currentIndex = 0;
        const groups = scope.current.querySelectorAll<HTMLDivElement>("div.title-group");
        queueMicrotask(() => groups.forEach(group => group.removeAttribute("data-initial")));
        function callback(a: Angle) {
            const targetIndex = Math.min(Math.floor((+a - angleRangeStart) / +Angle.HALF_PI), groups.length - 1);
            if (targetIndex === currentIndex) return;

            groups.forEach((group, i) => {
                group.style.setProperty("--_switch", Math.sign(i - targetIndex).toString());
            });
            currentIndex = targetIndex;
        }
        callback(angle.get());
        return angle.on("change", callback);
    }, []);

    return <div ref={scope} css={css`
        align-self: stretch;
        position: relative;
        isolation: isolate;
        div.title-group {
            position: absolute;
            inset: 0;

            display: grid;
            grid-template-rows: 1fr 1fr;
            row-gap: 8px;
            @media ${deviceQuery.tablet} {
                row-gap: 32px;
            }

            transition: 0.3s ease;
            transition-property: transform, opacity, filter;
            &[data-initial] {
                transition: none;
            }

            --switch-abs: abs(var(--_switch));
            @supports not ${cssSupportsQuery.abs} {
                --switch-abs: max(var(--_switch), calc(-1 * var(--_switch)));
            }
            opacity: calc(1 - var(--switch-abs));
            filter: blur(calc(var(--switch-abs) * 16px));
            transform:
                translateY(calc(var(--_switch) * 25%))
                scale(calc(1 - var(--switch-abs) * 0.25));
            @media ${deviceQuery.tablet} {
                transform:
                    translateX(calc(var(--_switch) * 25%))
                    scale(calc(1 - var(--switch-abs) * 0.25));
            }

            & > h3.item-title {
                align-self: end;
            }
        }
    `}>
        {titles.map((item, i) => {
            return <div
                key={i}
                className="title-group"
                style={{ "--_switch": i === 0 ? 0 : 1 } as React.CSSProperties}
                data-initial
            >
                <h3 className="item-title">{item.title}</h3>
                <p className="item-subtitle">{item.subtitle}</p>
            </div>;
        })}
    </div>;
}