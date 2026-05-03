import {css, keyframes} from "@emotion/react";

const msgDblCheck =
	<svg viewBox="0 0 16 11" height="11" width="16"
		 preserveAspectRatio="xMidYMid meet" fill="none"
		 className="msg-dblcheck"
	>
		<path fill="var(--primary-500)"
			  d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z"
		/>
	</svg>;
const sendIcon =
	<svg viewBox="0 0 24 24" height="24" width="24"
		 preserveAspectRatio="xMidYMid meet" fill="none"
	>
		<path fill="currentColor"
			d="M5.4 19.425C5.06667 19.5583 4.75 19.5291 4.45 19.3375C4.15 19.1458 4 18.8666 4 18.5V14L12 12L4 9.99997V5.49997C4 5.1333 4.15 4.85414 4.45 4.66247C4.75 4.4708 5.06667 4.44164 5.4 4.57497L20.8 11.075C21.2167 11.2583 21.425 11.5666 21.425 12C21.425 12.4333 21.2167 12.7416 20.8 12.925L5.4 19.425Z"
		/>
	</svg>;

const slideUp = keyframes`
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
`;
const scaleUp = keyframes`
	from {
		transform: scale(0.75);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
`;
// const blink = keyframes`
// 	0% {
// 		visibility: visible;
// 	}
// 	100% {
// 		visibility: hidden;
// 	}
// `;

const content: {
	sent?: boolean;
	text: string;
	time: string;
}[] = [{
	sent: true,
	text: "Why is that feature missing?",
	time: "2:14 AM"
}, {
	text: "You said you wanted something simpler.",
	time: "2:34 AM"
}, {
	sent: true,
	text: "And we explicitly asked you to keep that feature.",
	time: "2:35 AM"
}, {
	text: "I don't remember you saying that.",
	time: "2:48 AM"
}, {
	sent: true,
	text: "Remember? Are we supposed to be relying on memory now?",
	time: "2:48 AM"
}, {
	sent: true,
	text: "Where's the documentation?",
	time: "2:49 AM"
}];

const messages: {
	sent?: boolean;
	text: string;
	time: string;
}[] = [{
	sent: true,
	text: "You shipped a dozen features this week but they barely work.",
	time: "2:54 AM"
}, {
	text: "All of these are known bugs.",
	time: "2:56 AM"
}, {
	text: "Rest assured, we will fix them later.",
	time: "2:57 AM"
}, {
	sent: true,
	text: "Every fix breaks something else.",
	time: "2:58 AM"
}, {
	sent: true,
	text: "The system is fragile now.",
	time: "2:59 AM"
}, {
	sent: true,
	text: "How long are you planning to defer this?",
	time: "2:59 AM"
}];

const MSG_BOX_ANIM_DURATION = 0.4;
const MSG_BOX_ANIM_DELAY = MSG_BOX_ANIM_DURATION * 0.75;

