import {css} from "@emotion/react";
import React, {JSX, useEffect, useRef} from "react";
import {
	animate,
	AnimationPlaybackControlsWithThen,
	interpolate,
	inView,
	motion,
	useMotionValue,
	useScroll,
	useTransform,
	ValueAnimationTransition
} from "motion/react";
import {Angle, Point2D, Vector2D} from "svg-path-kit";
import {useConicReveal} from "@/hooks/use-conic-reveal";
import TrigWheel, {TrigAngleTransformer, useTrigWheel} from "@/app/components/TrigWheel";
import {round} from "svg-path-kit/numbers";
import {MotionValue} from "motion";
import {Once} from "@/components/Once";
import {deviceQuery} from "@/app/styles/device-query";
import cssSupportsQuery from "@/app/utils/css-supports-query";

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
const TRIG_CIRCLE_RADIUS = 0.435 * VIEW_BOX_SIZE;
const CIRCLE_CENTER = VIEW_BOX_START + VIEW_BOX_SIZE / 2;
const ANGLE_RANGE_START = 0;

const titles = [
	{ title: "User experience comes\u00A0first", subtitle: "We\u00A0investigate the user's\u00A0needs and\u00A0persona and create a\u00A0delightful human\u00A0experience for\u00A0them." },
	{ title: "Precision & care matters", subtitle: "Every shortcut is a sin. We engineer every detail and build smooth, robust foundations to grow upon." },
	{ title: "Document everything", subtitle: "We keep all our work documented and well-defined, as well as our processes. We\u00A0rely on systems, not memory." },
	{ title: "Identity", subtitle: "We investigate your idea, understand\u00A0its meaning, and create a visual\u00A0identity for it." }
];

function ClippedG({clipPathId, pathData, ...props}: {
	clipPathId: string;
	pathData: string | MotionValue<string>;
} & React.ComponentProps<"g">) {
	return <>
		<Once id={clipPathId}>
			<defs>
				<clipPath id={clipPathId}>
					<motion.path d={pathData} />
				</clipPath>
			</defs>
		</Once>
		<g clipPath={`url(#${clipPathId})`} {...props} />
	</>;
}

const MINUS_ONE_AND_ONE = [-1, 1] as const;

function IconRing({ radius, size = 4, renderers }: {
	radius: number;
	size: number;
	renderers: ((position: Point2D, size: number) => JSX.Element)[];
}) {
	const { center } = useTrigWheel();
	const HALF_PI = 0.5 * Math.PI;
	const RELATIVE_POSITION = Math.PI / 6 - Math.PI / 60;
	return renderers.map((render, i) => {
		const angle = Math.floor(i * 0.5) * HALF_PI + MINUS_ONE_AND_ONE[i % 2] * RELATIVE_POSITION;
		const position = center.add(Vector2D.polar(radius, angle));
		return <React.Fragment key={i}>
			{/*<circle cx={icon.position.x} cy={icon.position.y} r="4" />*/}
			{render(Point2D.of(round(position.x, 4), round(position.y, 4)), size)}
		</React.Fragment>
	});
}

function TextRing({radius, texts, charAngle, fontSize = 3}: {
	radius: number;
	texts: string[];
	charAngle: number;
	fontSize: number;
}) {
	return texts.map((text, i) => {
		const sweepDirection = MINUS_ONE_AND_ONE[Math.floor(i / 2) % 2];
		return <TrigWheel.Text
			key={text}
			startAngle={`${Math.PI / 4 + i * Math.PI / 2 + -sweepDirection * charAngle * text.length / 2}rad`}
			sweepDirection={sweepDirection}
			charAngle={charAngle + "rad"}
			radius={radius}
			fontSize={fontSize}
		>{text}</TrigWheel.Text>;
	});
}

const angleLabelTransformer: TrigAngleTransformer<number> = a => round(+a - Math.PI, 4);
function AngleLabel(props: React.ComponentProps<typeof motion.text>) {
	const { center, angle, getOrRegister } = useTrigWheel();
	return <motion.text
		x={center.x} y={center.y}
		css={css`
			font-weight: 600;
			transform-box: fill-box;
			transform: translate(-50%, 25%);
		`}
		{...props}
	>
		{angle && getOrRegister("angle-label", angleLabelTransformer)}
	</motion.text>;
}

