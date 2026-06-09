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
	const semicircleThreshold = Angle.of(startAngleValue + Math.PI);
	const endAngle = Angle.of(startAngleValue + 2 * Math.PI)
	const semicirclePoint = center.add(Vector2D.polar(radius, semicircleThreshold));
	const circleEnd = center.add(Vector2D.polar(radius, endAngle));
	const backClipPath = useTransform(
		angle,
		a => {
			const firstArc = +a < +semicircleThreshold ?
				`A ${radius} ${radius} 0 0 1 ${roundOff(semicirclePoint.x)} ${roundOff(semicirclePoint.y)}` :
				`a 0 0 0 0 1 0 0`;
			return `
			M ${center.x} ${center.y}
			l ${roundOff(radius * a.cosine)} ${roundOff(radius * a.sine)}
			${firstArc}
			A ${radius} ${radius} 0 0 1 ${roundOff(circleEnd.x)} ${roundOff(circleEnd.y)}
			Z
			`;
		}
	);
	const frontClipPath = useTransform(
		angle,
		a => {
			if (+a > +endAngle)
				a = endAngle;

			const firstArcAngle = +a < +semicircleThreshold ? a : semicircleThreshold;
			const secondArc = firstArcAngle === semicircleThreshold ?
				`A ${radius} ${radius} 0 0 1 ${roundOff(center.x + radius * a.cosine)} ${roundOff(center.y + radius * a.sine)}` :
				`a 0 0 0 0 1 0 0`;
			return `
			M ${center.x} ${center.y}
			l ${roundOff(startPolarVector.x)} ${roundOff(startPolarVector.y)}
			A ${radius} ${radius} 0 ${+firstArcAngle > Math.PI ? 1 : 0} 1 ${roundOff(center.x + radius * firstArcAngle.cosine)} ${roundOff(center.y + radius * firstArcAngle.sine)}
			${secondArc}
			Z
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