function ChatWindow() {
	const messageBoxCss = css`
        align-self: start;
        display: flex;
        align-items: end;
        gap: 0.5em;
        background-color: var(--muted);
        padding: 8px 16px;
        border-radius: 28px;
        corner-shape: superellipse(1.5);
		animation: ${scaleUp} ${MSG_BOX_ANIM_DURATION}s ease-out both;
		animation-delay: calc((sibling-index() - 1) * ${MSG_BOX_ANIM_DELAY}s);
		//animation-timeline: --vt;
        //animation-range: entry;

        & .msg-time {
            flex-shrink: 0;
            color: var(--muted-foreground);
        }

        &.sent {
            align-self: end;
            margin-left: 12px;
            transform-origin: right bottom;
            background-color: var(--primary-950);

            & .msg-dblcheck {
                margin-inline-start: 0.25em;
            }
        }

        &.received {
            margin-right: 12px;
            transform-origin: left bottom;
        }

        &.sent + .received, &.received + .sent {
            margin-top: 12px;
        }
	`;

	return <div css={css`
		--_border-radius: 36px;
		--_padding: 8px;
        border-radius: var(--_border-radius);
        corner-shape: squircle;
        width: min(100%, 448px);
        background-color: var(--muted);
        padding: var(--_padding);
        display: flex;
        flex-direction: column;
	`}>
		<div css={css`
            padding: calc(14px - var(--_padding)) 32px 14px;
            display: flex;
            gap: 8px;

            & > div {
                border-radius: 50%;
                width: 14px;
                height: 14px;
				background-color: var(--_bg-color);
				transition: background-color 0.1s ease-in-out;
            }
			&:hover > div {
				background-color: oklch(from var(--_bg-color) 0.5 c h);
			}
		`}>
			<div css={css`--_bg-color: oklch(0.4 0.1 28);`}/>
			<div css={css`--_bg-color: oklch(0.4 0.1 96);`}/>
			<div css={css`--_bg-color: oklch(0.4 0.1 140);`}/>
		</div>
		<div css={css`
            flex-grow: 1;
            background-color: var(--background);
            border-radius: calc(var(--_border-radius) - var(--_padding));
            corner-shape: squircle;
            padding: 24px 8px;
            display: flex;
            flex-direction: column;
            justify-content: end;
		`}>
			<div css={css`
                margin-bottom: 24px;
                display: flex;
                flex-direction: column;
                gap: 6px;
				animation: ${slideUp} ${MSG_BOX_ANIM_DURATION + (content.length - 1) * MSG_BOX_ANIM_DELAY}s ease-out both;
				//view-timeline: --vt;
				//animation-timeline: --vt;
				//animation-range: entry;
			`}>
				{content.map(msg => <p
					key={msg.text} css={messageBoxCss}
					className={msg.sent ? "sent" : "received"}
				>
					<span className="msg-text">{msg.text}</span>
					<span className="msg-time small-text">
						{msg.time}
						{msg.sent && msgDblCheck}
					</span>
				</p>)}
			</div>
			<div css={css`
                border-radius: 100vh;
                padding: 12px 16px;
                background-color: var(--muted);
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: var(--muted-foreground);
			`}>
				<div css={css`
                    height: 100%;
                    flex-grow: 1;
                    align-content: center;
				`}>
					{/*<div css={css`*/}
                    {/*    background-color: var(--neutral-500);*/}
                    {/*    width: 1px;*/}
                    {/*    height: calc(100% - 2px);*/}
					{/*	animation: ${blink} 1s steps(2, start) infinite both;*/}
					{/*`}></div>*/}
					Type a message
				</div>
				{sendIcon}
			</div>
		</div>
	</div>;
}

export default function ProblemStatement() {
	return <section>
		<div css={css`
            display: grid;
            grid-auto-flow: row;
            grid-auto-rows: auto;
            justify-items: center;
		`}>
			<h2 className="section-title"
				css={css`grid-column: 1 / -1;`}
			>We've all been there...</h2>
			<div css={css`
                grid-column: 1 / -1;
                justify-self: stretch;
                display: grid;
                grid-auto-flow: row;
                gap: 64px;
                position: relative;
			`}>
				<div css={css`
                    display: flex;
                    gap: 32px;
				`}>
					<ChatWindow/>
				</div>
				<p className="large-text" css={css`
                    display: flex;
                    justify-content: space-between;
				`}>
					<span css={css`
                        & .tilted-letter {
                            display: inline-block;
                        }
					`}>
						Misa
						<span className="tilted-letter" css={css`transform: rotate(-7deg);`}>l</span>
						<span className="tilted-letter" css={css`transform: rotate(3deg);`}>i</span>
						gnment<br/>
						lack of documentation<br/>
						scope creep
					</span>
					<span css={css`text-align: right;`}>
						Technical debt<br/>
						design debt<br/>
						short-term optimization
					</span>
				</p>
			</div>
		</div>
	</section>;
};