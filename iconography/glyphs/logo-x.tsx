"use client"
import {css} from "@emotion/react";
import createIcon from "@/iconography/create-icon";
import IconGradient from "@/iconography/IconGradient";

export default createIcon({
    kind: "brand",
    styles: ({url}) => css`
        --icon-paint: ${url("paint")};
    `,
    render: ({id}) => <>
        <defs>
            <IconGradient id={id("paint")} />
        </defs>
        <path d="M 13.6755 10.6215 L 20.2327 3 h -1.554 l -5.6932 6.618 L 8.4383 3 H 3.1935 l 6.876 10.0072 L 3.1935 21 H 4.7475 l 6.012 -6.9885 L 15.5617 21 h 5.2447 z m -2.1278 2.4743 l -0.6967 -0.9968 L 5.307 4.17 h 2.3865 l 4.4737 6.399 l 0.6967 0.9968 l 5.8155 8.3175 h -2.3865 z" />
    </>
});
