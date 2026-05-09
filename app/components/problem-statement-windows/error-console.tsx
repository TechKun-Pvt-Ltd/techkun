import {css} from "@emotion/react";
import {useEffect, useRef, useState} from "react";
import {TextScramble, TextScrambleRef} from "@/components/motion-primitives/text-scramble";
import {delayInSeconds} from "motion";
import React from "react";
import {applicationLogs} from "./applicationLogs";
import {inView} from "motion/react";

const texts = [
	"Misalignment", "No documentation", "Scope creep", "Technical debt", "Design debt", "Short-term optimization"
];

export default function ErrorConsole() {
	const [itemIndex, setItemIndex] = useState(-1);
	const scrambleRef = useRef<TextScrambleRef<"span">>(null);

	useEffect(() => {
		let clear: () => void;
		function start() {
			clear = delayInSeconds(_ => {
				setItemIndex(prev => (prev + 1) % texts.length);
				start();
			}, 3.2);
		}
		const stop = inView(scrambleRef.current?.getInnerRef(), () => {
			setItemIndex(0);
			start();
		}, { margin: "-10% 0%" });
		return () => {
			clear?.();
			stop();
		};
	}, []);
	useEffect(() => {
		if (itemIndex >= 0)
			scrambleRef.current?.scramble();
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
		<p className="xl-text" style={{marginBlockEnd: '1.25em'}}>
			<span css={css`color: var(--muted-foreground);`}>{">\u00A0"}</span>
			<TextScramble ref={scrambleRef} as="span">{texts[itemIndex] ?? ""}</TextScramble>
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