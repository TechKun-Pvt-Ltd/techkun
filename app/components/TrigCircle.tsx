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
	viewBoxSize?: number;
	viewBoxStart?: number;
	radius?: number;
	strokeColor?: string;
	fillColor?: string;
	textColor?: string;
	children?: SvgChild | SvgChild[];
};

type SvgChild = React.ReactElement<React.SVGProps<SVGElement>>;
export default function TrigCircle({
	angle,
	viewBoxSize = DEFAULT_SIZE,
	viewBoxStart = DEFAULT_START,
	radius = 0.4 * viewBoxSize,
	strokeColor = "currentColor",
	fillColor = "none",
	textColor = "currentColor",
	children
}: TrigCircleProps) {
	const END = viewBoxStart + viewBoxSize;
	const CENTER = viewBoxStart + viewBoxSize / 2;

	const [thetaStr, xCoord, yCoord, displayedTheta] = useMappedValues(angle, a => {
		const angleValue = +a;
		return [
			`${angleValue}rad`,
			CENTER + radius * a.cosine,
			CENTER + radius * a.sine,
			round(angleValue, 4)
		];
	});

	const rotatingLineStyles: MotionStyle = {
		rotate: thetaStr,
		transformBox: 'view-box'
	};

	return <svg width="100%" viewBox={`${viewBoxStart} ${viewBoxStart} ${viewBoxSize} ${viewBoxSize}`} css={css`
        will-change: transform;
	`}>
		{children}
		<g stroke={strokeColor} strokeWidth="0.25" fill="none">
			<circle r={radius} cx={CENTER} cy={CENTER} fill={fillColor}></circle>
			<line x1={viewBoxStart} y1={CENTER} x2={END} y2={CENTER}></line>
			<line x1={CENTER} y1={viewBoxStart} x2={CENTER} y2={END}></line>
			<motion.line
				x1={CENTER} y1={CENTER}
				x2={END} y2={CENTER}
				strokeDasharray="2"
				style={rotatingLineStyles}
			></motion.line>
			<motion.line
				x1={CENTER} y1={CENTER}
				x2={CENTER + radius} y2={CENTER}
				style={rotatingLineStyles}
			></motion.line>
			<motion.line
				x1={xCoord} y1={CENTER}
				x2={xCoord} y2={yCoord}
				strokeDasharray="2"
			></motion.line>
			<motion.line
				x1={CENTER} y1={yCoord}
				x2={xCoord} y2={yCoord}
				strokeDasharray="2"
			></motion.line>
		</g>
		<motion.circle
			r={1} cx={xCoord} cy={yCoord}
			fill={strokeColor}
		></motion.circle>
		<motion.text
			x={CENTER + 2} y={CENTER - 2}
			fill={textColor}
			fontSize="2"
		>
			{displayedTheta}
		</motion.text>
	</svg>;
};