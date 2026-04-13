import React, {forwardRef, useImperativeHandle, useRef} from "react";
import {Interpolation} from "@emotion/react";

export interface SvgTextAnimationControls {
    start(): Promise<void>;
    reverse(): Promise<void>;
}

export interface AnimatedSvgTextProps {
    children?: string;
    color: string;
    style?: Interpolation;
    fontStyles?: {
        fontSize?: string | number;
        fontFamily: string;
        fontWeight?: number;
        fontStyle?: string;
    };
}

const strokeWidth = 0.5;

const AnimatedSvgText = forwardRef<SvgTextAnimationControls, AnimatedSvgTextProps>(function (
    {children, style, color, fontStyles}, ref
) {
    const svgElementRef = useRef<SVGSVGElement>(null);
    const svgTextRef = useRef<SVGTextElement>(null);
    const strokeDashLengthRef = useRef(0);

    function calculateTextProperties() {
        if (!svgTextRef.current || !svgElementRef.current) return;

        const bBox = svgTextRef.current.getBBox();
        const computedTextLength = svgTextRef.current.getComputedTextLength();
        const textViewBox = {
            x: -strokeWidth, y: 0,
            width: bBox.width + 2 * strokeWidth,
            height: bBox.height + 2 * strokeWidth
        };
        const textProperties = {
            x: -bBox.x, y: -bBox.y,
            strokeDashLength: 2 * computedTextLength
        };
        strokeDashLengthRef.current = textProperties.strokeDashLength;

        svgElementRef.current.style.width = textViewBox.width + "px";
        svgElementRef.current.style.height = textViewBox.height + "px";
        svgElementRef.current.setAttribute("viewBox", `${textViewBox.x} ${textViewBox.y} ${textViewBox.width} ${textViewBox.height}`);

        svgTextRef.current.setAttribute("x", String(textProperties.x));
        svgTextRef.current.setAttribute("y", String(textProperties.y));
        svgTextRef.current.style.strokeDasharray = `${textProperties.strokeDashLength} ${1.5 * textProperties.strokeDashLength}`;
        svgTextRef.current.style.strokeDashoffset = String(textProperties.strokeDashLength);
    }
    function resetTextProperties() {
        if (!svgElementRef.current || !svgTextRef.current) return;

        svgElementRef.current.style.width = "0";
        svgElementRef.current.style.height = "0";
        svgElementRef.current.setAttribute("viewBox", "0 0 0 0");

        svgTextRef.current.setAttribute("x", "0");
        svgTextRef.current.setAttribute("y", "0");
        svgTextRef.current.style.strokeDasharray = "0 0";
        svgTextRef.current.style.strokeDashoffset = "0";
    }

    useImperativeHandle(ref, () => ({
        async start(): Promise<void> {
            calculateTextProperties();
            const animation = svgTextRef.current!.animate([
                { offset: 0, strokeDashoffset: strokeDashLengthRef.current, fillOpacity: 0 },
                { offset: 0.25, fillOpacity: 0 },
                { offset: 1, strokeDashoffset: 0, fillOpacity: 1 }
            ], {
                duration: 2000, easing: 'ease-out', fill: 'both', delay: 500
            });;
            await animation.finished;
        },
        async reverse() {
            const animation = svgTextRef.current!.animate([
                { offset: 0, strokeDashoffset: 0, fillOpacity: 1 },
                { offset: 0.75, fillOpacity: 0 },
                { offset: 1, strokeDashoffset: strokeDashLengthRef.current, fillOpacity: 0 }
            ], {
                delay: 500, duration: 2000 / 3, easing: 'ease-out', fill: 'both'
            });
            await animation.finished;
            resetTextProperties();
        }
    }), []);

    return <svg ref={svgElementRef} css={style} viewBox="0 0 0 0">
        <text ref={svgTextRef} style={fontStyles}
            fill={color} stroke={color} fillOpacity="0"
            strokeWidth={strokeWidth} fontSize={fontStyles?.fontSize}
        >{children}</text>
    </svg>
});

export default AnimatedSvgText;