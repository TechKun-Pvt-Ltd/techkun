import TrigCircle from "@/app/components/TrigCircle";
import {css} from "@emotion/react";
import React, {useRef} from "react";
import {useScroll, useTransform} from "motion/react";
import {Angle} from "svg-path-kit";
import RadialReveal from "@/app/components/RadialReveal";
import SvgCircularText from "@/app/SvgCircularText";

const VIEW_BOX_START = 0;
const VIEW_BOX_SIZE = 100;
const TRIG_CIRCLE_RADIUS = 0.4 * VIEW_BOX_SIZE;
const CIRCLE_CENTER = VIEW_BOX_START + VIEW_BOX_SIZE / 2;
const ANGLE_RANGE: [number, number] = [-Math.PI, Math.PI];

export default function SolutionStatement() {
	const targetRef = useRef<HTMLDivElement>(null);
	const {scrollYProgress} = useScroll({target: targetRef, offset: ["start 75%", "end 25%"]});
	const theta = useTransform(scrollYProgress, [0, 1], ANGLE_RANGE);
	const angle = useTransform(theta, t => Angle.of(t));

	const firstQdrtTxtSwptAngle = 55 * Math.PI / 180;
	const firstQdrtTxtStrtAngle = useTransform(angle, a => {
		const angleValue = Math.min(+a, -Math.PI / 2);
		const startValue = -175 * Math.PI / 180;
		const diff = (angleValue - startValue) - (firstQdrtTxtSwptAngle - Math.PI / 180);
		return diff > 0 ? `${startValue + diff}rad` : `${startValue}rad`;
	});

	return <section>
		<div css={css`
            display: flex;
            justify-content: center;
		`}>
			<div ref={targetRef} css={css`
                position: relative;
                flex-basis: 768px;
                height: 100%;
                display: flex;
                align-items: center;
			`}>
				<TrigCircle
					angle={angle}
					viewBoxStart={VIEW_BOX_START} viewBoxSize={VIEW_BOX_SIZE}
					radius={TRIG_CIRCLE_RADIUS}
					strokeColor="var(--neutral-700)"
					fillColor="oklch(from var(--neutral-900) l c h / 0.5)"
					textColor="var(--neutral-500)"
				>
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
								startAngle={firstQdrtTxtStrtAngle} sweptAngle={`${firstQdrtTxtSwptAngle}rad`}
								fontSize={4}
								color="var(--primary-600)"
							>Precision & care</SvgCircularText>
							<SvgCircularText
								radius={TRIG_CIRCLE_RADIUS + 2.5}
								centerX={CIRCLE_CENTER}
								centerY={CIRCLE_CENTER}
								startAngle="-86deg" sweptAngle="64deg"
								fontSize={4}
								color="var(--primary-600)"
							>{"that AI can't match."}</SvgCircularText>
						</>}
					/>
				</TrigCircle>
			</div>
		</div>
	</section>
};