import React from "react";
import {css} from "@emotion/react";
import {motion, MotionStyle, useTransform} from "motion/react";
import {MotionValue} from "motion";

// type CSSAngle = `${number}${'deg' | 'rad' | 'grad' | 'turn'}`;
export type SvgCircularTextProps = {
	centerX: number;
	centerY: number;
	radius: number;
	startAngle: number | string | MotionValue<number> | MotionValue<string>;
	sweptAngle: number | string;
	children?: string | string[];
	color?: string;
	fontSize: number | string;
} & React.SVGTextElementAttributes<SVGTextElement>;

export default function SvgCircularText({
	centerX, centerY, radius,
	startAngle, sweptAngle,
	children, color = "currentColor",
	fontSize, fontFamily = "monospace", ...props
}: SvgCircularTextProps) {
	const letters = Array.from(children ?
		typeof children === "string" ? children :
			Array.isArray(children) ? (children as any[]).join("") :
				"" :
		"");
	function getTransform(startTheta: number | string) {
		startTheta = typeof startTheta === "number" ? `${startTheta}deg` : startTheta;
		const sweptTheta = typeof sweptAngle === "number" ? `${sweptAngle}deg` : sweptAngle;
		return `
			translate(calc(${centerX}px - 50%), calc(${centerY}px - 50%))
			rotate(calc(90deg + ${startTheta} + ${sweptTheta} / ${letters.length} * var(--index)))
			translateY(-${radius}px)
		`;
	}
	const transform = startAngle instanceof MotionValue ?
		useTransform(startAngle as MotionValue<string | number>, getTransform) :
		getTransform(startAngle);

	return <g
		fill={color} fontFamily={fontFamily}
		fontSize={fontSize}
		{...props}
		css={css`
			text {
				transform-box: fill-box;
				transform-origin: 50% 50%;
			}
		`}
	>
		{letters.map((letter, i) => letter === " " ?
			null :
			<motion.text
				key={i}
				x="0" y={fontSize}
				style={{
					['--index' as keyof MotionStyle]: i,
					transform
				}}
			>{letter}</motion.text>
		)}
	</g>;
};