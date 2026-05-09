import TrigCircle from "@/app/components/TrigCircle";
import {css} from "@emotion/react";

export default function SolutionStatement() {
	return <section>
		<div css={css`
			display: flex;
			justify-content: center;
		`}>
			<TrigCircle/>
		</div>
	</section>
};