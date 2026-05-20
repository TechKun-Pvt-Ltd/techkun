import React from "react";
import {css} from "@emotion/react";
import {windowCssProperties} from "@/app/components/problem-statement-windows/window-component";

export type ScreenComponentProps = {
	borderRadius?: string;
	children?: React.ReactNode;
};

export default function ScreenComponent(props: ScreenComponentProps) {
	return <div className="screen" css={css`
		--scale-factor: clamp(0, (100cqw - 425px) / (1280px - 425px), 1);
		height: 100%;
        ${windowCssProperties._borderRadius}: ${props.borderRadius};
        position: relative;
	`}>
		{props.children}
	</div>;
}