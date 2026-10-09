"use client"
import {css} from "@emotion/react";
import createIcon from "@/iconography/create-icon";
import IconGradient from "@/iconography/IconGradient";
import {LINKEDIN_LOGO_PATH_HREF} from "@/app/(site)/components/Shared.tsx";

export default createIcon({
    name: "logo-linkedin",
    kind: "brand",
    styles: ({url}) => css`
        --icon-paint: ${url("paint")};
    `,
    render: ({id}) => <>
        <defs>
            <IconGradient id={id("paint")} />
        </defs>
        <use href={LINKEDIN_LOGO_PATH_HREF} />
    </>
});
