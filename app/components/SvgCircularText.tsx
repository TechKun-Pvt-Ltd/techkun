import React from "react";
import {css} from "@emotion/react";
import {motion} from "motion/react";
import {MotionValue} from "motion";

// type CSSAngle = `${number}${'deg' | 'rad' | 'grad' | 'turn'}`;
export type SvgCircularTextProps = {
	centerX: number;
	centerY: number;
	radius: number;
	startAngle: string | MotionValue<string>;
	charAngle: string;
	children?: string | string[];
	color?: string;
	fontSize: number | string;
} & React.SVGTextElementAttributes<SVGTextElement>;

export default function SvgCircularText({
	centerX, centerY, radius,
	startAngle, charAngle,
	children, color = "currentColor",
	fontSize, fontFamily = "monospace",
	style, ...props
}: SvgCircularTextProps) {
	const letters = Array.from(children ?
		typeof children === "string" ? children :
			Array.isArray(children) ? (children as any[]).join("") :
				"" :
		"");

	return <motion.g
		fill={color} fontFamily={fontFamily}
		fontSize={fontSize}
		{...props as any}
		style={{
			...style,
			'--start-angle': startAngle,
			'--char-angle': charAngle
		}}
		css={css`
			--center-x: ${centerX}px;
			--center-y: ${centerY}px;
			text {
				transform:
					translate(calc(var(--center-x) - 50%), calc(var(--center-y) - 50%))
                	rotate(calc(90deg + var(--start-angle) + var(--char-angle) * (var(--index) + 0.5)))
                	translateY(-${radius}px);
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
					'--index': i
				} as React.CSSProperties}
			>{letter}</motion.text>
		)}
	</motion.g>;
};