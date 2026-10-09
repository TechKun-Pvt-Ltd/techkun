"use client"
import {css} from "@emotion/react";
import createIcon from "@/iconography/create-icon";
import SVGBrandGradient from "@/iconography/gradients/SVGBrandGradient";
import {X_LOGO_PATH_HREF} from "@/app/(site)/components/Shared.tsx";

export default createIcon({
    name: "logo-x",
    kind: "brand",
    styles: ({url}) => css`
        --icon-paint: ${url("paint")};
    `,
    render: ({id}) => <>
        <defs>
            <SVGBrandGradient id={id("paint")} />
        </defs>
        <use href={X_LOGO_PATH_HREF} />
    </>
});
