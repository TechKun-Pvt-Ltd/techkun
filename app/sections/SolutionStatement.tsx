import TrigCircle from "@/app/components/TrigCircle";
import {css} from "@emotion/react";
import React, {useEffect, useRef} from "react";
import {
	animate,
	AnimationPlaybackControlsWithThen, inView,
	motion,
	useMotionValue,
	useScroll,
	useTransform, ValueAnimationTransition
} from "motion/react";
import {Angle} from "svg-path-kit";
import ConicReveal from "@/app/components/ConicReveal";
import SvgCircularText from "@/app/components/SvgCircularText";

const IDLE_ANIMATION_REPEAT_DELAY = 8;
function SPRING_OPTIONS(duration: number): ValueAnimationTransition {
	return {
		type: "spring",
		bounce: 0,
		duration
	};
}
const idleAnimationOptions: ValueAnimationTransition = {
	...SPRING_OPTIONS(2),
	repeat: Infinity,
	repeatType: 'loop',
	repeatDelay: IDLE_ANIMATION_REPEAT_DELAY
};

function SectionHeading() {
	const activeAnimation = useRef<AnimationPlaybackControlsWithThen>(null);
	const strokeDashoffset = useMotionValue(11);
	function setActiveAnimation(anim: AnimationPlaybackControlsWithThen) {
		activeAnimation.current?.stop();
		activeAnimation.current = anim;
	}

	useEffect(() => inView(
		"svg.w-graph-svg",
		() => setActiveAnimation(animate(strokeDashoffset, [11, -11], idleAnimationOptions)),
		{ margin: "-10% 0%" }
	), []);

	function fillPath() {
		const value = strokeDashoffset.get();
		if (value >= 0) {
			setActiveAnimation(animate(strokeDashoffset, 0, SPRING_OPTIONS(value / 11)));
			return;
		}

		setActiveAnimation(animate([
			[strokeDashoffset, -11, SPRING_OPTIONS((value + 11) / 11)],
			[strokeDashoffset, [11, 0], SPRING_OPTIONS(1)]
		]));
	}
	function emptyPath() {
		const value = strokeDashoffset.get();
		const animation = animate(strokeDashoffset, -11, SPRING_OPTIONS((value + 11) / 11));
		setActiveAnimation(animation);
		animation.finished.then(() =>
			setActiveAnimation(animate(strokeDashoffset, [11, -11], {...idleAnimationOptions, delay: IDLE_ANIMATION_REPEAT_DELAY}))
		);
	}

	return <h1 className="section-title">
		Start funding <span style={{whiteSpace: 'nowrap'}}>gro
		<motion.svg className="w-graph-svg"
			xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 10"
			css={css`
				width: 1em;
				vertical-align: -0.0625em;
			`}
			onHoverStart={fillPath}
			onHoverEnd={emptyPath}
		>
			<defs>
				<path id="w-graph"
					  d="M 1 5 L 2 3 L 4.25 9 L 6 4.5 L 7.75 9 L 11 1 L 9.4216 2.2283 L 11 1 L 11.2746 2.9811"
					  pathLength="10" strokeWidth="0.6" strokeLinejoin="round" strokeLinecap="round"
					  fill="transparent"
				/>
			</defs>
			<use href="#w-graph" stroke="currentColor"/>
			<motion.use href="#w-graph" stroke="var(--primary-400)"
						strokeDasharray="11 11"
						style={{strokeDashoffset}}
			/>
		</motion.svg>
		th.</span>
	</h1>;
}

const VIEW_BOX_START = 0;
const VIEW_BOX_SIZE = 100;
const TRIG_CIRCLE_RADIUS = 0.4 * VIEW_BOX_SIZE;
const CIRCLE_CENTER = VIEW_BOX_START + VIEW_BOX_SIZE / 2;
const ANGLE_RANGE: [number, number] = [-Math.PI, Math.PI];