const svgSizeProp = "--_svg-size";

const firstText = "Your product needs a";
const revealedText = "revolution";
const charAngle = 0.064;

export default function SolutionStatement() {
	const targetRef = useRef<HTMLDivElement>(null);
	const {scrollYProgress} = useScroll({target: targetRef, offset: ["start 50%", "end 60%"]});
	const angle = useTransform(scrollYProgress, sp => Angle.of(interpolate([0, 1], [ANGLE_RANGE_START, ANGLE_RANGE_START + 2 * Math.PI])(sp)));

	useEffect(() => {
		if (!targetRef.current) return;

		let currentIndex = 0;
		const groups = targetRef.current.querySelectorAll<HTMLDivElement>("div.title-group");
		queueMicrotask(() => groups.forEach(group => group.removeAttribute("data-initial")));
		function callback(a: Angle) {
			const targetIndex = Math.min(Math.floor((+a - ANGLE_RANGE_START) / +Angle.HALF_PI), groups.length - 1);
			if (targetIndex === currentIndex) return;

			groups.forEach((group, i) => {
				group.style.setProperty("--_switch", Math.sign(i - targetIndex).toString());
			});
			currentIndex = targetIndex;
		}
		callback(angle.get());
		return angle.on("change", callback);
	}, []);

	const [frontClipPath, backClipPath] = useConicReveal({
		angle: angle,
		startAngle: ANGLE_RANGE_START,
		centerX: CIRCLE_CENTER,
		centerY: CIRCLE_CENTER,
		radius: VIEW_BOX_SIZE / 2
	});

	const innerCircleRadius = TRIG_CIRCLE_RADIUS * 0.48;
	const innerCircle = <TrigWheel.Circle
		r={innerCircleRadius}
		fill="var(--_dial-fill-color)" stroke="var(--_stroke-color)"
		strokeWidth="0.25"
		strokeDasharray={`0 1 ${Math.PI * innerCircleRadius / 2 - 2} 2 ${Math.PI * innerCircleRadius / 2 - 2} 1`}
	/>;

	const radialBoxes = <>
		{/*<TrigWheel.RadialBox*/}
		{/*	radius={TRIG_CIRCLE_RADIUS * 0.6} angle={Math.PI + Math.PI / 3 + Math.PI / 30}*/}
		{/*	radialSize={TRIG_CIRCLE_RADIUS * 0.4} angularSize={Math.PI / 4}*/}
		{/*	rotationStartThreshold="0rad"*/}
		{/*	fill="var(--_fill-color)" stroke="var(--_stroke-color)"*/}
		{/*	strokeWidth="0.2"*/}
		{/*/>*/}
		{/*<TrigWheel.RadialBox*/}
		{/*	radius={TRIG_CIRCLE_RADIUS * 0.68} angle={Math.PI + Math.PI / 3 + Math.PI / 30 + Math.PI / 30}*/}
		{/*	radialSize={TRIG_CIRCLE_RADIUS * 0.24} angularSize={Math.PI / 4 - Math.PI / 15}*/}
		{/*	rotationStartThreshold="0rad"*/}
		{/*	fill="var(--_fill-color)" stroke="var(--_stroke-color)"*/}
		{/*	strokeWidth="0.2"*/}
		{/*/>*/}
		<TrigWheel.RadialBox
			radius={TRIG_CIRCLE_RADIUS * 0.6} angle={Math.PI + Math.PI / 3 + Math.PI / 30}
			radialSize={TRIG_CIRCLE_RADIUS * 0.4} angularSize={Math.PI / 4}
			rotationStartThreshold="0rad"
			fill="var(--_fill-color)" stroke="var(--_stroke-color)"
			strokeWidth="0.2"
		/>
		<TrigWheel.RadialBox
			radius={TRIG_CIRCLE_RADIUS * 0.6} angle={Math.PI}
			radialSize={TRIG_CIRCLE_RADIUS * 0.4} angularSize={Math.PI / 3}
			rotationStartThreshold="0rad"
			fill="var(--_fill-color)" stroke="var(--_stroke-color)"
			strokeWidth="0.2"
		/>
		{/*<TrigWheel.RadialBox*/}
		{/*	radius={TRIG_CIRCLE_RADIUS * 0.6} angle={Math.PI - (Math.PI / 4 + 2 * Math.PI / 30)}*/}
		{/*	radialSize={TRIG_CIRCLE_RADIUS * 0.4} angularSize={-Math.PI / 4}*/}
		{/*	rotationStartThreshold="0rad"*/}
		{/*	fill="var(--_fill-color)" stroke="var(--_stroke-color)"*/}
		{/*	strokeWidth="0.2"*/}
		{/*/>*/}
	</>;
	const radialBoxesTextBack = <>
		<TrigWheel.Text
			style={{ textTransform: "uppercase" }}
			radius={TRIG_CIRCLE_RADIUS * 0.9}
			startAngle={Math.PI * (1 + 1 / 45) + "rad"}
			rotationStartThreshold="0rad"
			charAngle={0.04 + "rad"} fontSize={2.5}
			color="var(--neutral-700)"
		>Forgettable experiences</TrigWheel.Text>
		<TrigWheel.Text
			style={{ textTransform: "uppercase" }}
			radius={TRIG_CIRCLE_RADIUS * 0.9}
			startAngle={Math.PI * (1 - 1 / 4.5) + "rad"}
			rotationStartThreshold="0rad"
			charAngle={0.04 + "rad"} fontSize={2.5}
			color="var(--neutral-700)"
		>Technical debts</TrigWheel.Text>
	</>;
	const radialBoxesTextFront = <>
		<TrigWheel.Text
			style={{ textTransform: "uppercase" }}
			radius={TRIG_CIRCLE_RADIUS * 0.9}
			startAngle={Math.PI * (1 + 1 / 3 - 1 / 30) + "rad"}
			rotationStartThreshold="0rad"
			sweepDirection="ccw"
			charAngle={0.04 + "rad"} fontSize={2.5}
			color="var(--secondary-neutral-700)"
		>Delightful experiences</TrigWheel.Text>
		<TrigWheel.Text
			style={{ textTransform: "uppercase" }}
			radius={TRIG_CIRCLE_RADIUS * 0.9}
			startAngle={(Math.PI - Math.PI / 22) + "rad"}
			rotationStartThreshold="0rad"
			sweepDirection="ccw"
			charAngle={0.04 + "rad"} fontSize={2.5}
			color="var(--secondary-neutral-700)"
		>Robust foundations</TrigWheel.Text>
	</>;

	const tinyRadialBoxes = <>
		<TrigWheel.RadialBox
			radius={TRIG_CIRCLE_RADIUS * 0.6} angle={Math.PI / 60}
			radialSize={TRIG_CIRCLE_RADIUS * 0.2} angularSize={Math.PI / 2.6}
			rotationStartThreshold="0rad"
			fill="var(--_fill-color)" stroke="var(--_stroke-color)"
			strokeWidth="0.2"
		/>
	</>;

	const dashedWheel = <TrigWheel.DashedWheel radius={TRIG_CIRCLE_RADIUS * 0.4} stroke="var(--_stroke-color)" />;

	const quotePart1 = "Design is not just what it looks and feels like";
	const quotePart2 = "Design is how it works";
	const quoteCharAngle = 0.064;

	return <section css={css`
        padding-block: 128px;
	`}>
		<div css={css`
            display: flex;
			flex-direction: column;
			gap: 80px;
		`}>
			<div>
				<h2 className="section-title" css={css`
					margin-block-end: 0.25em;
				`}>We're guided by<br/>the following principles</h2>
				<p className="text-lg" css={css`
					font-weight: 500;
					color: var(--secondary-neutral-300);
				`}>OUR PRINCIPLES</p>
			</div>
			<div ref={targetRef} css={css`
                display: flex;
                justify-content: center;
				align-items: start;
				height: 400vh;
			`}>
				<div css={css`
					position: sticky;
					top: 0;
					height: 100vh;
					${svgSizeProp}: clamp(320px, min(var(--page-max-width), 100vh - var(--navbar-height)), 768px);
					margin-block: calc(-1 * (50vh - var(${svgSizeProp}) / 2));
					width: 100%;
					align-content: center;
					pointer-events: none;
				`}>
					<div css={css`
						pointer-events: auto;
						height: var(${svgSizeProp});
						display: grid;
						grid-template-columns: 1fr;
						grid-template-rows: 12rem max-content;
						gap: 32px;
						@media ${deviceQuery.tablet} {
							grid-template-columns: 7fr 13fr;
							grid-template-rows: 1fr;
							align-items: center;
						}
					`}>
						<div css={css`
							align-self: stretch;
							position: relative;
							isolation: isolate;
							div.title-group {
								position: absolute;
								inset: 0;

								display: grid;
								grid-template-rows: 1fr 1fr;
								row-gap: 8px;
								@media ${deviceQuery.tablet} {
									row-gap: 32px;
								}

								transition: 0.3s ease;
								transition-property: transform, opacity, filter;
								&[data-initial] {
									transition: none;
								}

								--switch-abs: abs(var(--_switch));
								@supports not ${cssSupportsQuery.abs} {
									--switch-abs: max(var(--_switch), calc(-1 * var(--_switch)));
								}
								opacity: calc(1 - var(--switch-abs));
								filter: blur(calc(var(--switch-abs) * 10px));
								transform:
									translateY(calc(var(--_switch) * 25%))
									scale(calc(1 - var(--switch-abs) * 0.25));
								@media ${deviceQuery.tablet} {
									transform:
										translateX(calc(var(--_switch) * 25%))
										scale(calc(1 - var(--switch-abs) * 0.25));
								}

								& > h3.item-title {
									align-self: end;
								}
							}
						`}>
							{titles.map((item, i) => {
								return <div
									key={i}
									className="title-group"
									style={{ "--_switch": i === 0 ? 0 : 1 } as React.CSSProperties}
									data-initial
								>
									<h3 className="item-title">{item.title}</h3>
									<p className="item-subtitle">{item.subtitle}</p>
								</div>;
							})}
						</div>
						<div css={css`
							min-height: 0;
							isolation: isolate;
							display: flex;
							justify-content: center;
							align-items: center;
						`}>
							<svg css={css`
								position: absolute;
								z-index: -1;
								height: 1px;
								width: 200vw;
								margin-inline: -50vw;
							`}>
								<line x1="0%" y1="50%" x2="100%" y2="50%" strokeWidth="10" stroke="var(--neutral-700)" strokeDasharray="16" />
							</svg>
							<svg viewBox={`${VIEW_BOX_START} ${VIEW_BOX_START} ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`}
								 strokeLinejoin="round" strokeLinecap="round"
								 css={css`
									 width: 100%;
									 will-change: transform;
									 g.back-layer {
										 --_dial-fill-color: oklch(from var(--neutral-900) l c h / 0.25);
										 --_fill-color: oklch(from var(--neutral-900) l c h / 0.25);
										 --_stroke-color: oklch(from var(--neutral-800) l c h / 0.75);
									 }
									 g.front-layer {
										 --_dial-fill-color: oklch(from var(--secondary-neutral-900) l c h / 0.25);
										 --_fill-color: none;
										 --_stroke-color: oklch(from var(--secondary-neutral-800) l c h / 0.75);
									 }
								 `}
							>
								<TrigWheel
									angle={angle}
									startX={VIEW_BOX_START} startY={VIEW_BOX_START}
									size={VIEW_BOX_SIZE} radius={TRIG_CIRCLE_RADIUS}
								>
									<defs>
										<radialGradient id="brand-radial-gradient">
											<stop offset="-20%" stopColor="var(--secondary-neutral-800)" />
											<stop offset="80%" stopColor="var(--secondary-neutral-900)" />
										</radialGradient>
									</defs>
									<g stroke="var(--secondary-neutral-800)" strokeWidth="0.25" fill="none">
										<TrigWheel.XAxis />
										<TrigWheel.YAxis />
										<TrigWheel.RotorXProjection />
										<TrigWheel.RotorYProjection />
									</g>
									<ClippedG clipPathId="back-clip-path" pathData={backClipPath} className="back-layer">
										{innerCircle}
										{tinyRadialBoxes}
										{radialBoxes}
										{/*{radialBoxesTextBack}*/}
										{dashedWheel}
										<TrigWheel.Text
											style={{ textTransform: "uppercase" }}
											radius={TRIG_CIRCLE_RADIUS - 5}
											startAngle={`${charAngle * (firstText.length + 1)}rad`} charAngle={`${charAngle}rad`}
											rotationStartThreshold={`${charAngle}rad`} rotationEndThreshold={`${Math.PI - charAngle * (firstText.length + 1)}rad`}
											sweepDirection="ccw"
											fontSize={2.5}
											color="var(--neutral-400)"
										>{firstText}</TrigWheel.Text>
										<TrigWheel.Text
											radius={TRIG_CIRCLE_RADIUS * 0.54}
											charAngle={quoteCharAngle + "rad"} fontSize={2.5}
											startAngle={-(Math.PI / 2 + quoteCharAngle * quotePart1.length / 2) + "rad"}
											color="var(--neutral-600)"
										>{quotePart1}</TrigWheel.Text>
									</ClippedG>
									<ClippedG clipPathId="front-clip-path" pathData={frontClipPath} className="front-layer">
										<rect fill="url(#brand-radial-gradient)" fillOpacity="0.25" x="0%" y="0%" width="100%" height="100%" clipPath="url(#radial-boxes-clip-path)" />
										{innerCircle}
										{tinyRadialBoxes}
										{radialBoxes}
										<clipPath id="radial-boxes-clip-path">
											{radialBoxes}
										</clipPath>
										{/*{radialBoxesTextFront}*/}
										{dashedWheel}
										<TrigWheel.Text
											style={{ textTransform: "uppercase" }}
											radius={TRIG_CIRCLE_RADIUS - 5}
											startAngle={-" ".length * charAngle + "rad"} charAngle={`${charAngle}rad`}
											sweepDirection="ccw"
											rotationStartThreshold={"0rad"}
											fontSize={2.5}
											color="var(--secondary-neutral-200)"
										>{revealedText}</TrigWheel.Text>
										<TrigWheel.Text
											style={{ textTransform: "uppercase" }}
											radius={TRIG_CIRCLE_RADIUS - 5}
											startAngle={"0rad"} charAngle={`${charAngle}rad`}
											sweepDirection="ccw"
											rotationStartThreshold={(2 * Math.PI - charAngle * "LET'S KICKSTART YOUR".length) + "rad"}
											fontSize={2.5}
											color="var(--secondary-neutral-200)"
										>{"LET'S KICKSTART YOUR"}</TrigWheel.Text>
										<TrigWheel.Text
											radius={TRIG_CIRCLE_RADIUS * 0.54}
											charAngle={quoteCharAngle + "rad"} fontSize={2.5}
											startAngle={(3 * Math.PI / 2 - quoteCharAngle * quotePart1.length / 2) + "rad"}
											rotationStartThreshold={(3 * Math.PI / 2 - quoteCharAngle * (quotePart1.length / 2 - quotePart2.length - 1)) + "rad"}
											color="var(--secondary-neutral-600)"
										>{quotePart2}</TrigWheel.Text>
										{/*<g style={{ color: "var(--secondary-neutral-700)" }}>*/}
										{/*	<TextRing*/}
										{/*		radius={TRIG_CIRCLE_RADIUS * 1.12}*/}
										{/*		texts={["Ideate & document", "Sketch & blueprint", "Design & develop", "Refine & optimize"]}*/}
										{/*		charAngle={0.03} fontSize={2}*/}
										{/*	/>*/}
										{/*</g>*/}
									</ClippedG>
									<g stroke="var(--primary-900)" strokeWidth="0.25" fill="none">
										<TrigWheel.ExtendedRotor strokeDasharray="2" />
										<TrigWheel.Rotor style={{
											filter:
												"drop-shadow(0.3px 0.5px 0.7px oklch(from var(--primary-900) l c h / 0.32)) " +
												"drop-shadow(0.4px 0.8px 1px oklch(from var(--primary-900) l c h / 0.32)) " +
												"drop-shadow(1px 2px 2.5px oklch(from var(--primary-900) l c h / 0.32))"
										}}/>
									</g>
									<TrigWheel.Circle
										fill="var(--neutral-950)" stroke="var(--neutral-900)" strokeWidth="0.1"
										r={TRIG_CIRCLE_RADIUS * 0.32}
										// style={{
										// 	filter:
										// 		"drop-shadow(0.3px 0.5px 0.7px oklch(from var(--secondary-neutral-900) l c h / 0.16)) " +
										// 		"drop-shadow(0.4px 0.8px 1px oklch(from var(--secondary-neutral-900) l c h / 0.16)) " +
										// 		"drop-shadow(1px 2px 2.5px oklch(from var(--secondary-neutral-900) l c h / 0.16))"
										// }}
									/>
									<TrigWheel.Circle
										fill="none" stroke="var(--neutral-900)" strokeWidth="0.1"
										r={TRIG_CIRCLE_RADIUS * 0.24}
									/>
									<g css={css`
										--_radius: calc(0.2 * var(${TrigWheel.cssProps.radius}));
										--_gap: calc(0.2 * var(--_radius));
										--_circumference: calc(2 * pi * var(--_radius));
										.progress-indicator {
											--_angle: clamp(0deg, var(${TrigWheel.cssProps.angle}) - var(--i) * 90deg, 90deg);
											--_switch: round(down, var(--_angle) / (90deg), 1);
											@supports not ${cssSupportsQuery.unitStripping} {
												--_switch: round(down, tan(atan2(var(--_angle), 90deg)), 1);
											}

											r: var(--_radius);
											stroke-dasharray:
												0, calc(var(--i) * 0.5 * pi * var(--_radius) + var(--_gap)),
												calc(0.5 * pi * var(--_radius) - 2 * var(--_gap)), var(--_circumference);
											stroke: color-mix(in oklch, var(--neutral-900) calc((1 - var(--_switch)) * 100%), var(--primary-800) calc(var(--_switch) * 100%));

											transition: stroke 0.2s ease-in-out;
										}
									`}>
										{Array.from({ length: 4 }, (_, i) => <TrigWheel.Circle
											key={i} className="progress-indicator"
											style={{ '--i': i } as React.CSSProperties}
											fill="none" stroke="var(--neutral-900)" strokeWidth="0.5"
											strokeLinecap="butt"
										/>)}
									</g>
									<TrigWheel.Circle
										css={css`
											--_radius: calc(0.24 * var(${TrigWheel.cssProps.radius}));
											--_circumference: calc(2 * pi * var(--_radius));

											r: var(--_radius);
											stroke-dasharray: 0, var(--_circumference), var(--_circumference), 0;
											stroke-dashoffset: calc(-4 * var(--_radius) * var(${TrigWheel.cssProps.angle}) / (1rad));
											@supports not ${cssSupportsQuery.unitStripping} {
												stroke-dashoffset: calc(-4 * var(--_radius) * tan(atan2(var(${TrigWheel.cssProps.angle}), 1rad)));
											}

											transition: 0.2s ease-in-out;
											transition-property: opacity, filter;
										`}
										fill="none" stroke="var(--primary-900)" strokeWidth="0.1"
									/>
									<TrigWheel.RotorTerminal fill="var(--primary-700)" />
									<TrigWheel.RotorTerminal fill="var(--primary-400)" r="0.5" />
									<AngleLabel fontSize="2.2" fill="var(--neutral-500)" />
								</TrigWheel>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
};