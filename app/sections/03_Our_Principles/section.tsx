import {css} from "@emotion/react";
import React, {useRef} from "react";
import {interpolate, motion, MotionStyle, useScroll, useTransform} from "motion/react";
import {deviceQuery} from "@/app/utils/css/device-query.ts";
import RevolutionWheel from "./components/RevolutionWheel.tsx";
import PrincipleTitles from "./components/PrincipleTitles";
import {Angle} from "svg-path-kit";
import {rotationCssScope, rotationCssVars} from "@/app/sections/03_Our_Principles/components/rotation-css-api.ts";

const titles = [
	{ title: "An interface should feel\u00A0human", subtitle: "Users feel connected to interfaces that talk to them, interfaces that feel human." },
	{ title: "Precision and care are\u00A0essential", subtitle: "Every shortcut is a sin. What makes a product great is the care put into its tiniest details." },
	{ title: "Every detail must be\u00A0documented", subtitle: "We keep all our work documented and well-defined, as well as our processes. We\u00A0rely on systems, not assumptions." },
	{ title: "Identity brings the interface to life", subtitle: "An interface doesn't feel alive and distinguishable without a visual identity." }
];

const svgSizeProp = "--_svg-size";

const ANGLE_RANGE_START = 0;
const interpolateAngle = interpolate([0, 1], [ANGLE_RANGE_START, ANGLE_RANGE_START + 2 * Math.PI]);

export default function OurPrinciples() {
	const targetRef = useRef<HTMLDivElement>(null);
	const {scrollYProgress} = useScroll({target: targetRef, offset: ["start 50%", "end 60%"]});
	const angle = useTransform(scrollYProgress, p => Angle.of(interpolateAngle(p)));
	const cssAngle = useTransform(angle, a => `${+a}rad`);

	return <motion.section
		className="py-32"
		css={rotationCssScope}
		style={{ [rotationCssVars.angle]: cssAngle } as MotionStyle}
	>
		<div className="gap-20" css={css`
            display: flex;
			flex-direction: column;
		`}>
			<div>
				<h2 className="section-title" css={css`
					margin-block-end: 0.25em;
				`}>We're guided by<br/>the following principles</h2>
				<p className="type-body-lg font-medium" css={css`
					color: var(--color-text-secondary);
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
					${svgSizeProp}: clamp(480px - 2 * var(--navbar-height), min(var(--page-max-width), 100vh - 2 * var(--navbar-height)), 768px);
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
						grid-template-rows: 14rem 1fr;
						align-items: start;
						@media ${deviceQuery.tablet} {
							grid-template-columns: 7fr 13fr;
							grid-template-rows: 1fr;
							align-items: stretch;
							gap: var(--space-8);
						}
					`}>
						<PrincipleTitles titles={titles} />
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
								<line x1="0%" y1="50%" x2="100%" y2="50%" strokeWidth="10" stroke="var(--color-stroke-revolution-wheel-track)" strokeDasharray="16" />
							</svg>
							<RevolutionWheel angle={angle} angleRangeStart={ANGLE_RANGE_START} />
						</div>
					</div>
				</div>
			</div>
		</div>
	</motion.section>
};