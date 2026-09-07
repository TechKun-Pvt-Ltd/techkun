import {css, keyframes} from "@emotion/react";
import React, {forwardRef, useImperativeHandle, useRef} from "react";
import BANNER_ANIMATION from "@/app/animations/banner";
import useAbortSignal from "@/hooks/use-abort-signal";
import supportsQuery from "@/app/utils/css/supports-query";
import cssSupports from "@/app/utils/css/supports";

const { pointerMove, pointerMoveBack, dotsPull, dotsRelease, initialDotsLightUp } = BANNER_ANIMATION;

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
const pullTimingFunction = "cubic-bezier(0.32, 0.019, 0, 0.987)";
// language=CSS prefix="div { transition-timing-function: " suffix="; }"
const releaseTimingFunction = "linear(0, 0.003 0.2%, 0.016 0.5%, 0.03 0.7%, 0.06 1%, 0.132 1.5%, 0.226 2%, 0.338 2.5%, 0.464 3%, 0.933 4.7%, 1.116 5.4%, 1.256 6%, 1.375 6.6%, 1.469 7.2%, 1.527 7.7%, 1.552 8%, 1.565 8.2%, 1.579 8.5%, 1.585 8.8%, 1.586 9%, 1.581 9.3%, 1.574 9.5%, 1.559 9.8%, 1.522 10.3%, 1.458 10.9%, 1.393 11.4%, 1.32 11.9%, 1.045 13.6%, 0.937 14.3%, 0.855 14.9%, 0.784 15.5%, 0.728 16.1%, 0.693 16.6%, 0.67 17.1%, 0.662 17.4%, 0.657 17.7%, 0.657 17.9%, 0.659 18.2%, 0.662 18.4%, 0.671 18.7%, 0.692 19.2%, 0.729 19.8%, 0.766 20.3%, 0.809 20.8%, 0.979 22.6%, 1.042 23.3%, 1.09 23.9%, 1.13 24.5%, 1.162 25.1%, 1.182 25.6%, 1.195 26.1%, 1.199 26.4%, 1.201 26.7%, 1.199 27.2%, 1.192 27.7%, 1.178 28.2%, 1.156 28.8%, 1.109 29.8%, 0.977 32.2%, 0.949 32.8%, 0.925 33.4%, 0.906 34%, 0.894 34.5%, 0.886 35%, 0.882 35.6%, 0.883 36.1%, 0.887 36.6%, 0.895 37.1%, 0.907 37.7%, 0.935 38.7%, 1.012 41.1%, 1.031 41.8%, 1.045 42.4%, 1.056 43%, 1.063 43.5%, 1.067 44%, 1.069 44.5%, 1.067 45.4%, 1.059 46.3%, 1.042 47.4%, 0.997 49.8%, 0.979 50.9%, 0.97 51.6%, 0.965 52.2%, 0.96 53.4%, 0.961 54.3%, 0.966 55.3%, 0.975 56.3%, 1.002 58.8%, 1.013 59.9%, 1.02 61.1%, 1.024 62.3%, 1.023 63.2%, 1.02 64.2%, 0.993 68.8%, 0.988 70%, 0.986 71.2%, 0.988 73.2%, 1.004 77.6%, 1.008 79.9%, 1.007 82%, 0.998 86.6%, 0.995 88.9%, 0.996 91.1%, 1.002 96.6%, 1)";

const DOT_COUNT = 4;

const lightUpColorProp = "--light-up-color";

