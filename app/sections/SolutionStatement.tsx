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
import {Angle} from "svg-path-kit";
import {deviceQuery} from "@/app/styles/device-query";
import RevolutionWheel from "@/app/components/solution-statement-components/RevolutionWheel";
import PrincipleTitles from "@/app/components/solution-statement-components/PrincipleTitles";

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

const ANGLE_RANGE_START = 0;

const titles = [
	{ title: "User experience comes\u00A0first", subtitle: "We\u00A0investigate the user's\u00A0needs and\u00A0persona and create a\u00A0delightful human\u00A0experience for\u00A0them." },
	{ title: "Precision & care matters", subtitle: "Every shortcut is a sin. We engineer every detail and build smooth, robust foundations to grow upon." },
	{ title: "Document everything", subtitle: "We keep all our work documented and well-defined, as well as our processes. We\u00A0rely on systems, not memory." },
	{ title: "Identity", subtitle: "We investigate your idea, understand\u00A0its meaning, and create a visual\u00A0identity for it." }
];

const svgSizeProp = "--_svg-size";

export default function SolutionStatement() {
	const targetRef = useRef<HTMLDivElement>(null);
	const {scrollYProgress} = useScroll({target: targetRef, offset: ["start 50%", "end 60%"]});
	const angle = useTransform(scrollYProgress, sp => Angle.of(interpolate([0, 1], [ANGLE_RANGE_START, ANGLE_RANGE_START + 2 * Math.PI])(sp)));

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
							align-items: stretch;
						}
					`}>
						<PrincipleTitles angle={angle} angleRangeStart={ANGLE_RANGE_START} titles={titles} />
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
							<RevolutionWheel angle={angle} angleRangeStart={ANGLE_RANGE_START} />
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
};