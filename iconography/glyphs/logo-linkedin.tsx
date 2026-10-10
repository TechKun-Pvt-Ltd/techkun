"use client"
import {css} from "@emotion/react";
import createIcon from "@/iconography/create-icon";
import SVGBrandGradient from "@/iconography/gradients/SVGBrandGradient";
import {LINKEDIN_LOGO_PATH_HREF} from "@/app/components/SVGSprite.tsx";

export default createIcon({
    name: "logo-linkedin",
    kind: "brand",
    styles: ({url}) => css`
        --icon-paint: ${url("paint")};
    `,
    render: ({id}) => <>
        <defs>
            <SVGBrandGradient id={id("paint")} />
        </defs>
        <use href={LINKEDIN_LOGO_PATH_HREF} />
    </>
});
