import {motion, MotionStyle, useScroll, useTransform} from "motion/react";
import {useRef} from "react";
import {css} from "@emotion/react";
import {round} from "svg-path-kit/numbers";
import {Angle} from "svg-path-kit";

const SIZE = 100;
const RADIUS = 0.4 * SIZE;

const START = 0;
const END = START + SIZE;
const CENTER = START + SIZE / 2;

const angleRange: [number, number] = [-Math.PI, Math.PI];
export default function TrigCircle() {
	const targetRef = useRef<HTMLDivElement>(null);
	const {scrollYProgress} = useScroll({ target: targetRef, offset: ["start 75%", "end 25%"] });
	const theta = useTransform(scrollYProgress, [0, 1], angleRange);
	const thetaStr = useTransform(theta, a => `${a}rad`);

	const angle = useTransform(theta, t => Angle.of(t));
	const xPos = useTransform(angle, a => CENTER + RADIUS * a.cosine);
	const yPos = useTransform(angle, a => CENTER + RADIUS * a.sine);

	const displayedTheta = useTransform(theta, t => -1 * round(t, 4));

	const clipPathD = useTransform(
		angle,
		(a) => {
			const r = RADIUS + 10;
			return `
			M ${CENTER} ${CENTER}
			l ${r * Math.cos(angleRange[0])} ${r * Math.sin(angleRange[0])}
			A ${r} ${r} 0 ${+a - angleRange[0] > Math.PI ? 1 : 0} 1 ${CENTER + r * a.cosine} ${CENTER + r * a.sine}
			`;
		}
	);

	const rotatingLineStyles: MotionStyle = {
		rotate: thetaStr,
		transformBox: 'view-box'
	};

	const letters = Array.from("Precision & care that AI cannot match.");
	return <div ref={targetRef} css={css`
		position: relative;
        flex-basis: 768px;
        height: 100%;
        display: flex;
        align-items: center;
	`}>
		<svg width="100%" viewBox={`${START} ${START} ${SIZE} ${SIZE}`} css={css`
            will-change: transform;
		`}>
			<defs>
				<clipPath id="circular-clip-path">
					<motion.path
						d={clipPathD}
						fill="var(--muted)"
					></motion.path>
				</clipPath>
			</defs>
			<g
				fontSize={4} fill="var(--primary-600)"
				// stroke="var(--primary-500)" strokeWidth="0.08"
				fontFamily="monospace"
				clipPath="url(#circular-clip-path)"
				css={css`
					--total: ${letters.length};
					--center: ${CENTER}px;
                    text {
                        transform:
                            translate(calc(var(--center) - 50%), calc(var(--center) - 50%))
                            rotate(calc(-85deg + 140deg / var(--total) * var(--index)))
                            translateY(-${RADIUS + 2.5}px);
                        transform-box: fill-box;
                        transform-origin: 50% 50%;
                    }
				`}
			>
				{letters.map((letter, i) => <motion.text
					key={i} style={{ '--index': i }}
					x="0" y="4"
				>{letter}</motion.text>)}
			</g>
			<g stroke="var(--neutral-700)" strokeWidth="0.25" fill="none">
				<circle r={RADIUS} cx={CENTER} cy={CENTER} fill="oklch(from var(--neutral-900) l c h / 0.5)"></circle>
				<line x1={START} y1={CENTER} x2={END} y2={CENTER}></line>
				<line x1={CENTER} y1={START} x2={CENTER} y2={END}></line>
				<motion.line
					x1={CENTER} y1={CENTER}
					x2={END} y2={CENTER}
					strokeDasharray="2"
					style={rotatingLineStyles}
				></motion.line>
				<motion.line
					x1={CENTER} y1={CENTER}
					x2={CENTER + RADIUS} y2={CENTER}
					style={rotatingLineStyles}
				></motion.line>
				<motion.line
					x1={xPos} y1={CENTER}
					x2={xPos} y2={yPos}
					strokeDasharray="2"
				></motion.line>
				<motion.line
					x1={CENTER} y1={yPos}
					x2={xPos} y2={yPos}
					strokeDasharray="2"
				></motion.line>
			</g>
			<motion.circle
				r={1} cx={xPos} cy={yPos}
				fill="var(--neutral-700)"
			></motion.circle>
			<motion.text
				x={CENTER + 2} y={CENTER - 2}
				fill="var(--neutral-500)"
				fontSize="2"
			>
				{displayedTheta}
			</motion.text>
		</svg>
	</div>;
};