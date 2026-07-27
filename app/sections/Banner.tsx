'use client'
import React, {useEffect, useRef} from "react";
import {css, keyframes} from "@emotion/react";
import Precision, {PrecisionRef} from "@/app/components/banner-components/Precision";
import Beauty, {BeautyRef} from "@/app/components/banner-components/Beauty";
import Identity, {IdentityRef} from "@/app/components/banner-components/Identity";
import GradientBorderButton from "@/app/components/banner-components/GradientBorderButton";
import EmailLink from "@/app/components/EmailLink";
import BANNER_ANIMATION from "@/app/animations/banner";
import {inView} from "motion/react";

const gradientFill = keyframes`
	from {
		--gradient-progress: 0%;
	}
	to {
		--gradient-progress: 100%;
	}
`;
const {bgGradient} = BANNER_ANIMATION;
export default function Banner() {
	const scopeRef = useRef<HTMLElement>(null);
	const beautyRef = useRef<BeautyRef>(null);
	const precisionRef = useRef<PrecisionRef>(null);
	const identityRef = useRef<IdentityRef>(null);

	useEffect(() => {
		return inView(
			"h1.hero-heading",
			() => {
				scopeRef.current?.setAttribute("data-play", "true");
				beautyRef.current?.play();
				precisionRef.current?.play();
				identityRef.current?.play();
			},
			{amount: 0.5}
		)
	}, []);

	const keywordCss = css`
        font-size: 1.4em;
        line-height: 1.4;
		color: var(--neutral-300);
	`;

	return <section ref={scopeRef} css={css`
		justify-items: center;
		background: radial-gradient(
			ellipse var(--page-max-width) 75% at 50% 145%,
			oklch(from var(--secondary-950) l c h / 0.5),
			transparent var(--gradient-progress)
		);
		animation: ${gradientFill} ${bgGradient.duration}s ${bgGradient.delay}s ease both;
		animation-play-state: paused;
		&[data-play="true"] {
			animation-play-state: running;
		}
	`}>
		<div css={css`
			min-height: var(--section-height);
			width: 100%;
			max-width: 60rem;
            display: flex;
            justify-content: center;
			align-items: center;
            padding-block-end: 5cqh;
            text-align: center;
		`}>
			<div>
				<p className="text-lg" css={css`
					margin-block-end: 16px;
					font-weight: 500;
                    color: var(--secondary-neutral-400);
				`}>Hello there!</p>
				<h1 className="hero-heading" css={css`user-select: none; margin-block-end: 56px;`}>
					We&nbsp;build&nbsp;software
					<br/>with
					<span css={keywordCss}>&nbsp;<Beauty ref={beautyRef} />, <Precision ref={precisionRef} />, </span>
					and <span css={keywordCss}><Identity ref={identityRef} />.</span>
				</h1>
				<p className="text-lg" css={css`
                    padding-inline: 96px;
                    margin-block-end: 32px;
                    font-weight: 500;
					white-space: nowrap;
                    color: var(--secondary-neutral-400);
				`}>If that resonates...</p>
				<div className="text-lg" css={css`
					padding-inline: 96px;
					display: flex;
					gap: 24px;
					flex-wrap: wrap;
					align-items: center;
					justify-content: center;
				`}>
					<GradientBorderButton style={{ width: "max-content" }}>
						Let's get on call
					</GradientBorderButton>
					<EmailLink
						style={{ color: "var(--secondary-neutral-400)", fontWeight: "500", width: "max-content" }}
						address="farasat@tech-kun.com" text="or chat on email" iconSide="right"
						gap="8px" iconStrokeWidth={1.6}
					/>
				</div>
			</div>
		</div>
	</section>;
}