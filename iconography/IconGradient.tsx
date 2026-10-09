import React from "react";
import {gradientColor1, gradientColor2} from "@/app/utils/css/custom-properties";

// A linear gradient whose stops read gradientColor1 / gradientColor2. Both default to currentColor,
// so it is invisible until a parent sets them. For use inside a glyph's <defs>, with a scoped id:
// <IconGradient id={id("paint")} />, then stroke={url("paint")} or --icon-paint in the glyph's styles.
export default function IconGradient(
    {id, ...props}: {id: string} & Omit<React.SVGProps<SVGLinearGradientElement>, "id" | "children">
) {
    return <linearGradient id={id} x1="100%" y1="0%" x2="0%" y2="100%" {...props}>
        <stop offset="20%" stopColor={`var(${gradientColor1}, currentColor)`} />
        <stop offset="80%" stopColor={`var(${gradientColor2}, currentColor)`} />
    </linearGradient>;
}
