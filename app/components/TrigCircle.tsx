import {motion, MotionStyle, useTransform} from "motion/react";
import React from "react";
import {css} from "@emotion/react";
import {round} from "svg-path-kit/numbers";
import {Angle} from "svg-path-kit";
import {MotionValue} from "motion";
import {useMappedValues} from "@/app/utils/use-mapped-values";

const DEFAULT_START = 0;
const DEFAULT_SIZE = 100;

export type TrigCircleProps = {
	angle: MotionValue<Angle>;
	startX?: number;
	startY?: number;
	size?: number;
	radius?: number;
	strokeWidth?: number | string;
	strokeColor?: string;
	fillColor?: string;
	textColor?: string;
};

export default function TrigCircle({
	angle,
	size = DEFAULT_SIZE,
	startX = DEFAULT_START,
	startY = DEFAULT_START,
	radius = 0.4 * size,
	strokeWidth = "0.25",
	strokeColor = "currentColor",
	fillColor = "none",
	textColor = "currentColor"
}: TrigCircleProps) {
	const END_X = startX + size;
	const END_Y = startY + size;
	const CENTER_X = startX + size / 2;
	const CENTER_Y = startY + size / 2;

	const [thetaStr, xCoord, yCoord, displayedTheta] = useMappedValues(angle, a => {
		const angleValue = +a;
		return [
			`${angleValue}rad`,
			CENTER_X + radius * a.cosine,
			CENTER_Y + radius * a.sine,
			round(angleValue, 4)
		];
	});

	const rotatingLineStyles: MotionStyle = {
		rotate: thetaStr,
		transformBox: 'view-box'
	};

	return <g>
		<g stroke={strokeColor} strokeWidth={strokeWidth} fill="none">
			<circle r={radius} cx={CENTER_X} cy={CENTER_Y} fill={fillColor}></circle>
			<line x1={startX} y1={CENTER_Y} x2={END_X} y2={CENTER_Y}></line>
			<line x1={CENTER_X} y1={startY} x2={CENTER_X} y2={END_Y}></line>
			<motion.line
				x1={CENTER_X} y1={CENTER_Y}
				x2={END_X} y2={CENTER_Y}
				strokeDasharray="2"
				style={rotatingLineStyles}
			></motion.line>
			<motion.line
				x1={CENTER_X} y1={CENTER_Y}
				x2={CENTER_X + radius} y2={CENTER_Y}
				style={rotatingLineStyles}
			></motion.line>
			<motion.line
				x1={xCoord} y1={CENTER_Y}
				x2={xCoord} y2={yCoord}
				strokeDasharray="2"
			></motion.line>
			<motion.line
				x1={CENTER_X} y1={yCoord}
				x2={xCoord} y2={yCoord}
				strokeDasharray="2"
			></motion.line>
		</g>
		<motion.circle
			r={1} cx={xCoord} cy={yCoord}
			fill={strokeColor}
		></motion.circle>
		<motion.text
			x={CENTER_X + 2} y={CENTER_Y - 2}
			fill={textColor}
			fontSize="2"
		>
			{displayedTheta}
		</motion.text>
	</g>;
};

function TrigCircle2() {
	return ;
}