import {css} from "@emotion/react";
import React, {useEffect, useRef, useState} from "react";
import {TextScramble, TextScrambleRef} from "@/components/motion-primitives/text-scramble";
import {delayInSeconds} from "motion";
import {applicationLogs} from "./applicationLogs";
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
			oklch(0 0 0),
			transparent
		);
        font-family: monospace;
	`}>
		<p className="text-xl" style={{marginBlockEnd: '1.25em', whiteSpace: 'nowrap'}}>
			<span css={css`color: var(--muted-foreground);`}>{">\u00A0"}</span>
			<TextScramble
				ref={scrambleRef} innerRef={scrambleInnerRef}
				as="span" duration={SCRAMBLE_DURATION}
			>{texts[itemIndex] ?? ""}</TextScramble>
		</p>
		<div css={css`
            color: var(--neutral-700);
		`}>
			<p css={css`
                white-space: pre;
				user-select: none;
                display: grid;
                grid-template-columns: auto 1fr;
			`}>
				{applicationLogs.flatMap((log, logIndex) =>
					log.lines.map((line, lineIndex) => <React.Fragment key={`${logIndex}-${lineIndex}`}>
						<span>{line.timestamp}  </span>
						<span>{line.message}</span>
					</React.Fragment>)
				)}
			</p>
		</div>
	</div>;
}