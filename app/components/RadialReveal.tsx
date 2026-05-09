import {motion, useTransform} from "motion/react";
import React from "react";
import {MotionValue} from "motion";
import {Angle} from "svg-path-kit";

export type RadialRevealProps = {
	angle: MotionValue<Angle>;
	startAngle?: number;
	centerX: number;
	centerY: number;
	radius: number;
	frontLayer?: SvgChild | SvgChild[];
	backLayer?: SvgChild | SvgChild[];
};

type SvgChild = React.ReactElement<React.SVGProps<SVGElement>>;
export default function RadialReveal({ angle, startAngle: startAngleValue = 0, centerX, centerY, radius, frontLayer, backLayer }: RadialRevealProps) {
	const startAngle = Angle.of(startAngleValue);
	const frontClipPath = useTransform(
		angle,
		(a) => {
			return `
			M ${centerX} ${centerY}
			l ${radius * startAngle.cosine} ${radius * startAngle.sine}
			A ${radius} ${radius} 0 ${+a - +startAngle > Math.PI ? 1 : 0} 1 ${centerX + radius * a.cosine} ${centerY + radius * a.sine}
			`;
		}
	);

	return <>
		<defs>
			<clipPath id="front-clip-path">
				<motion.path d={frontClipPath}></motion.path>
			</clipPath>
		</defs>
		<g clipPath="url(#front-clip-path)">
			{frontLayer}
		</g>
	</>;
};