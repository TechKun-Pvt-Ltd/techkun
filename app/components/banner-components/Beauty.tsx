import React from "react";
import {css, keyframes} from "@emotion/react";
import {motion, MotionStyle} from "motion/react";
import {useFollowPointer} from "@/hooks/use-follow-pointer";


const gradientFill = keyframes`
    0% {
        --gradient-fill-progress: -25%;
    }
    100% {
        --gradient-fill-progress: 100%;
    }
`;
const DEFAULT_CENTER: [string, string] = ["55%", "90%"];

export default function Beauty({style, ...props}: React.ComponentPropsWithoutRef<typeof motion.span>) {
	const {x, y, containerRef} = useFollowPointer({ defaultPosition: DEFAULT_CENTER });

	return <motion.span
		ref={containerRef}
		style={{
			...style,
			'--center-x': x,
			'--center-y': y
		} as React.CSSProperties}
		{...props}
		css={css`
            color: transparent;
            background-image:
                radial-gradient(
                    circle at var(--center-x) var(--center-y),
                    var(--secondary-300) calc(var(--gradient-fill-progress) / 4),
                    var(--secondary-500) calc(var(--gradient-fill-progress) / 4),
                    var(--primary-500) var(--gradient-fill-progress),
					transparent calc(var(--gradient-fill-progress) + 25%)
                );
			background-color: var(--neutral-800);
            background-clip: text;
            animation: ${gradientFill} 2.4s 0.4s ease-out both;
		`}
	>beauty</motion.span>;
}
