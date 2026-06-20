'use client'
import React from "react";
import {css, keyframes} from "@emotion/react";
import Precision from "@/app/components/banner-components/Precision";
import Beauty from "@/app/components/banner-components/Beauty";
import Identity from "@/app/components/banner-components/Identity";
import GradientBorderButton from "@/app/components/ui/GradientBorderButton";
import EmailLink from "@/app/components/EmailLink";
import BANNER_ANIMATION from "@/app/animations/banner";

const gradientFill = keyframes`
	from {
		--gradient-fill-progress: 0%;
	}
	to {
		--gradient-fill-progress: 75%;
	}
`;
const {bgGradient} = BANNER_ANIMATION;
export default function Banner() {
	const keywordCss = css`
        font-size: 1.4em;
        line-height: 1.4em;
		color: var(--neutral-300);
	`;

	return <section css={css`
		justify-items: center;
		background: radial-gradient(
			ellipse var(--page-max-width) 100% at 50% 145%,
			oklch(from var(--secondary-950) l c h / 0.5),
			transparent var(--gradient-fill-progress)
		);
		animation: ${gradientFill} ${bgGradient.duration}s ${bgGradient.delay}s ease both;
	`}>
		<div css={css`
			min-height: var(--section-height);
			width: 100%;
			max-width: 60rem;
            display: flex;
            justify-content: center;
			align-items: center;
            padding-block: 80px 160px;
            text-align: center;
		`}>
			<div>
				<p className="text-lg" css={css`
					margin-block-end: 16px;
					font-weight: 500;
                    color: oklch(from var(--secondary-color) 0.56 0.05 h);
				`}>Hello there!</p>
				<h1 className="hero-heading" css={css`user-select: none; margin-block-end: 56px;`}>
					We&nbsp;build&nbsp;software
					<br/>with
					<span css={keywordCss}> <Beauty />, <Precision />, </span>
					and <span css={keywordCss}><Identity className="keyword" />.</span>
				</h1>
				<p className="text-lg" css={css`
                    padding-inline: 96px;
                    margin-block-end: 32px;
                    font-weight: 500;
					white-space: nowrap;
                    color: oklch(from var(--secondary-color) 0.56 0.05 h);
				`}>If that resonates...</p>
				<div className="text-lg" css={css`
					padding-inline: 96px;
					display: flex;
					gap: 24px;
					flex-wrap: wrap;
					align-items: center;
					justify-content: center;
				`}>
					<GradientBorderButton style={{ fontSize: "inherit", lineHeight: "inherit", letterSpacing: "inherit", width: "max-content" }}>
						Let's get on call
					</GradientBorderButton>
					<EmailLink
						style={{ color: "oklch(from var(--secondary-color) 0.56 0.05 h)", fontWeight: "500", width: "max-content" }}
						address="farasat@tech-kun.com" text="or chat on email" iconSide="right"
						gap="8px" iconStrokeWidth={1.4}
					/>
				</div>
			</div>
		</div>
	</section>;
}