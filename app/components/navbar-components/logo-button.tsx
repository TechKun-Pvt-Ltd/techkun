import {css} from "@emotion/react";
import React, {useEffect, useRef, useState} from "react";
import TechKunLogo from "@/app/components/techkun-logo";
import { motion } from "motion/react";

export default function LogoButton() {
	const textHovered = useRef(false);
	const textAboveThreshold = useRef(true);
	const [textState, setTextState] = useState<"unmounted" | "invisible" | "enter" | "exit">("enter");

	function animateIn() {
		setTextState(prev => {
			if (prev === "invisible" || prev === "enter") return prev;
			return "invisible"
		});
	}
	function animateOut() {
		if (textAboveThreshold.current || textHovered.current) return;
		setTextState("exit");
	}

	useEffect(() => {
		if (textState === "invisible")
			setTextState("enter");
	}, [textState]);

	useEffect(() => {
		function onScroll() {
			const aboveThreshold = window.scrollY <= window.innerHeight / 2;
			if (textAboveThreshold.current === aboveThreshold) return;

			if ((textAboveThreshold.current = aboveThreshold)) animateIn();
			else animateOut();
		}
		onScroll();
		window.addEventListener("scroll", onScroll);
		return () => window.addEventListener("scroll", onScroll);
	}, []);

	return <motion.button
		layout="size"
		className="display-text"
		style={{ borderRadius: '16px' }}
		css={css`
			padding-block: 16px;
			padding-inline: 24px;
			corner-shape: squircle;
			background-color: oklch(from var(--background) 0.12 c h / 0.9);
			display: flex;
			align-items: center;
			gap: 16px;
			font-weight: 500;
		`}
		onHoverStart={_ => {
			textHovered.current = true;
			animateIn();
		}}
		onHoverEnd={_ => {
			textHovered.current = false;
			animateOut();
		}}
		onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
	>
		<motion.span layout>
			<TechKunLogo style={{ display: "block" }} />
		</motion.span>
		{textState !== "unmounted" && <span
            css={css`
				color: transparent;
				background-image: linear-gradient(
					to right in oklch,
					var(--foreground) 33.33%,
					var(--secondary-500),
					var(--primary-500),
					transparent 66.66%
				);
				text-box-trim: trim-both;
				background-size: 300% 100%;
				background-clip: text;
				background-position-y: 50%;
				background-position-x: 0;
				transition: background-position-x 0.6s ease-in-out;
				&[data-state="invisible"] {
					background-position-x: 100%;
				}
				&[data-state="exit"] {
					transition-duration: 0.3s;
					background-position-x: 100%;
				}
			`}
            data-state={textState}
            onTransitionEnd={() => textState === "exit" && setTextState("unmounted")}
        >TechKun</span>}
	</motion.button>;
};