import {css} from "@emotion/react";
import React, {useId} from "react";

export default function Identity({style, ...props}: React.ComponentPropsWithoutRef<"span">) {
	const id = useId();
	const gradientId = "gradient-" + id;

	const iCss = css`
		position: relative;

		.letter-i {
			clip-path: inset(0.44em 0 0 0);
		}
		svg.icon {
			transform: translateX(4%);
			transform-box: view-box;
			position: absolute;
			inset: 0;
			height: auto;
			width: 100%;
			color: var(--neutral-400);
		}

		svg.bulb-icon {
			top: 0.18em;
			//--_width: 100%;
			//transform: translateX(calc(-100 * (var(--_width) - 100%) / (2 * 120) + 4%));
			//transform-origin: center bottom;
			fill: currentColor;

			&[data-clicked] {
				fill: url(#${gradientId});
			}
		}
		svg.cross-icon {
			top: 0.23em;
		}
	`;

	return <span
		style={{color: 'var(--foreground)', cursor: 'pointer', ...style}}
		{...props}
		onClick={e => {
			const target = e.currentTarget.querySelector("svg.bulb-icon");
			target?.toggleAttribute("data-clicked");
		}}
	>
		<svg width="0" height="0" style={{position: "absolute"}}>
			<linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
				<stop offset="0%" stopColor="var(--primary-50)"/>
				<stop offset="100%" stopColor="var(--secondary-50)"/>
				{/*<stop offset="100%" stopColor="var(--foreground)"/>*/}
				{/*<stop offset="100%" stopColor="oklch(from var(--primary-500) l c calc(h + 40))"/>*/}
			</linearGradient>
		</svg>
		<span css={iCss}>
			<span className="letter-i">i</span>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
				 stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
				 className="icon cross-icon"
			>
				<path d="M 18 7 l -11 11"/>
				<path d="M 7 7 L 18 18"/>
			</svg>
		</span>
		dent
		<span css={iCss}>
			<span className="letter-i">i</span>
			<svg className="icon bulb-icon" xmlns="http://www.w3.org/2000/svg" viewBox="-1 -6 12 15">
				<path
					d="M 0 0 C 0 -2.7614 2.2386 -5 5 -5 C 7.7614 -5 10 -2.7614 10 0 C 10 1.3261 9.4732 2.5979 8.5355 3.5355 C 7.5979 4.4732 7.0711 5.745 7.0711 7.0711 C 7.0711 7.6234 6.6234 8.0711 6.0711 8.0711 L 3.9289 8.0711 C 3.3766 8.0711 2.9289 7.6234 2.9289 7.0711 C 2.9289 5.745 2.4021 4.4732 1.4645 3.5355 C 0.5268 2.5979 0 1.3261 0 0"
				/>
			</svg>
		</span>
		ty
	</span>;
}