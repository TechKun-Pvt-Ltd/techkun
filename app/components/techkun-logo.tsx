import {css} from "@emotion/react";
import {useEffect, useRef} from "react";

const width = 935.02;
const height = 775;
const aspectRatio = width / height;

export default function TechKunLogo() {
    const effectiveWidth = 1.5;
    const shimmerBgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        shimmerBgRef.current?.setAttribute("data-shimmer", "true");
    }, []);

    return <svg xmlns="http://www.w3.org/2000/svg"
        width={`${effectiveWidth}em`} height={`${effectiveWidth / aspectRatio}em`}
        viewBox={`0 0 ${width} ${height}`}
        onMouseEnter={_ => shimmerBgRef.current?.setAttribute('data-shimmer', "true")}
    >
        <foreignObject clipPath="url(#logo-clip-path)" width={width} height={height}>
            <div ref={shimmerBgRef} xmlns="http://www.w3.org/1999/xhtml"
                 css={css`
                     width: 100%;
                     aspect-ratio: ${width} / ${height};
                     background: linear-gradient(
                             75deg,
                             var(--primary-500) 0%,
                             var(--primary-500) 40%,
                             var(--primary-200),
                             var(--primary-50),
                             var(--primary-200),
                             var(--primary-500) 60%,
                             var(--primary-500) 100%
                     ) 100% center / 400% 100%;

                     &[data-shimmer="true"] {
                         transition: background-position-x 1s cubic-bezier(0.17, 0.03, 0.77, 0.93);
                         background-position-x: 0;
                     }
                 `}
                 onTransitionEnd={e => (e.target as HTMLDivElement).removeAttribute('data-shimmer')}
            ></div>
        </foreignObject>
    </svg>;
};