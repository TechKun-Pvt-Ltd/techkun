import {viewBoxString} from "@/app/utils/graphics-utils";
import logoPath from "@/public/logo-path.json";
import React from "react";

const aspectRatio = logoPath.viewBox.width / logoPath.viewBox.height;

export default function TechKunLogo(props: React.ComponentProps<"svg">) {
    const effectiveWidth = 1.52;

    return <svg
        width={`${effectiveWidth}em`} height={`${effectiveWidth / aspectRatio}em`}
        viewBox={viewBoxString(logoPath.viewBox)}
        {...props}
        xmlns="http://www.w3.org/2000/svg"
    >
        <use href="#logo-path" fill="var(--primary-color)"></use>
    </svg>;
};