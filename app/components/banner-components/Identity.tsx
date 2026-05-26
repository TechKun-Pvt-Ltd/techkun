import {css} from "@emotion/react";
import React from "react";

export default function Identity({style, ...props}: React.ComponentPropsWithoutRef<"span">) {
	// const id = useId();
	// const gradientId = "gradient-" + id;

	const iCss = css`
		position: relative;
		color: transparent;

		svg.icon {
			transform: translateX(6%);
			transform-box: view-box;
			position: absolute;
			inset: 0;
			height: auto;
			width: 100%;
			color: var(--foreground);
		}

		svg.bulb-icon {
			top: 0.24em;
			--_width: 90%;
			transform: translateX(calc(-1 * (var(--_width) - 100%) / 2 + 8%));
			transform-origin: center bottom;
			width: var(--_width);
			fill: currentColor;
			
			// &[data-clicked] {
			// 	fill: url(#{gradientId});
			// }
		}
		svg.dots {
			top: calc(0.32em + 1cap - 1ex);
			height: 1ex;
		}
	`;

	return <span
		style={{color: 'var(--foreground)', ...style}}
		{...props}
		// onClick={e => {
		// 	const target = e.currentTarget.querySelector("svg.bulb-icon");
		// 	target?.toggleAttribute("data-clicked");
		// }}
	>
		{/*<svg width="0" height="0" style={{position: "absolute"}}>*/}
		{/*	<linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">*/}
		{/*		<stop offset="0%" stopColor="var(--neutral-50)"/>*/}
		{/*		<stop offset="33.33%" stopColor="var(--primary-50)"/>*/}
		{/*		<stop offset="66.66%" stopColor="var(--secondary-50)"/>*/}
		{/*		<stop offset="100%" stopColor="var(--tertiary-50)"/>*/}
		{/*	</linearGradient>*/}
		{/*</svg>*/}
		<span css={iCss}>
			i
			<svg className="icon bulb-icon" xmlns="http://www.w3.org/2000/svg" viewBox="-1 -6 12 15" fill="currentColor">
				<path
					d="M 0 0 C 0 -2.7614 2.2386 -5 5 -5 C 7.7614 -5 10 -2.7614 10 0 C 10 1.3261 9.4732 2.5979 8.5355 3.5355 C 7.5979 4.4732 7.0711 5.745 7.0711 7.0711 C 7.0711 7.6234 6.6234 8.0711 6.0711 8.0711 L 3.9289 8.0711 C 3.3766 8.0711 2.9289 7.6234 2.9289 7.0711 C 2.9289 5.745 2.4021 4.4732 1.4645 3.5355 C 0.5268 2.5979 0 1.3261 0 0"
				/>
			</svg>
			<svg className="icon dots" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
				<circle r="10%" cx="50%" cy="10%" /*fill="var(--neutral-400)"*/ />
				<circle r="10%" cx="50%" cy="36.66%" fill="var(--primary-200)" />
				<circle r="10%" cx="50%" cy="63.33%" fill="var(--secondary-200)" />
				{/*<circle r="10%" cx="50%" cy="89.98%" />*/}
				<circle r="10%" cx="50%" cy="90%" fill="var(--tertiary-200)" />
			</svg>
		</span>
		dentity
	</span>;
}