import {css} from "@emotion/react";
import ErrorConsole from "@/app/components/problem-statement-windows/error-console";
import ChatWindow from "@/app/components/problem-statement-windows/chat-window";
import ScreenComponent from "@/app/components/problem-statement-windows/screen-component";
import Window from "@/app/components/problem-statement-windows/window-component";

export default function ProblemStatement() {
	return <section>
		<div css={css`
            display: grid;
            grid-auto-flow: row;
            grid-auto-rows: auto;
		`}>
			<h2 className="section-title"
				css={css`
					grid-column: 1 / -1;
					margin-bottom: 96px;
				`}
			>Say goodbye to these nightmares</h2>
			<div css={css`
                grid-column: 1 / -1;
				height: 768px;
			`}>
				<ScreenComponent borderRadius="36px" padding="8px">
					<ErrorConsole />
					<Window title="tasks"
						width="min(100%, 512px)"
						minHeight="560px"
						inset="144px 400px auto auto"
					></Window>
					<Window title="chat"
						width="min(100%, 448px)"
						minHeight="560px"
						inset="48px 96px auto auto"
					>
						<ChatWindow />
					</Window>
				</ScreenComponent>
			</div>
		</div>
	</section>;
};