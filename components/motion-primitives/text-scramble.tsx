'use client';
import React, {ForwardedRef, forwardRef, useEffect, useRef} from 'react';
import {animate, motion, useMotionValue, useTransform} from 'motion/react';
import {PolymorphicComponentProps} from "@/app/utils/type-utils";

type PolymorphicRef<C extends React.ElementType> =
	React.ComponentPropsWithRef<C>['ref'];

type TextScrambleOwnProps = {
	children?: string;
	duration?: number;
	characterSet?: string;
	onScrambleComplete?: () => void;
};

export type TextScrambleProps<C extends React.ElementType = 'p'> =
	React.PropsWithoutRef<PolymorphicComponentProps<C, TextScrambleOwnProps>>
	& { ref?: PolymorphicRef<C> };

type TextScrambleComponent = <C extends React.ElementType = 'p'>(
	props: TextScrambleProps<C>
) => React.ReactNode;

const defaultChars =
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`-=[]\\\';,./~_+{}|:\"<>?!@#$%^&*()";

const SCRAMBLE_CHAR_COUNT = 4;

export const TextScramble = forwardRef(
	<C extends React.ElementType>(
		{
			children,
			duration = 0.8,
			characterSet = defaultChars,
			className,
			as,
			onScrambleComplete,
			...props
		}: PolymorphicComponentProps<C, TextScrambleOwnProps>,
		ref: ForwardedRef<PolymorphicRef<C>>
	) => {
		const Component = (as ?? 'p') as React.ElementType;
		const MotionComponent = motion.create(Component);
		const prevText = useRef('');
		const cursor = useMotionValue(0);
		const isAnimating = useRef(false);
		const text = children ?? "";

		const displayText = useTransform(cursor, (c) => {
			if (c === 0) return prevText.current;

			c = Math.floor(c);
			let scrambleStart = c - SCRAMBLE_CHAR_COUNT;
			if (scrambleStart < 0) scrambleStart = 0;
			const largerLength = Math.max(prevText.current.length, text.length);
			if (scrambleStart >= largerLength) return text;

			const scrambleLength = Math.min(c, largerLength - scrambleStart, SCRAMBLE_CHAR_COUNT);
			let scramble = '';
			for (let i = 0; i < scrambleLength; i++) {
				scramble += characterSet[Math.floor(Math.random() * characterSet.length)];
			}

			return (
				text.slice(0, scrambleStart) +
				(scrambleStart > text.length
					? '\u00A0'.repeat(scrambleStart - text.length)
					: '') +
				scramble +
				prevText.current.slice(c)
			);
		});

		function scramble() {
			if (isAnimating.current) return;
			isAnimating.current = true;
			const largerLength = Math.max(prevText.current.length, text.length);
			animate(cursor, [0, largerLength + SCRAMBLE_CHAR_COUNT], {
				duration,
				onComplete() {
					isAnimating.current = false;
					prevText.current = text;
					onScrambleComplete?.();
				},
			});
		}

		useEffect(() => {
			scramble();
		}, [text]);

		return (
			<MotionComponent ref={ref} className={className} {...props}>
				{displayText}
			</MotionComponent>
		);
	}
) as TextScrambleComponent;