'use client';
import React, {ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef} from 'react';
import {animate, motion, steps, useMotionValue, useTransform} from 'motion/react';

export type TextScrambleRef<C extends React.ElementType> = {
	scramble(): void;
	getInnerRef(): React.ComponentRef<C> | null;
};

type TextScrambleOwnProps<C extends React.ElementType> = {
	children?: string;
	duration?: number;
	characterSet?: string;
	as?: C;
	onScrambleComplete?: () => void;
};

export type TextScrambleProps<C extends React.ElementType> =
	TextScrambleOwnProps<C>
	& Omit<React.ComponentPropsWithoutRef<C>, keyof TextScrambleOwnProps<C>>;

type TextScrambleComponent = <C extends React.ElementType = 'p'>(
	props: TextScrambleProps<C> & React.RefAttributes<TextScrambleRef<C>>
) => React.ReactNode;

// const DEFAULT_CHARS =
// 	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`-=[]\\\';,./~_+{}|:\"<>?!@#$%^&*()";
const DEFAULT_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`░▒▓█▀▄■□▪▫●○◆◇◈◊※†‡";

const SCRAMBLE_CHAR_COUNT = 6;

export const TextScramble = forwardRef(
	<C extends React.ElementType>(
		{
			children: text = "",
			duration = 1.6,
			characterSet = DEFAULT_CHARS,
			className,
			as,
			onScrambleComplete,
			...props
		}: TextScrambleProps<C>,
		ref: ForwardedRef<TextScrambleRef<C>>
	) => {
		const elementRef = useRef<React.ComponentRef<C>>(null);
		const Component = (as ?? 'p') as C;
		const MotionComponent = motion.create(Component);
		const prevText = useRef('');
		const cursor = useMotionValue(0);
		const isAnimating = useRef(false);

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
				ease: steps(duration / 0.05),
				onComplete() {
					isAnimating.current = false;
					prevText.current = text;
					cursor.set(0);
					onScrambleComplete?.();
				},
			});
		}

		useImperativeHandle(ref, () => ({
			scramble,
			getInnerRef() {
				return elementRef.current;
			}
		}), [text]);

		return (
			<MotionComponent ref={elementRef} className={className} {...props}>
				{displayText}
			</MotionComponent>
		);
	}
) as TextScrambleComponent;