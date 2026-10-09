import React from "react";
import {css} from "@emotion/react";

const name = "svg-brand-gradient";
const color1 = `--${name}-color-1`;
const color2 = `--${name}-color-2`;
// Class for the interactive element whose :hover / :focus-visible turns the gradient's stops to the brand colors.
const hostClassName = `${name}-host`;

// The stops transition stop-color rather than the custom properties: unregistered, those can't interpolate.
const styles = css`
    stop {
        transition: stop-color 0.3s var(--ease-out-cubic);
    }
    .${hostClassName}:is(:hover, :focus-visible) & {
        ${color1}: var(--color-brand-1);
        ${color2}: var(--color-brand-3);
    }
`;

// A linear gradient in currentColor that turns to the brand colors while an SVGBrandGradient.host ancestor
// is hovered or focused. For use inside a glyph's <defs>, with a scoped id:
// <SVGBrandGradient id={id("paint")} />, then stroke={url("paint")} or --icon-paint in the glyph's styles.
function SVGBrandGradient(
    {id, ...props}: {id: string} & Omit<React.SVGProps<SVGLinearGradientElement>, "id" | "children">
) {
    return <linearGradient id={id} x1="100%" y1="0%" x2="0%" y2="100%" css={styles} {...props}>
        <stop offset="20%" stopColor={`var(${color1}, currentColor)`} />
        <stop offset="80%" stopColor={`var(${color2}, currentColor)`} />
    </linearGradient>;
}
SVGBrandGradient.host = hostClassName;
export default SVGBrandGradient;
