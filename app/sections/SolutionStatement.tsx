import TrigCircle from "@/app/components/TrigCircle";
import {css} from "@emotion/react";
import React, {useRef} from "react";
import {useScroll, useTransform} from "motion/react";
import {Angle} from "svg-path-kit";
import RadialReveal from "@/app/components/RadialReveal";
import SvgCircularText from "@/app/components/SvgCircularText";

const VIEW_BOX_START = 0;
const VIEW_BOX_SIZE = 100;
const TRIG_CIRCLE_RADIUS = 0.4 * VIEW_BOX_SIZE;
const CIRCLE_CENTER = VIEW_BOX_START + VIEW_BOX_SIZE / 2;
const ANGLE_RANGE: [number, number] = [-Math.PI, Math.PI];

export default function SolutionStatement() {
	const targetRef = useRef<HTMLDivElement>(null);
	const {scrollYProgress} = useScroll({target: targetRef, offset: ["start 75%", "end 25%"]});
	const theta = useTransform(scrollYProgress, [0, 1], ANGLE_RANGE);
	const angle = useTransform(theta, Angle.of);

	const firstText = "Precision & care";
	const charAngle = 0.06;
	const firstTextEndAngle = -(Math.PI / 2 - charAngle * (" care".length + 0.65));
	const firstTxtSweptAngle = charAngle * firstText.length;
	const firstTxtStartAngle = useTransform(angle, a => {
		const angleValue = Math.min(+a, firstTextEndAngle);
		const startValue = -178 * Math.PI / 180;
		const diff = (angleValue - startValue) - firstTxtSweptAngle;
		return diff > 0 ? `${startValue + diff}rad` : `${startValue}rad`;
	});
	const secondTxtStartAngle = firstTextEndAngle + charAngle;

	return <section>
		<div css={css`
            display: flex;
            justify-content: center;
		`}>
			<div ref={targetRef} css={css`
                flex-basis: 768px;
                height: 100%;
                display: flex;
                align-items: center;
			`}>
				<svg width="100%" viewBox={`${VIEW_BOX_START} ${VIEW_BOX_START} ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`} css={css`
					will-change: transform;
				`}>
					<RadialReveal
						angle={angle} startAngle={ANGLE_RANGE[0]}
						centerX={CIRCLE_CENTER}
						centerY={CIRCLE_CENTER}
						radius={TRIG_CIRCLE_RADIUS + 10}
						frontLayer={<>
							{/*<SvgCircularText*/}
							{/*	radius={TRIG_CIRCLE_RADIUS + 2.5}*/}
							{/*	centerX={CIRCLE_CENTER}*/}
							{/*	centerY={CIRCLE_CENTER}*/}
							{/*	startAngle="-175deg" sweptAngle="128deg"*/}
							{/*	fontSize={4}*/}
							{/*	// color="var(--muted-foreground)"*/}
							{/*	color="var(--primary-600)"*/}
							{/*>{"Precision & care that AI can't match."}</SvgCircularText>*/}
							<SvgCircularText
								radius={TRIG_CIRCLE_RADIUS + 2.5}
								centerX={CIRCLE_CENTER}
								centerY={CIRCLE_CENTER}
								startAngle={firstTxtStartAngle} charAngle={`${charAngle}rad`}
								fontSize={4}
								color="var(--primary-600)"
							>{firstText}</SvgCircularText>
							<SvgCircularText
								radius={TRIG_CIRCLE_RADIUS + 2.5}
								centerX={CIRCLE_CENTER}
								centerY={CIRCLE_CENTER}
								startAngle={`${secondTxtStartAngle}rad`} charAngle={`${charAngle}rad`}
								fontSize={4}
								color="var(--primary-600)"
							>{"that AI can't match."}</SvgCircularText>
						</>}
					/>
					<TrigCircle
						angle={angle}
						startX={VIEW_BOX_START} startY={VIEW_BOX_START}
						size={VIEW_BOX_SIZE}
						radius={TRIG_CIRCLE_RADIUS}
						strokeColor="var(--neutral-700)"
						fillColor="oklch(from var(--neutral-900) l c h / 0.5)"
						textColor="var(--neutral-500)"
					/>
				</svg>
			</div>
		</div>
	</section>
};