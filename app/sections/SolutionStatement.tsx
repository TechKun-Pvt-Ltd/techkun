import {css} from "@emotion/react";
import React, {useEffect, useRef} from "react";
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
import TrigWheel from "@/app/components/TrigWheel";
import {round} from "svg-path-kit/numbers";
import SvgCircularText from "@/app/components/SvgCircularText";
import {clamp} from "times-fps";

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
const ANGLE_RANGE: [number, number] = [-13 / 10 * Math.PI, 7 / 10 * Math.PI];

const centerPoint = Point2D.of(CIRCLE_CENTER, CIRCLE_CENTER);

const icons = [
	{
		size: 4.5,
		position: centerPoint.add(Vector2D.polar(TRIG_CIRCLE_RADIUS, -7 * Math.PI / 8)),
		// render() {
		// 	return <svg
		// 		x={this.position.x - this.size / 2} y={this.position.y - this.size / 2}
		// 		width={this.size} height={this.size} viewBox="0 0 24 24"
		// 		fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
		// 		strokeLinejoin="round" preserveAspectRatio="xMidYMid"
		// 	>
		// 		<path d="M 7 7 C 7 4.2386 9.2386 2 12 2 C 14.7614 2 17 4.2386 17 7 C 17 8.3261 16.4732 9.5979 15.5355 10.5355 C 14.5979 11.4732 14.0711 12.745 14.0711 14.0711 C 14.0711 15.2149 13.1438 16.1421 12 16.1421 C 10.8562 16.1421 9.9289 15.2149 9.9289 14.0711 C 9.9289 12.745 9.4021 11.4732 8.4645 10.5355 C 7.5268 9.5979 7 8.3261 7 7 M 13.4645 18.5355 C 13.0761 18.9239 12.5493 19.1421 12 19.1421 C 11.4507 19.1421 10.9239 18.9239 10.5355 18.5355 M 13.0355 21.6147 C 12.3947 21.9846 11.6053 21.9846 10.9645 21.6147"/>
		// 	</svg>;
		// }
		render() {
			return <svg
				xmlns="http://www.w3.org/2000/svg"
				x={this.position.x - this.size / 2} y={this.position.y - this.size / 2}
				width={this.size} height={this.size}
				viewBox="0 0 24 24" fill="none"
			>
				<path fillRule="evenodd" clipRule="evenodd" d="M12 2.75C8.27208 2.75 5.25 5.77208 5.25 9.5C5.25 11.4985 6.11758 13.2934 7.49907 14.5304L7.50342 14.5343C8.06008 15.0328 8.48295 15.4114 8.78527 15.6886C9.06989 15.9495 9.29537 16.1628 9.41353 16.3086L9.42636 16.3244C9.64763 16.5974 9.84045 16.8353 9.9676 17.1199C10.0948 17.4044 10.1434 17.7067 10.1992 18.0537L10.2024 18.0738C10.231 18.2517 10.2425 18.4701 10.247 18.75H13.753C13.7575 18.4701 13.769 18.2517 13.7976 18.0738L13.8008 18.0537C13.8566 17.7067 13.9052 17.4044 14.0324 17.1199C14.1596 16.8353 14.3524 16.5974 14.5736 16.3244L14.5865 16.3086C14.7046 16.1628 14.9301 15.9495 15.2147 15.6886C15.5171 15.4114 15.94 15.0327 16.4966 14.5343L16.5009 14.5304C17.8824 13.2934 18.75 11.4985 18.75 9.5C18.75 5.77208 15.7279 2.75 12 2.75ZM13.7436 20.25H10.2564C10.2597 20.3542 10.2646 20.4453 10.2721 20.5273C10.2925 20.7524 10.3269 20.8341 10.3505 20.875C10.4163 20.989 10.511 21.0837 10.625 21.1495C10.6659 21.1731 10.7476 21.2075 10.9727 21.2279C11.2082 21.2493 11.5189 21.25 12 21.25C12.4811 21.25 12.7918 21.2493 13.0273 21.2279C13.2524 21.2075 13.3341 21.1731 13.375 21.1495C13.489 21.0837 13.5837 20.989 13.6495 20.875C13.6731 20.8341 13.7075 20.7524 13.7279 20.5273C13.7354 20.4453 13.7403 20.3542 13.7436 20.25ZM3.75 9.5C3.75 4.94365 7.44365 1.25 12 1.25C16.5563 1.25 20.25 4.94365 20.25 9.5C20.25 11.9428 19.1874 14.1384 17.5016 15.6479C16.9397 16.151 16.5234 16.5238 16.2284 16.7942C16.0809 16.9295 15.9681 17.0351 15.8849 17.1162C15.8434 17.1566 15.8117 17.1886 15.788 17.2134C15.7763 17.2256 15.7675 17.2352 15.7611 17.2423C15.7546 17.2496 15.7519 17.2529 15.7519 17.2529C15.4917 17.574 15.4354 17.6568 15.4019 17.7319C15.3683 17.8069 15.3442 17.9041 15.2786 18.3121C15.2527 18.4732 15.25 18.7491 15.25 19.5V19.5322C15.25 19.972 15.25 20.3514 15.2218 20.6627C15.192 20.9918 15.1259 21.3178 14.9486 21.625C14.7511 21.967 14.467 22.2511 14.125 22.4486C13.8178 22.6259 13.4918 22.692 13.1627 22.7218C12.8514 22.75 12.472 22.75 12.0322 22.75H11.9678C11.528 22.75 11.1486 22.75 10.8374 22.7218C10.5082 22.692 10.1822 22.6259 9.875 22.4486C9.53296 22.2511 9.24892 21.967 9.05144 21.625C8.87407 21.3178 8.80802 20.9918 8.77818 20.6627C8.74997 20.3514 8.74998 19.972 8.75 19.5322L8.75 19.5C8.75 18.7491 8.74735 18.4732 8.72144 18.3121C8.6558 17.9041 8.63166 17.8069 8.59812 17.7319C8.56459 17.6568 8.50828 17.574 8.24812 17.2529C8.24812 17.2529 8.24514 17.2493 8.23888 17.2423C8.23249 17.2352 8.22369 17.2256 8.21199 17.2134C8.18835 17.1886 8.15661 17.1566 8.11513 17.1162C8.03189 17.0351 7.91912 16.9295 7.77161 16.7942C7.4766 16.5238 7.06034 16.151 6.49845 15.6479C4.81263 14.1384 3.75 11.9428 3.75 9.5Z" fill="currentColor" />
				<path fillRule="evenodd" clipRule="evenodd" d="M13.2215 7.8897C13.5586 8.13046 13.6366 8.59887 13.3959 8.93593L12.1001 10.75H13.6427C13.9237 10.75 14.181 10.907 14.3096 11.1568C14.4382 11.4066 14.4163 11.7073 14.253 11.9359L12.1102 14.9359C11.8694 15.273 11.401 15.3511 11.0639 15.1103C10.7269 14.8695 10.6488 14.4011 10.8896 14.0641L12.1853 12.25H10.6427C10.3618 12.25 10.1044 12.093 9.97585 11.8432C9.84729 11.5934 9.86913 11.2927 10.0324 11.0641L12.1753 8.06407C12.416 7.72701 12.8844 7.64894 13.2215 7.8897Z" fill="currentColor" />
			</svg>;
		}
	},
	{
		size: 4,
		position: centerPoint.add(Vector2D.polar(TRIG_CIRCLE_RADIUS, -6 * Math.PI / 8)),
		render() {
			return <svg
				xmlns="http://www.w3.org/2000/svg"
				x={this.position.x - this.size / 2} y={this.position.y - this.size / 2}
				width={this.size} height={this.size}
				viewBox="0 0 24 24" fill="none"
			>
				<path fillRule="evenodd" clipRule="evenodd" d="M10.9436 1.25H13.0564C14.8942 1.24998 16.3498 1.24997 17.489 1.40314C18.6614 1.56076 19.6104 1.89288 20.3588 2.64124C20.6516 2.93414 20.6516 3.40901 20.3588 3.7019C20.0659 3.9948 19.591 3.9948 19.2981 3.7019C18.8749 3.27869 18.2952 3.02502 17.2892 2.88976C16.2615 2.75159 14.9068 2.75 13 2.75H11C9.09318 2.75 7.73851 2.75159 6.71085 2.88976C5.70476 3.02502 5.12511 3.27869 4.7019 3.7019C4.27869 4.12511 4.02502 4.70476 3.88976 5.71085C3.75159 6.73851 3.75 8.09318 3.75 10V14C3.75 15.9068 3.75159 17.2615 3.88976 18.2892C4.02502 19.2952 4.27869 19.8749 4.7019 20.2981C5.12511 20.7213 5.70476 20.975 6.71085 21.1102C7.73851 21.2484 9.09318 21.25 11 21.25H13C14.9068 21.25 16.2615 21.2484 17.2892 21.1102C18.2952 20.975 18.8749 20.7213 19.2981 20.2981C19.994 19.6022 20.2048 18.5208 20.2414 15.9892C20.2474 15.575 20.588 15.2441 21.0022 15.2501C21.4163 15.2561 21.7472 15.5967 21.7412 16.0108C21.7061 18.4383 21.549 20.1685 20.3588 21.3588C19.6104 22.1071 18.6614 22.4392 17.489 22.5969C16.3498 22.75 14.8942 22.75 13.0564 22.75H10.9436C9.10583 22.75 7.65019 22.75 6.51098 22.5969C5.33856 22.4392 4.38961 22.1071 3.64124 21.3588C2.89288 20.6104 2.56076 19.6614 2.40314 18.489C2.24997 17.3498 2.24998 15.8942 2.25 14.0564V9.94358C2.24998 8.10582 2.24997 6.65019 2.40314 5.51098C2.56076 4.33856 2.89288 3.38961 3.64124 2.64124C4.38961 1.89288 5.33856 1.56076 6.51098 1.40314C7.65019 1.24997 9.10582 1.24998 10.9436 1.25ZM18.1131 7.04556C19.1739 5.98481 20.8937 5.98481 21.9544 7.04556C23.0152 8.1063 23.0152 9.82611 21.9544 10.8869L17.1991 15.6422C16.9404 15.901 16.7654 16.076 16.5693 16.2289C16.3387 16.4088 16.0892 16.563 15.8252 16.6889C15.6007 16.7958 15.3659 16.8741 15.0187 16.9897L12.9351 17.6843C12.4751 17.8376 11.9679 17.7179 11.625 17.375C11.2821 17.0321 11.1624 16.5249 11.3157 16.0649L11.9963 14.0232C12.001 14.0091 12.0056 13.9951 12.0102 13.9813C12.1259 13.6342 12.2042 13.3993 12.3111 13.1748C12.437 12.9108 12.5912 12.6613 12.7711 12.4307C12.924 12.2346 13.099 12.0596 13.3578 11.8009C13.3681 11.7906 13.3785 11.7802 13.3891 11.7696L18.1131 7.04556ZM20.8938 8.10622C20.4188 7.63126 19.6488 7.63126 19.1738 8.10622L18.992 8.288C19.0019 8.32149 19.0132 8.3571 19.0262 8.39452C19.1202 8.66565 19.2988 9.02427 19.6372 9.36276C19.9757 9.70125 20.3343 9.87975 20.6055 9.97382C20.6429 9.9868 20.6785 9.99812 20.712 10.008L20.8938 9.8262C21.3687 9.35124 21.3687 8.58118 20.8938 8.10622ZM19.5664 11.1536C19.2485 10.9866 18.9053 10.7521 18.5766 10.4234C18.2479 10.0947 18.0134 9.75146 17.8464 9.43357L14.4497 12.8303C14.1487 13.1314 14.043 13.2388 13.9538 13.3532C13.841 13.4979 13.7442 13.6545 13.6652 13.8202C13.6028 13.9511 13.5539 14.0936 13.4193 14.4976L13.019 15.6985L13.3015 15.981L14.5024 15.5807C14.9064 15.4461 15.0489 15.3972 15.1798 15.3348C15.3455 15.2558 15.5021 15.159 15.6468 15.0462C15.7612 14.957 15.8686 14.8513 16.1697 14.5503L19.5664 11.1536ZM7.25 9C7.25 8.58579 7.58579 8.25 8 8.25H14.5C14.9142 8.25 15.25 8.58579 15.25 9C15.25 9.41421 14.9142 9.75 14.5 9.75H8C7.58579 9.75 7.25 9.41421 7.25 9ZM7.25 13C7.25 12.5858 7.58579 12.25 8 12.25H10.5C10.9142 12.25 11.25 12.5858 11.25 13C11.25 13.4142 10.9142 13.75 10.5 13.75H8C7.58579 13.75 7.25 13.4142 7.25 13ZM7.25 17C7.25 16.5858 7.58579 16.25 8 16.25H9.5C9.91421 16.25 10.25 16.5858 10.25 17C10.25 17.4142 9.91421 17.75 9.5 17.75H8C7.58579 17.75 7.25 17.4142 7.25 17Z" fill="currentColor" />
			</svg>;
		}
	}
].map(icon => {
	icon.position = Point2D.of(round(icon.position.x, 4), round(icon.position.y, 4))
	return icon;
});

