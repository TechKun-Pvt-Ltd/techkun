import {css} from "@emotion/react";
import React, {useEffect, useRef, useState} from "react";
import {TextScramble, TextScrambleRef} from "@/components/motion-primitives/text-scramble";
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
	const space = "\u00A0\u00A0\u00A0\u00A0";

	return <div css={css`
        overflow: clip;
		mask: linear-gradient(
			to bottom,
			oklch(0 0 0),
			transparent
		);
        font-family: monospace;
		color: var(--neutral-700);
	`}>
		{/*<p className="text-lg" style={{whiteSpace: 'nowrap'}}>*/}
		{/*</p>*/}
		<div className="text-lg" css={css`
			height: 480px;
		`}>
			<p css={css`
                white-space: pre;
				user-select: none;
                display: grid;
                grid-template-columns: auto 1fr;
				.highlighted {
					color: var(--foreground);
					.location {
						color: var(--neutral-700);
					}
				}
			`}>
				{hightlightedLogs.flatMap((log, logIndex) =>
					<React.Fragment key={logIndex}>
						<span>{log.timestamp}{space}</span>
						<span className="highlighted">{log.message} {log.location && <span className="location">{log.location}</span>}</span>
					</React.Fragment>
				)}
				<span>{"02:11:42.881"}{space}</span>
				<TextScramble
					ref={scrambleRef} innerRef={scrambleInnerRef}
					as="span" duration={SCRAMBLE_DURATION}
				>{texts[itemIndex] ?? ""}</TextScramble>
				{applicationLogs.flatMap((log, logIndex) =>
					log.lines.map((line, lineIndex) => <React.Fragment key={`${logIndex}-${lineIndex}`}>
						<span>{line.timestamp}{space}</span>
						<span>{line.message}</span>
					</React.Fragment>)
				)}
			</p>
		</div>
	</div>;
}