'use client'
import React from "react";
import {css} from "@emotion/react";
import Precision from "@/app/components/banner-components/Precision";
import Beauty from "@/app/components/banner-components/Beauty";
import Identity from "@/app/components/banner-components/Identity";

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
            padding-block: 96px 48px;
            text-align: center;
			gap: 64px;
		`}>
			<h1 className="hero-heading" css={css`user-select: none;`}>
				<span style={{ whiteSpace: 'nowrap' }}>We build software</span>
				<br/>with
				<span css={keywordCss}> <Beauty />, <Precision />, </span>
				and <span css={keywordCss}><Identity className="keyword" />.</span>
			</h1>
			<p css={css`
				color: var(--neutral-600);
				padding-block-start: 8px;
				font-weight: 700;
			`}>
				Brand research & planning • Design • Engineering • Testing • Launch & maintenance
			</p>
		</div>
	</section>;
}