const svgSizeProp = "--_svg-size";

type NumOrBiNumToNum = number | ((arg0: number, arg1: number, text: string) => number);
function createGetMovingAngle(
	text: string, startAngle: number, charAngle: number,
	shiftRange: [NumOrBiNumToNum, NumOrBiNumToNum]
): (value: number) => number {
	const finalShiftRange = shiftRange.map(
		item => typeof item === "number" ? item : item(startAngle, charAngle, text)
	) as [number, number];
	return value => startAngle + clamp(value, ...finalShiftRange) - finalShiftRange[0];
}

const firstText = "Replace repairs";
const charAngle = 0.09;
const getFirstMovingAngle = createGetMovingAngle(
	firstText, -Math.PI / 2 - charAngle * firstText.length - Math.PI / 60, charAngle,
	[0, 0]
);

const revealedText = "with growth";
const getRevealedMovingAngle = createGetMovingAngle(
	revealedText, -Math.PI * (1 / 2 - 1 / 30), charAngle,
	[startAngle => startAngle + charAngle * revealedText.length + Math.PI / 30, Math.PI]
);

export default function SolutionStatement() {
	const targetRef = useRef<HTMLDivElement>(null);
	const {scrollYProgress} = useScroll({target: targetRef, offset: ["start 60%", "end 40%"]});
	const angle = useTransform(scrollYProgress, sp => Angle.of(interpolate([0, 1], ANGLE_RANGE)(sp)));

	const movingStartAngle = useTransform(angle, a => `${getFirstMovingAngle(+a)}rad`);
	const movingRevealedStartAngle = useTransform(angle, a => `${getRevealedMovingAngle(+a)}rad`);

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
								{/*<TrigWheel.RotorXProjection />*/}
								{/*<TrigWheel.RotorYProjection />*/}
							</g>
							<TrigWheel.InnerDashedWheel stroke="var(--neutral-700)" />
							<g clipPath="url(#back-clip-path)">
								<SvgCircularText
									radius={TRIG_CIRCLE_RADIUS - 14}
									centerX={CIRCLE_CENTER}
									centerY={CIRCLE_CENTER}
									startAngle={movingStartAngle} charAngle={`${charAngle}rad`}
									fontSize={3.5}
									color="var(--secondary-neutral-400)"
								>{firstText}</SvgCircularText>
							</g>
							<g clipPath="url(#front-clip-path)">
								<SvgCircularText
									radius={TRIG_CIRCLE_RADIUS - 14}
									centerX={CIRCLE_CENTER}
									centerY={CIRCLE_CENTER}
									startAngle={movingRevealedStartAngle} charAngle={`${charAngle}rad`}
									fontSize={3.5}
									color="var(--secondary-neutral-400)"
								>{revealedText}</SvgCircularText>
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