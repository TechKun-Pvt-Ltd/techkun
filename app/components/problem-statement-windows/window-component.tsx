import {css} from "@emotion/react";
import {ReactNode} from "react";
import {property} from "@/app/utils/css-property";

const _borderRadius = property("_borderRadius")`
	syntax: "<length-percentage>";
	inherits: true;
	initial-value: 0;
`;
const _padding = property("_padding")`
	syntax: "<length-percentage>";
	inherits: true;
	initial-value: 0;
`;

const _bgColor = "--_bg-color";
function WindowControls() {
	return <div css={css`
		padding: calc(14px - var(${_padding})) 32px 14px;
		display: flex;
		gap: 8px;

		& > div {
			border-radius: 50%;
			width: 14px;
			height: 14px;
			background-color: var(${_bgColor});
			transition: background-color 0.1s ease-in-out;
		}
		&:hover > div {
			background-color: oklch(from var(${_bgColor}) 0.5 c h);
		}
	`}>
		<div css={css`${_bgColor}: oklch(0.4 0.1 28);`}/>
		<div css={css`${_bgColor}: oklch(0.4 0.1 96);`}/>
		<div css={css`${_bgColor}: oklch(0.4 0.1 140);`}/>
	</div>;
}

export type WindowProps = {
	title: string;
	minWidth?: string;
	width?: string;
	maxWidth?: string;
	minHeight?: string;
	height?: string;
	maxHeight?: string;
	inset?: string;
	children?: ReactNode;
};
export default function Window(
	{
		title,
		minWidth, width, maxWidth,
		minHeight, height, maxHeight,
		inset = "0",
		children
	}: WindowProps
) {
	return <div className="window"
		data-title={title}
		css={css`
			border: 1px solid var(--border);
			border-radius: var(${_borderRadius});
			corner-shape: squircle;
			background-color: var(--muted);
			padding: var(${_padding});
			${minWidth ? `min-width: ${minWidth};` : ""}
			${width ? `width: ${width};` : ""}
			${maxWidth ? `max-width: ${maxWidth};` : ""}
			${minHeight ? `min-height: ${minHeight};` : ""}
			${height ? `height: ${height};` : ""}
			${maxHeight ? `max-height: ${maxHeight};` : ""}
			position: absolute;
			inset: ${inset};
			display: flex;
			flex-direction: column;
		`}
	>
		<WindowControls />
		<div css={css`
			border: 1px solid var(--border);
			min-height: 0;
            flex-grow: 1;
            background-color: var(--background);
            border-radius: calc(var(${_borderRadius}) - var(${_padding}));
            corner-shape: squircle;
            display: flex;
			flex-direction: column;
		`}>{children}</div>
	</div>;
}

export const windowCssProperties = {
	_borderRadius,
	_padding
};