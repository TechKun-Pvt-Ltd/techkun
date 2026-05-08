import React from "react";
import {css} from "@emotion/react";
import Window, {windowCssProperties, WindowProps} from "@/app/components/problem-statement-windows/window-component";

export type ScreenComponentProps = {
	borderRadius?: string;
	padding?: string;
	children?:
		| React.ReactElement<WindowProps, typeof Window>
		| React.ReactElement<WindowProps, typeof Window>[];
};

export default function ScreenComponent(props: ScreenComponentProps) {
	return <div className="screen" css={css`
        ${windowCssProperties._borderRadius}: ${props.borderRadius};
        ${windowCssProperties._padding}: ${props.padding};
        position: relative;
	`}>
		{props.children}
	</div>;
}