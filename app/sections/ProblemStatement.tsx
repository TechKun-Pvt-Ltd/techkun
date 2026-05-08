import {css} from "@emotion/react";
import ConsoleWindow from "@/app/components/problem-statement-windows/console-window";
import ChatWindow from "@/app/components/problem-statement-windows/slack-window";
import ScreenComponent from "@/app/components/problem-statement-windows/screen-component";
import Window from "@/app/components/problem-statement-windows/window-component";

export default function ProblemStatement() {
	return <section>
		<div css={css`
            display: grid;
            grid-auto-flow: row;
            grid-auto-rows: auto;
            justify-items: center;
		`}>
			<h2 className="section-title"
				css={css`
					grid-column: 1 / -1;
					margin-bottom: 96px;
				`}
			>We've all been there...</h2>
			<div css={css`
                grid-column: 1 / -1;
				height: 768px;
                justify-self: stretch;
                display: grid;
                grid-auto-flow: row;
                gap: 64px;
                position: relative;
			`}>
				<ScreenComponent borderRadius="36px" padding="8px">
					<Window title="logs"
						width="50%"
						height="480px"
					>
						<ConsoleWindow />
					</Window>
					<Window title="slack"
						width="min(100%, 448px)"
						minHeight="560px"
						inset="128px 48px auto auto"
					>
						<ChatWindow />
					</Window>
				</ScreenComponent>
			</div>
		</div>
	</section>;
};