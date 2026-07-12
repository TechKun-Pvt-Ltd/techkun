import {css} from "@emotion/react";
import React, {useEffect, useRef} from "react";
import {
	animate,
	AnimationPlaybackControlsWithThen, inView,
	motion,
	useMotionValue,
	useScroll, useTransform, ValueAnimationTransition
} from "motion/react";
import {Angle, Point2D, Vector2D} from "svg-path-kit";
import {useConicReveal} from "@/hooks/use-conic-reveal";
import TrigWheel from "@/app/components/TrigWheel";

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

const centerPoint = Point2D.of(CIRCLE_CENTER, CIRCLE_CENTER);

const icons = [
	{
		size: 5,
		position: centerPoint.add(Vector2D.polar(TRIG_CIRCLE_RADIUS, -7 * Math.PI / 8)),
		render() {
			return <svg
				x={this.position.x - this.size / 2} y={this.position.y - this.size * 0.44}
				width={this.size} height={this.size} viewBox="-6 -6 24 24"
				fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
				strokeLinejoin="round" preserveAspectRatio="xMidYMid"
			>
				<path d="M 0 0 C 0 -2.7614 2.2386 -5 5 -5 C 7.7614 -5 10 -2.7614 10 0 C 10 1.3261 9.4732 2.5979 8.5355 3.5355 C 7.5979 4.4732 7.0711 5.745 7.0711 7.0711 C 7.0711 8.2149 6.1438 9.1421 5 9.1421 C 3.8562 9.1421 2.9289 8.2149 2.9289 7.0711 C 2.9289 5.745 2.4021 4.4732 1.4645 3.5355 C 0.5268 2.5979 0 1.3261 0 0 M 6.4645 11.2855 C 6.0761 11.6739 5.5493 11.8921 5 11.8921 C 4.4507 11.8921 3.9239 11.6739 3.5355 11.2855 M 6.0355 14.1147 C 5.3947 14.4846 4.6053 14.4846 3.9645 14.1147"/>
			</svg>;
		}
	},
	{
		size: 4,
		position: centerPoint.add(Vector2D.polar(TRIG_CIRCLE_RADIUS, -6 * Math.PI / 8)),
		render() {
			return <svg
				x={this.position.x - this.size / 2} y={this.position.y - this.size / 2}
				width={this.size} height={this.size} viewBox="0 0 24 24"
				fill="none" stroke="currentColor" strokeWidth="2"
				strokeLinecap="round" strokeLinejoin="round"
			>
				<path
					d="M14.364 13.634a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506l4.013-4.009a1 1 0 0 0-3.004-3.004z"/>
				<path d="M14.487 7.858A1 1 0 0 1 14 7V2"/>
				<path
					d="M20 19.645V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l2.516 2.516"/>
				<path d="M8 18h1"/>
			</svg>;
		}
	}
];

const svgSizeProp = "--_svg-size";
export default function SolutionStatement() {
	const targetRef = useRef<HTMLDivElement>(null);
	const {scrollYProgress} = useScroll({target: targetRef, offset: ["start 60%", "end 40%"]});
	const theta = useTransform(scrollYProgress, [0, 1], ANGLE_RANGE);
	const angle = useTransform(theta, Angle.of);

	// const firstText = "Precision & care that AI can't match.";
	// const charAngle = 0.06;
	// const firstTextEndAngle = Math.PI - charAngle * 0.5;//-(Math.PI / 2 - charAngle * (" care".length + 0.65));
	// const firstTxtSweptAngle = charAngle * firstText.length;
	// const firstTxtStartAngle = useTransform(angle, a => {
	// 	const angleValue = Math.min(+a, firstTextEndAngle);
	// 	const startValue = -178 * Math.PI / 180;
	// 	const diff = (angleValue - startValue) - firstTxtSweptAngle;
	// 	return diff > 0 ? `${startValue + diff}rad` : `${startValue}rad`;
	// });
	// const secondTxtStartAngle = firstTextEndAngle + charAngle;

	const [frontClipPath, backClipPath] = useConicReveal({
		angle: angle,
		startAngle: ANGLE_RANGE[0],
		centerX: CIRCLE_CENTER,
		centerY: CIRCLE_CENTER,
		radius: TRIG_CIRCLE_RADIUS + 10
	});

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
						<defs>
							<clipPath id="back-clip-path">
								<motion.path d={backClipPath}></motion.path>
							</clipPath>
							<clipPath id="front-clip-path">
								<motion.path d={frontClipPath}></motion.path>
							</clipPath>
						</defs>
						<TrigWheel
							angle={angle}
							startX={VIEW_BOX_START} startY={VIEW_BOX_START}
							size={VIEW_BOX_SIZE} radius={TRIG_CIRCLE_RADIUS}
						>
							<g stroke="var(--neutral-700)" strokeWidth="0.25" fill="none">
								<TrigWheel.Circle fill="oklch(from var(--neutral-900) l c h / 0.5)" />
								<TrigWheel.XAxis />
								<TrigWheel.YAxis />
								<TrigWheel.RotorXProjection />
								<TrigWheel.RotorYProjection />
							</g>
							<g clipPath="url(#front-clip-path)">
								{/*<SvgCircularText*/}
								{/*	radius={TRIG_CIRCLE_RADIUS + 2.5}*/}
								{/*	centerX={CIRCLE_CENTER}*/}
								{/*	centerY={CIRCLE_CENTER}*/}
								{/*	startAngle={firstTxtStartAngle} charAngle={`${charAngle}rad`}*/}
								{/*	fontSize={4}*/}
								{/*	color="var(--primary-600)"*/}
								{/*>{firstText}</SvgCircularText>*/}
								{icons.map((icon, i) => (
									<React.Fragment key={i}>
										<circle cx={icon.position.x} cy={icon.position.y} r="4" />
										{icon.render()}
									</React.Fragment>
								))}
							</g>
							<g stroke="var(--neutral-700)" strokeWidth="0.25" fill="none">
								<TrigWheel.ExtendedRotor strokeDasharray="2" />
								<TrigWheel.Rotor />
							</g>
							<TrigWheel.RotorTerminal fill="var(--neutral-700)" />
							<TrigWheel.AngleLabel fontSize="2" fill="var(--neutral-500)" />
						</TrigWheel>
					</svg>
				</div>
			</div>
		</div>
	</section>
};