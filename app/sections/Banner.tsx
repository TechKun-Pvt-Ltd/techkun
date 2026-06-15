'use client'
import React from "react";
import {css} from "@emotion/react";
import Precision from "@/app/components/banner-components/Precision";
import Beauty from "@/app/components/banner-components/Beauty";
import Identity from "@/app/components/banner-components/Identity";
import GradientRimButton from "@/app/components/ui/GradientRimButton";
import EmailLink from "@/app/components/EmailLink";

export default function Banner() {
	const keywordCss = css`
        font-size: 1.4em;
        line-height: 1.4em;
		color: var(--neutral-300);
	`;

	return <section css={css`
		justify-items: center;
	`}>
		<div css={css`
			min-height: var(--section-height);
			width: 100%;
			max-width: 60rem;
            display: flex;
			flex-direction: column;
            justify-content: space-between;
			align-items: center;
            padding-block: 84px 48px;
            text-align: center;
			gap: 64px;
		`}>
			<div css={css`
                display: flex;
                flex-direction: column;
                align-items: center;
				gap: 64px;
			`}>
				<h1 className="hero-heading" css={css`user-select: none;`}>
					<span style={{ whiteSpace: 'nowrap' }}>We build software</span>
					<br/>with
					<span css={keywordCss}> <Beauty />, <Precision />, </span>
					and <span css={keywordCss}><Identity className="keyword" />.</span>
				</h1>
				<div className="large-text" css={css`
					padding-inline: 64px;
					display: flex;
					gap: 24px;
					flex-wrap: wrap;
					align-items: center;
					justify-content: center;
				`}>
					<GradientRimButton style={{ fontSize: "inherit", lineHeight: "inherit", letterSpacing: "inherit" }}>Let's talk</GradientRimButton>
					<EmailLink
						style={{ color: "var(--muted-foreground)", fontWeight: "400", fontSize: "1.1em" }}
						address="mailto:farasat@tech-kun.com" text="or send us an email" iconSide="right"
						gap="6px" iconStrokeWidth={1.2}
					/>
				</div>
			</div>
			<p css={css`
				color: var(--neutral-600);
				padding-block-start: 8px;
				font-weight: 700;
			`}>
				{/*Brand research & planning • Design • Engineering • Testing • Launch & maintenance*/}
				We design and engineer user experiences for your brand.
			</p>
		</div>
	</section>;
}