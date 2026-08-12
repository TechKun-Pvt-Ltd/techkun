import {css} from "@emotion/react";
import React, {useEffect, useRef, useState} from "react";
import {TextScrambleRef} from "@/components/motion-primitives/text-scramble";
import {delayInSeconds} from "motion";
import {applicationLogs, hightlightedLogs} from "./applicationLogs";
import {inView} from "motion/react";

const texts = [
	"Misalignment", "No documentation", "Scope creep", "Technical debt", "Design debt", "Short-term optimization"
];

const SCRAMBLE_DURATION = 1.6;

export default function ErrorConsole() {
	const [itemIndex, setItemIndex] = useState(-1);
	const scrambleRef = useRef<TextScrambleRef>(null);
	const scrambleInnerRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (!scrambleInnerRef.current) return;

		let clear: (() => void) | undefined;
		// let lastUpdate = -Infinity;
		function update() {
			// lastUpdate = Date.now();
			setItemIndex(prev => (prev + 1) % texts.length);
			clear = delayInSeconds(update, SCRAMBLE_DURATION * 2);
		}
		const stop = inView(
			scrambleInnerRef.current,
			// () => {
				// const sinceLastUpdate = Date.now() - lastUpdate;
				// const diff = SCRAMBLE_DURATION * 2 - sinceLastUpdate;
				// if (diff > 0)
				// 	clear = delayInSeconds(update, diff);
				// else
				// 	update();

				// return () => { clear?.(); };
			// },
			update,
			{ margin: "-10% 0%" }
		);
		return () => {
			clear?.();
			stop();
		};
	}, []);
	useEffect(() => {
		if (scrambleRef.current && itemIndex >= 0)
			scrambleRef.current.scramble();
	}, [itemIndex]);

	return <div css={css`
        overflow: clip;
		mask: linear-gradient(
			to bottom,
			oklch(0 0 0) 4rem,
			transparent
		);
        font-family: monospace;
		color: var(--neutral-800);
		height: 100%;
	`}>
		{/*<p className="text-lg" style={{whiteSpace: 'nowrap'}}>*/}
		{/*</p>*/}
		<div className="text-lg" css={css`
			height: 16rem;
		`}>
			<p css={css`
                //white-space: pre;
				user-select: none;
                display: grid;
                grid-template-columns: auto 1fr;
				column-gap: clamp(32px, 5vw, 64px);
				.highlighted {
					color: var(--foreground);
				}
				span {
					min-width: 0;
				}
			`}>
				{hightlightedLogs.flatMap((log, logIndex) =>
					<React.Fragment key={logIndex}>
						<span>{log.timestamp}</span>
						<span>
							<span className="highlighted">{log.message}</span>
							{log.location && <span> {log.location}</span>}
						</span>
					</React.Fragment>
				)}
				{/*<span>{"02:11:42.881"}</span>*/}
				{/*<TextScramble*/}
				{/*	ref={scrambleRef} innerRef={scrambleInnerRef}*/}
				{/*	as="span" duration={SCRAMBLE_DURATION}*/}
				{/*>{texts[itemIndex] ?? ""}</TextScramble>*/}
				{/*<span css={css`*/}
				{/*	display: grid;*/}
				{/*	grid-column: 1/ -1;*/}
				{/*	grid-template-columns: subgrid;*/}
				{/*	height: 240px;*/}
				{/*`}>*/}
					{applicationLogs.flatMap((log, logIndex) =>
						log.lines.map((line, lineIndex) => <React.Fragment key={`${logIndex}-${lineIndex}`}>
							<span>{line.timestamp}</span>
							<span>{line.message}</span>
						</React.Fragment>)
					)}
				{/*</span>*/}
			</p>
		</div>
	</div>;
}