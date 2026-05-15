import {css} from "@emotion/react";
import {ReactNode} from "react";
import {property} from "@/app/utils/css-property";

const _borderRadius = property("_borderRadius")`
	syntax: "<length-percentage>";
	inherits: true;
	initial-value: 0;
`;

const _bgColor = "--_bg-color";
const _borderColor = "--_border-color";
const _iconColor = "--_icon-color";
const _activeBgColor = "--_active-bg-color";
const _activeBorderColor = "--_active-border-color";
const _activeIconColor = "--_active-icon-color";

const closeIcon = <svg className="window-control-icon" viewBox="0 0 85.4 85.4" xmlns="http://www.w3.org/2000/svg">
	<path d="m22.5 57.8 35.3-35.3c1.4-1.4 3.6-1.4 5 0l.1.1c1.4 1.4 1.4 3.6 0 5l-35.3 35.3c-1.4 1.4-3.6 1.4-5 0l-.1-.1c-1.3-1.4-1.3-3.6 0-5z"/>
	<path d="m27.6 22.5 35.3 35.3c1.4 1.4 1.4 3.6 0 5l-.1.1c-1.4 1.4-3.6 1.4-5 0l-35.3-35.3c-1.4-1.4-1.4-3.6 0-5l.1-.1c1.4-1.3 3.6-1.3 5 0z"/>
</svg>;

const minimizeIcon = <svg className="window-control-icon" viewBox="0 0 85.4 85.4" xmlns="http://www.w3.org/2000/svg">
	<path d="m17.8 39.1h49.9c1.9 0 3.5 1.6 3.5 3.5v.1c0 1.9-1.6 3.5-3.5 3.5h-49.9c-1.9 0-3.5-1.6-3.5-3.5v-.1c0-1.9 1.5-3.5 3.5-3.5z"/>
</svg>;

const maximizeIcon = <svg className="window-control-icon" viewBox="0 0 85.4 85.4" xmlns="http://www.w3.org/2000/svg">
	<path d="m31.2 20.8h26.7c3.6 0 6.5 2.9 6.5 6.5v26.7zm23.2 43.7h-26.8c-3.6 0-6.5-2.9-6.5-6.5v-26.8z"/>
</svg>;

function WindowControls() {
	return <div css={css`
		display: flex;
		gap: 8px;

		.window-control-button {
			border-radius: 50%;
			width: 14px;
			height: 14px;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: var(${_bgColor});
			border: 1px solid var(${_borderColor});
		}
        .window-control-icon {
            display: none;
            fill: var(${_iconColor});
        }
        &:hover .window-control-icon {
            display: revert;
        }
		.window-control-button:active {
			background-color: var(${_activeBgColor});
			border-color: var(${_activeBorderColor});
			.window-control-icon {
				fill: var(${_activeIconColor});
			}
		}

		.close-button {
			${_bgColor}: #ed6a5f;
			${_borderColor}: #e24b41;
			${_iconColor}: #460804;
			${_activeBgColor}: #b15048;
			${_activeBorderColor}: #a14239;
			${_activeIconColor}: #170101;
		}
		.minimize-button {
			${_bgColor}: #f6be50;
			${_borderColor}: #e1a73e;
			${_iconColor}: #90591d;
			${_activeBgColor}: #b8923b;
			${_activeBorderColor}: #a67f36;
			${_activeIconColor}: #532a0a;
		}
		.maximize-button {
			${_bgColor}: #61c555;
			${_borderColor}: #2dac2f;
			${_iconColor}: #2a6218;
			${_activeBgColor}: #4a9741;
			${_activeBorderColor}: #428234;
			${_activeIconColor}: #113107;
		}
	`}>
		<div className="window-control-button close-button">{closeIcon}</div>
		<div className="window-control-button minimize-button">{minimizeIcon}</div>
		<div className="window-control-button maximize-button">{maximizeIcon}</div>
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
	backgroundColor?: string;
	backdropFilter?: string;
	titleBar?: ReactNode;
	children?: ReactNode;
};
export default function Window(
	{
		title,
		minWidth, width, maxWidth,
		minHeight, height, maxHeight,
		inset = "0",
		backgroundColor = "var(--background)",
		backdropFilter = "none",
		titleBar, children
	}: WindowProps
) {
	return <div className="window"
		data-title={title}
		css={css`
			overflow: clip;
			border: 1px solid var(--border);
			border-radius: var(${_borderRadius});
			background-color: ${backgroundColor};
			backdrop-filter: ${backdropFilter};
			${minWidth ? `min-width: ${minWidth}` : ""};
			${width ? `width: ${width}` : ""};
			${maxWidth ? `max-width: ${maxWidth}` : ""};
			${minHeight ? `min-height: ${minHeight}` : ""};
			${height ? `height: ${height}` : ""};
			${maxHeight ? `max-height: ${maxHeight}` : ""};
			position: absolute;
			inset: ${inset};
			display: flex;
			flex-direction: column;
		`}
	>
		<div css={css`
			display: flex;
			align-items: center;
		`}>
			<div css={css`
            	padding: 14px 16px;
			`}>
				<WindowControls />
			</div>
			<div css={css`
				min-width: 0;
				flex-grow: 1;
				padding-right: 16px;
			`}>{titleBar}</div>
		</div>
		<div css={css`
			min-height: 0;
            flex-grow: 1;
            background-color: oklch(from var(--background) l c h / 0);
            border-radius: calc(var(${_borderRadius}) - 12px);
			overflow: clip;
            display: flex;
			flex-direction: column;
		`}>{children}</div>
	</div>;
}

export const windowCssProperties = {
	_borderRadius
};