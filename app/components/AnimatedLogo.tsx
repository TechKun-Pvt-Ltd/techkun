'use client';
import React, {memo, useEffect} from "react";

// const width = 935.02;
// const height = 775;
// const aspectRatio = width / height;

// const pathDs = logoAnimation.frames.map(p => `path('${p.value}')`);

function AnimatedLogo(props: {
    width?: string | number;
    height?: string | number;
}) {
    // const pathD = useRef<SVGPathElement>(null);

    function play() {
        // pathD.current?.animate({
        //     transform: ["translateX(-35%)", "translateX(0)"]
        // }, {
        //     duration: 1000, easing: 'ease-in-out', fill: "both"
        // });
        // pathD.current?.animate({
        //     d: pathDs
        // }, {
        //     delay: 250, duration: logoAnimation.duration * 1000, easing: "linear", fill: "both"
        // });
    }

    useEffect(play, []);

    return <>

    </>;
}

export default memo(AnimatedLogo);