const svgSizeProp = "--_svg-size";
export default function SolutionStatement() {
	const targetRef = useRef<HTMLDivElement>(null);
	const {scrollYProgress} = useScroll({target: targetRef, offset: ["start 60%", "end 40%"]});
	const theta = useTransform(scrollYProgress, [0, 1], ANGLE_RANGE);
	const angle = useTransform(theta, Angle.of);

	const firstText = "Precision & care that AI can't match.";
	const charAngle = 0.06;
	const firstTextEndAngle = Math.PI - charAngle * 0.5;//-(Math.PI / 2 - charAngle * (" care".length + 0.65));
	const firstTxtSweptAngle = charAngle * firstText.length;
	const firstTxtStartAngle = useTransform(angle, a => {
		const angleValue = Math.min(+a, firstTextEndAngle);
		const startValue = -178 * Math.PI / 180;
		const diff = (angleValue - startValue) - firstTxtSweptAngle;
		return diff > 0 ? `${startValue + diff}rad` : `${startValue}rad`;
	});
	// const secondTxtStartAngle = firstTextEndAngle + charAngle;

	return <section css={css`
        padding-block: 96px;
	`}>
		<div css={css`
            display: flex;
			flex-direction: column;
			gap: 80px;
		`}>
			<SectionHeading />
			<div ref={targetRef} css={css`
                display: flex;
                justify-content: center;
				align-items: start;
				height: 300vh;
			`}>
				<div css={css`
					position: sticky;
					top: 0;
					height: 100vh;
					${svgSizeProp}: clamp(320px, min(var(--page-max-width), 100vw, 100vh - var(--navbar-height)), 768px);
					margin-block: calc(-1 * (50vh - var(${svgSizeProp}) / 2));
					width: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					pointer-events: none;
				`}>
					<svg css={css`
                        pointer-events: auto;
                        position: absolute;
                        width: 100vw;
                        height: 1px;
					`}>
						<line x1="0%" y1="50%" x2="100%" y2="50%" strokeWidth="10" stroke="var(--neutral-700)" strokeDasharray="16" />
					</svg>
					{/*<div css={css`*/}
					{/*	height: var(${svgSizeProp});*/}
					{/*	position: absolute;*/}
					{/*	left: 0; right: 0;*/}
					{/*	display: grid;*/}
					{/*	grid-template-rows: 1fr 1fr;*/}
					{/*	grid-template-columns: 1fr 1fr;*/}
					{/*	h3 {*/}
					{/*		&:nth-of-type(3) {*/}
					{/*			grid-column: -1 / -2;*/}
					{/*		}*/}
					{/*		&:nth-of-type(4) {*/}
					{/*			grid-column: 1 / 2;*/}
					{/*		}*/}
					{/*		&:nth-of-type(3),*/}
					{/*		&:nth-of-type(4) {*/}
					{/*			grid-row: 2 / span 1;*/}
					{/*		}*/}
					{/*		&:nth-of-type(4n + 2),*/}
					{/*		&:nth-of-type(4n + 3) {*/}
					{/*			text-align: right;*/}
					{/*		}*/}
                    {/*        :nth-of-type(4n + 3),*/}
                    {/*        :nth-of-type(4n + 4) {*/}
					{/*			align-content: end;*/}
					{/*		}*/}
					{/*	}*/}
					{/*`}>*/}
					{/*	<h3 className="item-title">Research</h3>*/}
					{/*	<h3 className="item-title">Design</h3>*/}
					{/*	<h3 className="item-title">Engineer</h3>*/}
					{/*	<h3 className="item-title">Grow</h3>*/}
					{/*</div>*/}
					<svg viewBox={`${VIEW_BOX_START} ${VIEW_BOX_START} ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`}
						 css={css`
							 will-change: transform;
                             width: var(${svgSizeProp});
						 `}>
						<ConicReveal
							angle={angle} startAngle={ANGLE_RANGE[0]}
							centerX={CIRCLE_CENTER}
							centerY={CIRCLE_CENTER}
							radius={TRIG_CIRCLE_RADIUS + 10}
							frontLayer={<>
								<SvgCircularText
									radius={TRIG_CIRCLE_RADIUS + 2.5}
									centerX={CIRCLE_CENTER}
									centerY={CIRCLE_CENTER}
									startAngle={firstTxtStartAngle} charAngle={`${charAngle}rad`}
									fontSize={4}
									color="var(--primary-600)"
								>{firstText}</SvgCircularText>
							</>}
						/>
						<TrigCircle
							angle={angle}
							startX={VIEW_BOX_START} startY={VIEW_BOX_START}
							size={VIEW_BOX_SIZE}
							radius={TRIG_CIRCLE_RADIUS}
							strokeWidth="0.25"
							strokeColor="var(--neutral-700)"
							fillColor="oklch(from var(--neutral-900) l c h / 0.5)"
							textColor="var(--neutral-500)"
						/>
					</svg>
				</div>
			</div>
		</div>
	</section>
};