const pullKeyframes = keyframes`
	to {
		transform: translate(calc(var(--pull-factor) * -10%), calc(var(--pull-factor) * 40%));
	}
`;

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

			if (!cssSupports.shape) {
				const pointer = el.querySelector("span.pointer");
				const translateXKeyframes = { "--translate-x": ["0%", "-3.52em"] };
				const translateYKeyframes = { "--translate-y": ["0%", "0.65em"] };
				const rotateKeyframes = { "--rotate": ["var(--rotation-angle)", "0deg"] };
				const translateXOptions: KeyframeAnimationOptions = {
					duration: pointerMove.duration * 1000,
					easing: "cubic-bezier(0.729, -0.424, 0.769, 0.958)",
					fill: "forwards"
				};
				const translateYOptions: KeyframeAnimationOptions = {
					duration: pointerMove.duration * 1000,
					easing: "cubic-bezier(0.33, 1.997, 0.649, 1.653)",
					fill: "forwards"
				};
				const rotateOptions: KeyframeAnimationOptions = {
					duration: pointerMove.duration * 1000,
					easing: "ease-in-out",
					fill: "forwards"
				};

				pointer?.animate(translateXKeyframes, translateXOptions);
				pointer?.animate(translateYKeyframes, translateYOptions);
				pointer?.animate(rotateKeyframes, rotateOptions);
				pointer?.animate({
					"--pull-x": "calc(var(--pull-factor) * -10%)",
					"--pull-y": "calc(var(--pull-factor) * 40%)"
				}, {
					duration: dotsPull.duration * 1000,
					delay: dotsPull.delay * 1000,
					easing: pullTimingFunction,
					fill: "both"
				});

				const reverseDelay: KeyframeAnimationOptions = { duration: pointerMoveBack.duration * 1000, delay: pointerMoveBack.delay * 1000, direction: "reverse" };
				pointer?.animate(translateXKeyframes, {...translateXOptions, ...reverseDelay});
				pointer?.animate(translateYKeyframes, {...translateYOptions, ...reverseDelay});
				pointer?.animate(rotateKeyframes, {...rotateOptions, ...reverseDelay});
				pointer?.animate({ "--pull-x": "0%", "--pull-y": "0%" }, {
					duration: pointerMoveBack.duration * 1000,
					delay: pointerMoveBack.delay * 1000,
					easing: "ease-in-out",
					fill: "both"
				});
			}
		}
	}), []);

	return <span
		style={{color: 'var(--foreground)', position: "relative", display: "inline-block", ...style} as React.CSSProperties}
		{...props}
		ref={spanRef}
		data-lights-off
	>
		<span className="pointer" css={css`
			position: absolute;
			color: var(--neutral-100);
			--pull-factor: 0.5;
			--rotation-angle: -30deg;
			@supports ${supportsQuery.shape} {
				offset-path: shape(
					from calc(100% + 0.2em) 25%,
					curve to calc(100% - 0.25em) 110% with 0.6em 25% from start / 1em 0 from end,
					curve to 0.05em 70% with -1em 0 from start / 0.15em 0 from end
				);
				offset-distance: 0;
				offset-anchor: center center;
				offset-rotate: var(--rotation-angle);
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
						offset-rotate: var(--rotation-angle);
						transform: translate(0);
					}
				}

				[data-initial] & {
					animation:
						pointer-move ${pointerMove.duration}s ease-in-out both,
						${pullKeyframes} ${dotsPull.duration}s ${dotsPull.delay}s ${pullTimingFunction} both,
						pointer-move-back ${pointerMoveBack.duration}s ${pointerMoveBack.delay}s ease-in-out forwards;
				}
			}
			@supports not ${supportsQuery.shape} {
				@property --translate-x {
				  	syntax: "<length-percentage>";
					inherits: false;
					initial-value: 0px;
				}
				@property --translate-y {
				  	syntax: "<length-percentage>";
					inherits: false;
					initial-value: 0px;
				}
				@property --pull-x {
				  	syntax: "<length-percentage>";
					inherits: false;
					initial-value: 0px;
				}
				@property --pull-y {
				  	syntax: "<length-percentage>";
					inherits: false;
					initial-value: 0px;
				}
				@property --rotate {
				  	syntax: "<angle>";
					inherits: false;
					initial-value: 0deg;
				}
				--rotate: var(--rotation-angle);
				transform:
					translate(3.5em, -0.35em)
					translate(var(--translate-x), var(--translate-y))
					translate(var(--pull-x), var(--pull-y))
					rotate(var(--rotate));
			}
		`}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="0.275em" viewBox="0 0 24 24"
				stroke="currentColor" fill="currentColor"
				strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
			>
				<path d="M 11.572 3.866 a 0.495 0.495 45 0 1 0.9207 -0 l 6.7175 15.9099 a 0.5 0.5 45 0 1 -0.7142 0.6251 l -5.4476 -3.2131 a 2 2 45 0 0 -2.0315 -0.0021 l -5.4483 3.2152 a 0.5 0.5 45 0 1 -0.7142 -0.6251 z" />
			</svg>
		</span>
		<span css={css`
			position: relative;
			color: transparent;
			--x-offset: 6%;

			svg.icon {
				transform-box: view-box;
				position: absolute;
				inset: 0 0 0 var(--x-offset);
				height: auto;
				width: 100%;
				color: var(--neutral-700);
			}

			svg.bulb-icon, svg.dots circle {
				--stagger: ${dotsLightUp.stagger}s;
                --delay: ${dotsLightUp.delay}s;
				transition: fill ${dotsLightUp.duration}s ease-out;
                transition-delay: calc(var(--delay) + var(--i) * var(--stagger));
				fill: var(${lightUpColorProp});
			}
			svg.bulb-icon {
				--_bulb-icon-width: 120%;
				--_extra-x-space: calc((var(--_bulb-icon-width) - 100%) / 2);
				inset: 0.23em calc(-1 * var(--_extra-x-space)) auto calc(-1 * var(--_extra-x-space) + var(--x-offset));
				width: var(--_bulb-icon-width);

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
					--pull-factor: calc(0.25 + pow(1 - var(--i) / ${DOT_COUNT}, 2) * 0.75);
				}
			}
			[data-initial] & {
				svg.bulb-icon, svg.dots circle {
					--delay: ${initialDotsLightUp.delay}s;
					transition-duration: ${initialDotsLightUp.duration}s;
				}
				svg.dots circle {
					@keyframes release {
						to {
							transform: none;
						}
					}
					animation:
						${pullKeyframes} ${dotsPull.duration}s ${dotsPull.delay}s ${pullTimingFunction} both,
						release ${dotsRelease.duration}s ${dotsRelease.delay}s ${releaseTimingFunction} forwards;
				}
			}
			[data-lights-off] & {
				svg.bulb-icon, svg.dots circle {
					--stagger: ${dotsLightDown.stagger}s;
					--delay: ${dotsLightDown.delay}s;
					transition-duration: ${dotsLightDown.duration}s;
					fill: currentColor;
				}
            }
		`}>
			<svg className="icon bulb-icon"
				 xmlns="http://www.w3.org/2000/svg"
				 viewBox="0 0 24 24" fill="currentColor"
				 style={{ "--i": DOT_COUNT } as React.CSSProperties}
			>
				<path
					d="M 4.41 9.59 C 4.41 5.3982 7.8082 2 12 2 C 16.1918 2 19.59 5.3982 19.59 9.59 C 19.59 11.603 18.7903 13.5336 17.3669 14.9569 C 15.9436 16.3803 15.1439 18.3109 15.1439 20.3239 C 15.1439 21.1623 14.4643 21.8419 13.6259 21.8419 L 10.3741 21.8419 C 9.5357 21.8419 8.8561 21.1623 8.8561 20.3239 C 8.8561 18.3109 8.0564 16.3803 6.6331 14.9569 C 5.2097 13.5336 4.41 11.603 4.41 9.59"
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