import {css} from "@emotion/react";
import {useEffect, useRef, useState} from "react";
import {TextScramble, TextScrambleRef} from "@/components/motion-primitives/text-scramble";
import {delayInSeconds} from "motion";
import React from "react";
import {applicationLogs, LogType} from "./applicationLogs";
import {inView} from "motion/react";

const texts = [
	"Misalignment", "No documentation", "Scope creep", "Technical debt", "Design debt", "Short-term optimization"
];

export default function ConsoleWindow() {
	const [itemIndex, setItemIndex] = useState(-1);
	const scrambleRef = useRef<TextScrambleRef<"span">>(null);

	useEffect(() => {
		let clear: () => void;
		function start() {
			clear = delayInSeconds(_ => {
				setItemIndex(prev => (prev + 1) % texts.length);
				start();
			}, 3);
		}
		const stop = inView(scrambleRef.current?.getInnerRef(), () => {
			setItemIndex(0);
			start();
		}, { margin: "-10%" });
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
        height: 100%;
        overflow: clip;
        padding: 32px;
        font-family: monospace;
	`}>
		<p className="large-text" style={{marginBlockEnd: '1em'}}>
			<span css={css`color: var(--muted-foreground);`}>{">\u00A0"}</span>
			<TextScramble ref={scrambleRef} as="span">{texts[itemIndex] ?? ""}</TextScramble>
		</p>
		<div css={css`
            color: var(--neutral-400);
            .error {
                color: oklch(0.5 0.1 28);
            }
            .warn {
                color: oklch(0.5 0.1 96);
            }
		`}>
			<p css={css`
                display: grid;
                white-space: pre;
                grid-template-columns: auto auto 1fr;
			`}>
				{applicationLogs.flatMap((log, logIndex) =>
					log.lines.map((line, lineIndex) => <React.Fragment key={`${logIndex}-${lineIndex}`}>
						<span>{line.timestamp}  </span>
						{lineIndex === 0 ?
							<span className={log.type === LogType.ERROR ? "error" : "warn"}>{log.type}  </span> :
							<span></span>
						}
						<span>{line.message}</span>
					</React.Fragment>)
				)}
			</p>
		</div>
	</div>;
}