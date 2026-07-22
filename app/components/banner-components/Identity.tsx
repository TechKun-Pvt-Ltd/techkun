import {css} from "@emotion/react";
import React, {forwardRef, useImperativeHandle, useRef} from "react";
import BANNER_ANIMATION from "@/app/animations/banner";
import useAbortSignal from "@/hooks/use-abort-signal";

const { initialDotsLightUp, dotsLightUp, dotsLightDown } = BANNER_ANIMATION;

const DOT_COUNT = 4;

const lightUpColorProp = "--light-up-color";
const staggerProp = "--stagger";
const minDelayProp = "--min-delay";

const bulbIconWidthProp = "--_bulb-icon-width";

export type IdentityRef = {
	play(): void;
};

export default forwardRef<IdentityRef, React.ComponentPropsWithoutRef<"span">>(function Identity(
	{style, ...props}, ref
) {
	const spanRef = useRef<HTMLSpanElement>(null);
	const abortSignal = useAbortSignal();

	useImperativeHandle(ref, () => ({
		play() {
			if (!spanRef.current) return;
			const el = spanRef.current;
			el.setAttribute("data-initial", "true");
			el.removeAttribute("data-lights-off");
			el.addEventListener(
				"click",
				() => el.removeAttribute("data-initial"),
				{ once: true, signal: abortSignal }
			);
			el.addEventListener(
				"click",
				_ => el.toggleAttribute("data-lights-off"),
				{ signal: abortSignal }
			);
		}
	}), []);

	return <span
		style={{color: 'var(--foreground)', cursor: 'pointer', ...style} as React.CSSProperties}
		{...props}
		ref={spanRef}
		data-lights-off
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
				color: var(--neutral-700);
			}

			svg.bulb-icon, svg.dots circle {
				${staggerProp}: ${dotsLightUp.stagger}s;
                ${minDelayProp}: ${dotsLightUp.delay}s;
				transition: fill ${dotsLightUp.duration}s ease-out;
                transition-delay: calc(var(${minDelayProp}) + var(--i) * var(${staggerProp}));
				fill: var(${lightUpColorProp});
			}
			svg.bulb-icon {
				top: 0.24em;
				${bulbIconWidthProp}: 90%;
				transform: translateX(calc(-1 * (var(${bulbIconWidthProp}) - 100%) / 2 + 8%));
				transform-origin: center bottom;
				width: var(${bulbIconWidthProp});

				${lightUpColorProp}: var(--foreground);
			}
			svg.dots {
				overflow: visible;
				top: calc(0.32em + 1cap - 1ex);
				height: 1ex;
				circle {
					&:nth-of-type(1) {
						${lightUpColorProp}: var(--foreground);
					}
					&:nth-of-type(2) {
						${lightUpColorProp}: var(--primary-300);
					}
					&:nth-of-type(3) {
						${lightUpColorProp}: var(--secondary-300);
					}
					&:nth-of-type(4) {
						${lightUpColorProp}: var(--tertiary-300);
					}
					--stretch-index: calc(0.25 + pow(1 - var(--i) / ${DOT_COUNT}, 2) * 0.75);
				}
			}
			[data-initial] & {
				svg.bulb-icon, svg.dots circle {
					${minDelayProp}: calc(${initialDotsLightUp.delay}s + var(--stretch-duration));
					transition-duration: ${initialDotsLightUp.duration}s;
				}
				svg.dots circle {
					@keyframes stretch {
						to {
							transform: translate(calc(var(--stretch-index) * -10%), calc(var(--stretch-index) * 40%));
						}
					}
					@keyframes release {
						to {
							transform: translate(0);
						}
					}
					animation:
						stretch var(--stretch-duration) ${initialDotsLightUp.delay}s var(--stretch-timing-function) both,
						release var(--release-duration) calc(${initialDotsLightUp.delay}s + var(--stretch-duration)) var(--release-timing-function) forwards;
				}
			}
			[data-lights-off] & {
				svg.bulb-icon, svg.dots circle {
					${staggerProp}: ${dotsLightDown.stagger}s;
					${minDelayProp}: ${dotsLightDown.delay}s;
					transition-duration: ${dotsLightDown.duration}s;
					fill: currentColor;
				}
            }
		`}>
			<svg className="icon bulb-icon"
				 xmlns="http://www.w3.org/2000/svg"
				 viewBox="-1 -6 12 15" fill="currentColor"
				 style={{ "--i": DOT_COUNT } as React.CSSProperties}
			>
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
						style={{ '--i': DOT_COUNT - (i + 1) } as React.CSSProperties}
					/>
				))}
			</svg>
			i
		</span>
		dentity
	</span>;
});