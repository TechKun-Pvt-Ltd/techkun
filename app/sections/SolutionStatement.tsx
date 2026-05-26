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
		Stop doing that.<br/>Start funding <span style={{whiteSpace: 'nowrap'}}>gro
		<motion.svg className="w-graph-svg"
			xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 10"
			css={css`
				width: 1em;
				margin-block-end: -0.0625em;
			`}
			onHoverStart={fillPath}
			onHoverEnd={emptyPath}
		>
			<defs>
				<path id="w-graph"
					  d="M 1 5 L 2 3 L 4.25 9 L 6 4.5 L 7.75 9 L 11 1 L 9.4216 2.2283 L 11 1 L 11.2746 2.9811"
					  pathLength="10" strokeWidth="0.5" strokeLinejoin="round" strokeLinecap="round"
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

export default function SolutionStatement() {
	const targetRef = useRef<HTMLDivElement>(null);
	const {scrollYProgress} = useScroll({target: targetRef, offset: ["start 60%", "end 40%"]});
	const theta = useTransform(scrollYProgress, [0, 1], ANGLE_RANGE);
	const angle = useTransform(theta, Angle.of);

	const firstText = "Precision & care";
	const charAngle = 0.06;
	const firstTextEndAngle = 0 - charAngle * 0.5;//-(Math.PI / 2 - charAngle * (" care".length + 0.65));
	const firstTxtSweptAngle = charAngle * firstText.length;
	const firstTxtStartAngle = useTransform(angle, a => {
		const angleValue = Math.min(+a, firstTextEndAngle);
		const startValue = -178 * Math.PI / 180;
		const diff = (angleValue - startValue) - firstTxtSweptAngle;
		return diff > 0 ? `${startValue + diff}rad` : `${startValue}rad`;
	});
	const secondTxtStartAngle = firstTextEndAngle + charAngle;

	return <section css={css`
        padding-block: 48px;
	`}>
		<div css={css`
            display: flex;
			flex-direction: column;
			gap: 80px;
		`}>
			<SectionHeading />
			<div ref={targetRef} css={css`
				align-self: stretch;
                display: flex;
                justify-content: center;
				align-items: start;
				height: 4096px;
			`}>
				<div css={css`
					position: sticky;
					top: calc(var(--navbar-height) + 80px);
                    width: 100%;
                    max-width: 768px;
					display: flex;
					justify-content: center;
					align-items: center;
				`}>
					<svg css={css`
						position: absolute;
						width: 100vw;
						height: 10px;
					`}>
						<line x1="0%" y1="50%" x2="100%" y2="50%" strokeWidth="2" stroke="var(--neutral-900)" strokeDasharray="16" />
					</svg>
					<svg width="100%" viewBox={`${VIEW_BOX_START} ${VIEW_BOX_START} ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`}
						 css={css`
							 will-change: transform;
						 `}>
						<ConicReveal
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
		</div>
	</section>
};