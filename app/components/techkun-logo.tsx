import {viewBoxString} from "@/app/utils/graphics-utils";
import logoPath from "@/public/logo-path.json";
import React from "react";
import {LOGO_PATH_HREF} from "@/app/Shared";

export default function TechKunLogo(props: React.ComponentProps<"svg">) {
    return <svg
        width="1lh" viewBox={viewBoxString(logoPath.viewBox)}
        {...props}
        xmlns="http://www.w3.org/2000/svg"
    >
        <use href={LOGO_PATH_HREF} fill="var(--primary-color)"></use>
    </svg>;
};