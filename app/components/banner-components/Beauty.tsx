import React from "react";
import {css} from "@emotion/react";
import {motion, MotionStyle} from "motion/react";
import {useFollowPointer} from "@/hooks/use-follow-pointer";


// const gradientMove = keyframes`
//     0% {
//         --gradient-end: 0%;
//     }
//     66%, 100% {
//         --gradient-end: 115%;
//     }
// `;
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
            //@property --gradient-end {
            //    syntax: "<length-percentage>";
            //    inherits: false;
            //    initial-value: 0%;
            //}
            color: transparent;
            background-image:
                radial-gradient(
                    circle at var(--center-x) var(--center-y),
                    var(--secondary-300) 25%,
                    var(--secondary-500) 25%,
                    var(--primary-500)
                );
            background-clip: text;
            //animation: {gradientMove} 4s linear infinite;
		`}
	>beauty</motion.span>;
}
