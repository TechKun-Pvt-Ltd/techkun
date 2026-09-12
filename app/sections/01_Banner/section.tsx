'use client'
import React, {useEffect, useRef} from "react";
import {css, keyframes} from "@emotion/react";
import Precision, {PrecisionRef} from "./components/Precision";
import Beauty, {BeautyRef} from "./components/Beauty";
import Identity, {IdentityRef} from "./components/Identity";
import MainCTA from "@/app/components/MainCTA";
import EmailLink from "@/app/components/EmailLink";
import BANNER_ANIMATION from "@/app/animations/banner";
import {inView} from "motion/react";
import {contactMailAddress, linkedInAccountUrl, xAccountUrl} from "@/app/utils/constants";
import LinkedInLink from "@/app/components/LinkedInLink";
import XLink from "@/app/components/XLink";
import {deviceBreakpoint} from "@/app/utils/css/device-query";
import navbarThresholdStatus from "@/app/utils/navbar-threshold-status";

const BREAKPOINT_QUERY = `(min-width: ${(deviceBreakpoint.tablet + deviceBreakpoint.laptop) * 0.5}rem)`;

const gradientFill = keyframes`
	from {
		--gradient-progress: 0%;
	}
	to {
		--gradient-progress: 100%;
	}
`;
const grayscale = keyframes`
	from {
		filter: grayscale(0.5) brightness(0.75);
	}
	to {
		filter: none;
	}
`;
const {bgGradient, ctaFilter} = BANNER_ANIMATION;
export default function Banner() {
	const scopeRef = useRef<HTMLElement>(null);
	const beautyRef = useRef<BeautyRef>(null);
	const precisionRef = useRef<PrecisionRef>(null);
	const identityRef = useRef<IdentityRef>(null);

	useEffect(() => {
		if (!scopeRef.current) return;

		const intersectionObserver = new IntersectionObserver(
			entries => navbarThresholdStatus.set(!entries.at(0)!.isIntersecting),
			{ threshold: 0.25 }
		);
		const cancelInView = inView(
			"h1.hero-heading",
			() => {
				scopeRef.current?.setAttribute("data-play", "true");
				beautyRef.current?.play();
				precisionRef.current?.play();
				identityRef.current?.play();
			},
			{amount: 0.5}
		);
		const ctaGroup = scopeRef.current.querySelector(".cta-group");
		ctaGroup && intersectionObserver.observe(ctaGroup);
		return () => {
			cancelInView();
			ctaGroup && intersectionObserver.unobserve(ctaGroup);
		};
	}, []);

	const keywordCss = css`
        font-size: 1.4em;
        line-height: 1.4;
		color: var(--neutral-300);
	`;

	const mobileBrCss = css`@media ${BREAKPOINT_QUERY} { display: none; }`;
	const tabletBrCss = css`display: none; @media ${BREAKPOINT_QUERY} { display: revert; }`;

	return <section ref={scopeRef} css={css`
		justify-items: center;
		background:
			radial-gradient(
				ellipse var(--page-max-width) 75% at 50% -50%,
				oklch(from var(--secondary-800) l c h / 0.25),
				transparent var(--gradient-progress)
			),
			radial-gradient(
				ellipse var(--page-max-width) 75% at 50% 145%,
				oklch(from var(--secondary-800) l c h / 0.25),
				transparent var(--gradient-progress)
			);
		animation: ${gradientFill} ${bgGradient.duration}s ${bgGradient.delay}s ease-out both;
		animation-play-state: paused;
		.cta {
			animation: ${grayscale} ${ctaFilter.duration}s ${ctaFilter.delay}s ease-out both;
			animation-play-state: inherit;
		}
		&[data-play="true"] {
			animation-play-state: running;
		}

		@media (prefers-reduced-motion: reduce) {
			animation: none;
			--gradient-progress: 100%;
			.cta {
				animation: none;
				filter: none;
			}
		}
	`}>
		<div css={css`
			min-height: var(--section-height);
			width: 100%;
            display: flex;
            justify-content: center;
			align-items: center;
            padding-block-end: 1.25cqh;
            text-align: center;
		`}>
			<div>
				<p className="text-lg mb-4" css={css`
					font-weight: 500;
                    color: var(--secondary-neutral-400);
				`}>Hello there!</p>
				<h1 className="hero-heading mb-14" css={css`
					isolation: isolate;
					user-select: none;
				`}>
					We&nbsp;build&nbsp;software
					<br/>with
					<span css={keywordCss}>
						&nbsp;<Beauty ref={beautyRef} />,
						<br css={mobileBrCss}/> <Precision ref={precisionRef} style={{ zIndex: 1 }} />,
					</span>
					<br css={tabletBrCss}/>and
					<span css={keywordCss} style={{ textWrap: "nowrap" }}>
						<br css={mobileBrCss}/> <Identity ref={identityRef} />.
					</span>
				</h1>
				<p className="text-lg px-24 mb-8" css={css`
                    font-weight: 500;
					white-space: nowrap;
                    color: var(--secondary-neutral-400);
				`}>If that resonates...</p>
				<div className="cta-group text-lg px-24 gap-6" css={css`
					display: flex;
					align-items: center;
					justify-content: center;

					flex-direction: column;
					@media ${BREAKPOINT_QUERY} {
						flex-direction: row;
					}
				`}>
					<MainCTA className="cta" style={{ width: "max-content" }}>
						Let's get on call
					</MainCTA>
					<div className="gap-3" style={{ color: "var(--secondary-neutral-400)", fontWeight: "500", width: "max-content", display: "flex", alignItems: "center" }}>
						<p>or chat on</p>
						<XLink href={xAccountUrl} />
						<LinkedInLink href={linkedInAccountUrl} />
						<EmailLink
							address={contactMailAddress}
							// gap="8px" iconSide="right" iconStrokeWidth={1.6}
						/>
					</div>
				</div>
			</div>
		</div>
	</section>;
}