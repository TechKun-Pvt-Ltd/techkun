'use client'
import React from "react";
import {css, keyframes} from "@emotion/react";
import Precision from "@/app/components/banner-components/Precision";
import Beauty from "@/app/components/banner-components/Beauty";
import Identity from "@/app/components/banner-components/Identity";
import GradientRimButton from "@/app/components/ui/GradientRimButton";
import EmailLink from "@/app/components/EmailLink";

const gradientFill = keyframes`
	from {
		--gradient-fill-progress: 0%;
	}
	to {
		--gradient-fill-progress: 75%;
	}
`;

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
		animation: ${gradientFill} 2.4s ease both;
	`}>
		<div css={css`
			min-height: var(--section-height);
			width: 100%;
			max-width: 60rem;
            display: flex;
			flex-direction: column;
            justify-content: space-between;
			align-items: center;
            padding-block: 160px 48px;
            text-align: center;
			gap: 64px;
		`}>
			<div css={css`
                display: flex;
                flex-direction: column;
                align-items: center;
				gap: 56px;
			`}>
				<h1 className="hero-heading" css={css`user-select: none;`}>
					<span style={{ whiteSpace: 'nowrap' }}>We build software</span>
					<br/>with
					<span css={keywordCss}> <Beauty />, <Precision />, </span>
					and <span css={keywordCss}><Identity className="keyword" />.</span>
				</h1>
				<div className="large-text" css={css`
					padding-inline: 96px;
					display: flex;
					gap: 24px;
					flex-wrap: wrap;
					align-items: center;
					justify-content: center;
				`}>
					<GradientRimButton style={{ fontSize: "inherit", lineHeight: "inherit", letterSpacing: "inherit", width: "max-content" }}>Let's get on call</GradientRimButton>
					<EmailLink
						style={{ color: "oklch(from var(--secondary-color) 0.56 0.05 h)", fontWeight: "500", fontSize: "1.1em", width: "max-content" }}
						address="farasat@tech-kun.com" text="or chat on email" iconSide="right"
						gap="8px" iconStrokeWidth={1.4}
					/>
				</div>
			</div>
			<p css={css`
				color: oklch(from var(--secondary-color) 0.48 0.05 h);
				padding-block-start: 8px;
				font-weight: 500;
			`}>
				{/*Brand research & planning • Design • Engineering • Testing • Launch & maintenance*/}
				Creating&nbsp;experiences&nbsp;people&nbsp;love and&nbsp;brands&nbsp;they&nbsp;remember.
			</p>
		</div>
	</section>;
}