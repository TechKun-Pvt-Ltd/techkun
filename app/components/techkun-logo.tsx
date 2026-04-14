import {css} from "@emotion/react";
import {useEffect, useRef} from "react";
import {viewBoxString} from "@/app/utils/graphics-utils";
import logoPath from "@/public/logo-path.json";

const aspectRatio = logoPath.viewBox.width / logoPath.viewBox.height;

export default function TechKunLogo() {
    const effectiveWidth = 1.5;
    const shimmerBgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        shimmerBgRef.current?.setAttribute("data-shimmer", "true");
    }, []);

    return <svg xmlns="http://www.w3.org/2000/svg"
        width={`${effectiveWidth}em`} height={`${effectiveWidth / aspectRatio}em`}
        viewBox={viewBoxString(logoPath.viewBox)}
        onMouseEnter={_ => shimmerBgRef.current?.setAttribute('data-shimmer', "true")}
    >
        <foreignObject clipPath="url(#logo-clip-path)" width="100%" height="100%">
            <div ref={shimmerBgRef} xmlns="http://www.w3.org/1999/xhtml"
                 css={css`
                     width: 100%;
                     height: 100%;
                     background: linear-gradient(
                         80deg,
                         var(--primary-500) 0%,
                         var(--primary-500) 40%,
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