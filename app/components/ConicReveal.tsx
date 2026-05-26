import {motion, useTransform} from "motion/react";
import React from "react";
import {MotionValue} from "motion";
import {Angle, Point2D, Vector2D} from "svg-path-kit";
import {round} from "svg-path-kit/numbers";

export type RadialRevealProps = {
	angle: MotionValue<Angle>;
	startAngle?: number;
	centerX: number;
	centerY: number;
	radius: number;
	frontLayer?: SvgChild | SvgChild[];
	backLayer?: SvgChild | SvgChild[];
};

const roundOff = (num: number) => round(num, 4);

type SvgChild = React.ReactElement<React.SVGProps<SVGElement>>;
export default function ConicReveal({ angle, startAngle: startAngleValue = 0, centerX, centerY, radius, frontLayer, backLayer }: RadialRevealProps) {
	const center = Point2D.of(centerX, centerY);
	const startPolarVector = Vector2D.polar(radius, startAngleValue);
	const backClipPath = useTransform(
		angle,
		a => {
			const arcEnd = center.add(startPolarVector);
			return `
			M ${center.x} ${center.y}
			l ${roundOff(radius * a.cosine)} ${roundOff(radius * a.sine)}
			A ${radius} ${radius} 0 ${+a - startAngleValue > Math.PI ? 0 : 1} 1 ${roundOff(arcEnd.x)} ${roundOff(arcEnd.y)}
			`;
		}
	);
	const frontClipPath = useTransform(
		angle,
		a => {
			return `
			M ${center.x} ${center.y}
			l ${roundOff(startPolarVector.x)} ${roundOff(startPolarVector.y)}
			A ${radius} ${radius} 0 ${+a - startAngleValue > Math.PI ? 1 : 0} 1 ${roundOff(centerX + radius * a.cosine)} ${roundOff(centerY + radius * a.sine)}
			`;
		}
	);

	return <>
		<defs>
			<clipPath id="back-clip-path">
				<motion.path d={backClipPath}></motion.path>
			</clipPath>
			<clipPath id="front-clip-path">
				<motion.path d={frontClipPath}></motion.path>
			</clipPath>
		</defs>
		<g clipPath="url(#back-clip-path)">
			{backLayer}
		</g>
		<g clipPath="url(#front-clip-path)">
			{frontLayer}
		</g>
	</>;
};