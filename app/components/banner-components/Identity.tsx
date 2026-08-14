import {css} from "@emotion/react";
import React, {forwardRef, useImperativeHandle, useRef} from "react";
import BANNER_ANIMATION from "@/app/animations/banner";
import useAbortSignal from "@/hooks/use-abort-signal";

const { pointerMove, pointerMoveBack, dotsStretch, dotsRelease, initialDotsLightUp } = BANNER_ANIMATION;

const dotsLightUp = {
	delay: 0,
	duration: 0.8,
	stagger: 0.1
};
const dotsLightDown = {
	delay: 0,
	duration: 0.4,
	stagger: 0
};

// language=CSS prefix="div { transition-timing-function: " suffix="; }"
const stretchTimingFunction = "cubic-bezier(0.32, 0.019, 0, 0.987)";
// language=CSS prefix="div { transition-timing-function: " suffix="; }"
const releaseTimingFunction = "linear(0, 0.003 0.2%, 0.016 0.5%, 0.03 0.7%, 0.06 1%, 0.132 1.5%, 0.226 2%, 0.338 2.5%, 0.464 3%, 0.933 4.7%, 1.116 5.4%, 1.256 6%, 1.375 6.6%, 1.469 7.2%, 1.527 7.7%, 1.552 8%, 1.565 8.2%, 1.579 8.5%, 1.585 8.8%, 1.586 9%, 1.581 9.3%, 1.574 9.5%, 1.559 9.8%, 1.522 10.3%, 1.458 10.9%, 1.393 11.4%, 1.32 11.9%, 1.045 13.6%, 0.937 14.3%, 0.855 14.9%, 0.784 15.5%, 0.728 16.1%, 0.693 16.6%, 0.67 17.1%, 0.662 17.4%, 0.657 17.7%, 0.657 17.9%, 0.659 18.2%, 0.662 18.4%, 0.671 18.7%, 0.692 19.2%, 0.729 19.8%, 0.766 20.3%, 0.809 20.8%, 0.979 22.6%, 1.042 23.3%, 1.09 23.9%, 1.13 24.5%, 1.162 25.1%, 1.182 25.6%, 1.195 26.1%, 1.199 26.4%, 1.201 26.7%, 1.199 27.2%, 1.192 27.7%, 1.178 28.2%, 1.156 28.8%, 1.109 29.8%, 0.977 32.2%, 0.949 32.8%, 0.925 33.4%, 0.906 34%, 0.894 34.5%, 0.886 35%, 0.882 35.6%, 0.883 36.1%, 0.887 36.6%, 0.895 37.1%, 0.907 37.7%, 0.935 38.7%, 1.012 41.1%, 1.031 41.8%, 1.045 42.4%, 1.056 43%, 1.063 43.5%, 1.067 44%, 1.069 44.5%, 1.067 45.4%, 1.059 46.3%, 1.042 47.4%, 0.997 49.8%, 0.979 50.9%, 0.97 51.6%, 0.965 52.2%, 0.96 53.4%, 0.961 54.3%, 0.966 55.3%, 0.975 56.3%, 1.002 58.8%, 1.013 59.9%, 1.02 61.1%, 1.024 62.3%, 1.023 63.2%, 1.02 64.2%, 0.993 68.8%, 0.988 70%, 0.986 71.2%, 0.988 73.2%, 1.004 77.6%, 1.008 79.9%, 1.007 82%, 0.998 86.6%, 0.995 88.9%, 0.996 91.1%, 1.002 96.6%, 1)";

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

			const circles = el.querySelectorAll<SVGCircleElement>("svg.dots circle");
			const lastCircle = circles.item(circles.length - 1);

			const animationEndAbortCtrl = new AbortController();
			lastCircle.addEventListener("animationend", ev => {
				if (ev.animationName !== "release") return;

				el.style.cursor = "pointer";
				el.addEventListener(
					"click", () => el.removeAttribute("data-initial"),
					{ once: true, signal: abortSignal }
				);
				el.addEventListener(
					"click", () => el.toggleAttribute("data-lights-off"),
					{ signal: abortSignal }
				);
				// At first glance, you might wonder why I haven't used the `once` option instead.
				// Well, since we can't target a specific animation by name, the listener needs to be invoked more than once so it can target the end of the correct animation and then remove itself after that single execution.
				animationEndAbortCtrl.abort();
			}, { signal: AbortSignal.any([abortSignal, animationEndAbortCtrl.signal]) });
		}
	}), []);

	return <span
		style={{color: 'var(--foreground)', position: "relative", display: "inline-block", ...style} as React.CSSProperties}
		{...props}
		ref={spanRef}
		data-lights-off
	>
		<span css={css`
			position: absolute;
			color: var(--neutral-100);
			offset-path: shape(
				from calc(100% + 0.2em) 25%,
				curve to calc(100% - 0.25em) 110% with 0.6em 25% from start / 1em 0 from end,
				curve to 0.05em 70% with -1em 0 from start / 0.15em 0 from end
			);
			offset-distance: 0;
			offset-anchor: center center;
			offset-rotate: -30deg;
			@keyframes pointer-move {
				from {
					offset-distance: 0;
				}
				to {
					offset-distance: 99%;
					offset-rotate: 0deg;
				}
			}
			@keyframes pointer-move-back {
				from {
					offset-distance: 99%;
				}
				to {
					offset-distance: 0;
					offset-rotate: -30deg;
					transform: translate(0);
				}
			}
			--stretch-index: 0.5;
			[data-initial] & {
				animation:
					pointer-move ${pointerMove.duration}s ease-in-out both,
					stretch ${dotsStretch.duration}s ${dotsStretch.delay}s ${stretchTimingFunction} both,
					pointer-move-back ${pointerMoveBack.duration}s ${pointerMoveBack.delay}s ease-in-out forwards;
			}
		`}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="0.275em" viewBox="0 0 24 24"
				stroke="currentColor" fill="currentColor"
				strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
				className="pointer"
			>
				<path d="M 11.572 3.866 a 0.495 0.495 45 0 1 0.9207 -0 l 6.7175 15.9099 a 0.5 0.5 45 0 1 -0.7142 0.6251 l -5.4476 -3.2131 a 2 2 45 0 0 -2.0315 -0.0021 l -5.4483 3.2152 a 0.5 0.5 45 0 1 -0.7142 -0.6251 z" />
			</svg>
		</span>
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
					${minDelayProp}: ${initialDotsLightUp.delay}s;
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
						stretch ${dotsStretch.duration}s ${dotsStretch.delay}s ${stretchTimingFunction} both,
						release ${dotsRelease.duration}s ${dotsRelease.delay}s ${releaseTimingFunction} forwards;
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