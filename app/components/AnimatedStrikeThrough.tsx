import React, {forwardRef, useImperativeHandle, useRef} from "react";
import {css} from "@emotion/react";
import {PathBuilder, Point2D, Vector2D} from "svg-path-kit";

export interface StrikeThroughAnimationControls {
    start(): Promise<void>;
    reverse(): Promise<void>;
}

export interface AnimatedStrikeThroughProps {
    children?: React.ReactNode;
    thickness: number;
    color: string;
}

const AnimatedStrikeThrough = forwardRef<StrikeThroughAnimationControls, AnimatedStrikeThroughProps>(function (
    { children, thickness, color }, ref
) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const strikeThroughSvgRef = useRef<SVGSVGElement>(null);
    const strikeThroughPathRef = useRef<SVGPathElement>(null);

    useImperativeHandle(ref, () => ({
        async start(): Promise<void> {
            calculateViewBox();
            const strikeThroughAnimation = strikeThroughPathRef.current!.animate({
                strokeDashoffset: [10, 0]
            }, {
                duration: 1000, easing: 'ease-in-out', fill: 'forwards'
            });
            await strikeThroughAnimation.finished;
        },
        async reverse(): Promise<void> {
            const strikeThroughAnimation = strikeThroughPathRef.current!.animate({
                strokeDashoffset: [0, 10]
            }, {
                delay: 500, duration: 1000 / 3, easing: 'ease-in-out', fill: 'forwards'
            });
            await strikeThroughAnimation.finished;
            strikeThroughSvgRef.current?.setAttribute("viewBox", "0 0 0 0");
            strikeThroughPathRef.current?.setAttribute("d", "");
        }
    }), []);

    function calculateViewBox() {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const pb = PathBuilder.m(Point2D.of(0, 3 * rect.height / 4));
        pb.handleDefinedBezier(
            Vector2D.polar(20, -Math.PI / 8), Vector2D.polar(20, -Math.PI),
            Point2D.of(rect.width, rect.height / 2)
        );
        strikeThroughSvgRef.current?.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
        strikeThroughPathRef.current?.setAttribute("d", pb.toSVGPathString());
    }

    return <span css={{position: 'relative'}} ref={containerRef}>
        <svg ref={strikeThroughSvgRef} css={css`
            position: absolute;
            height: 100%; width: 100%;
        `}>
            <path ref={strikeThroughPathRef} fill="none"
                strokeWidth={thickness} stroke={color}
                pathLength={10} strokeDasharray={10} strokeDashoffset={10}
            ></path>
        </svg>
        {children}
    </span>;
});

export default AnimatedStrikeThrough;