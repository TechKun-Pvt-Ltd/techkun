import {css, keyframes} from "@emotion/react";
import React from "react";

const lightUp = keyframes`
	from {
		fill: currentColor;
	}
	to {
		fill: var(--light-up-color);
	}
`;
const lightDown = keyframes`
	from {
		fill: var(--light-up-color);
	}
	to {
		fill: currentColor;
	}
`;

const DOT_COUNT = 4;
const MIN_DELAY = 0.4;
const STAGGER = 0.1;
let minDelaySetToZero = false;

export default function Identity({style, ...props}: React.ComponentPropsWithoutRef<"span">) {
	return <span
		style={{color: 'var(--foreground)', cursor: 'pointer', '--min-delay': MIN_DELAY + 's', ...style} as React.CSSProperties}
		{...props}
		onClick={ev => {
			ev.currentTarget.toggleAttribute("data-clicked");
			if (!minDelaySetToZero) {
				minDelaySetToZero = true;
				ev.currentTarget.style.setProperty("--min-delay", '0s');
			}
		}}
	>
		<span css={css`
			position: relative;
			color: transparent;
	
			svg.icon {
				transform: translateX(6%);
				transform-box: view-box;
				position: absolute;
				inset: 0;
				height: auto;
				width: 100%;
				color: var(--neutral-800);
			}
	
			svg.bulb-icon, svg.dots circle {
                animation: ${lightUp} 0.2s both;
			}
			svg.bulb-icon {
				top: 0.24em;
				--_width: 90%;
				transform: translateX(calc(-1 * (var(--_width) - 100%) / 2 + 8%));
				transform-origin: center bottom;
				width: var(--_width);
				--light-up-color: var(--foreground);
				animation-delay: calc(var(--min-delay) + ${DOT_COUNT * STAGGER}s);
			}
			svg.dots {
				top: calc(0.32em + 1cap - 1ex);
				height: 1ex;
				circle {
					&:nth-of-type(1) {
						--light-up-color: var(--foreground);
					}
					&:nth-of-type(2) {
						--light-up-color: var(--primary-300);
					}
					&:nth-of-type(3) {
						--light-up-color: var(--secondary-300);
					}
					&:nth-of-type(4) {
						--light-up-color: var(--tertiary-300);
					}

					animation-delay: calc(var(--min-delay) + (${DOT_COUNT - 1} - var(--i)) * ${STAGGER}s);
				}
			}
			[data-clicked] & {
				svg.bulb-icon, svg.dots circle {
					animation-name: ${lightDown};
					animation-delay: 0s;
				}
            }
		`}>
			i
			<svg className="icon bulb-icon" xmlns="http://www.w3.org/2000/svg" viewBox="-1 -6 12 15" fill="currentColor">
				<path
					d="M 0 0 C 0 -2.7614 2.2386 -5 5 -5 C 7.7614 -5 10 -2.7614 10 0 C 10 1.3261 9.4732 2.5979 8.5355 3.5355 C 7.5979 4.4732 7.0711 5.745 7.0711 7.0711 C 7.0711 7.6234 6.6234 8.0711 6.0711 8.0711 L 3.9289 8.0711 C 3.3766 8.0711 2.9289 7.6234 2.9289 7.0711 C 2.9289 5.745 2.4021 4.4732 1.4645 3.5355 C 0.5268 2.5979 0 1.3261 0 0"
				/>
			</svg>
			<svg className="icon dots" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
				{Array.from({length: DOT_COUNT}).map((_, i) => (
					<circle
						key={i}
						r="10%" cx="50%"
						cy={(10 + i * 80 / (DOT_COUNT - 1)) + '%'}
						style={{ '--i': i } as React.CSSProperties}
					/>
				))}
			</svg>
		</span>
		dentity
	</span>;
}