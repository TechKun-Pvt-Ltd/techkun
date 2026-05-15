import React from "react";
import {css} from "@emotion/react";
import ErrorConsole from "@/app/components/problem-statement-windows/error-console";
import ChatPage from "@/app/components/problem-statement-windows/chat-page";
import ScreenComponent from "@/app/components/problem-statement-windows/screen-component";
import Window from "@/app/components/problem-statement-windows/window-component";
import figmaIcon from "@/public/icons/figma-icon.svg";
import githubIcon from "@/public/icons/github-icon.svg";
import gmailIcon from "@/public/icons/gmail-icon.svg";
import notionIcon from "@/public/icons/notion-icon.svg";
import slackIcon from "@/public/icons/slack-icon.svg";
import jiraIcon from "@/public/icons/jira-icon.svg";
import vercelIcon from "@/public/icons/vercel-icon.svg";
import openaiIcon from "@/public/icons/openai-icon.svg";
import BrowserTabs, {TabData} from "@/app/components/dummy-browser-components/browser-tabs";
import BrowserToolbar from "@/app/components/dummy-browser-components/browser-toolbar";
import IssueTrackerPage from "@/app/components/problem-statement-windows/issue-tracker-page";

const tabs: TabData[] = [
	{
		icon: figmaIcon,
		title: "figma"
	},
	{
		icon: githubIcon,
		title: "github"
	},
	{
		icon: gmailIcon,
		title: "gmail",
		notifications: 96
	},
	{
		icon: notionIcon,
		title: "notion"
	},
	{
		icon: slackIcon,
		title: "slack",
		notifications: 53
	},
	{
		icon: jiraIcon,
		title: "Issues",
		active: true
	},
	{
		icon: openaiIcon,
		title: "chatgpt"
	},
	{
		icon: vercelIcon,
		title: "vercel"
	}
];

export default function ProblemStatement() {
	return <section css={css`
        overflow-x: clip;
	`}>
		<div css={css`
            display: flex;
            flex-direction: column;
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
				<ScreenComponent borderRadius="24px">
					<ErrorConsole/>
					<Window
						title="tasks"
						width="min(100%, 768px)"
						height="640px"
						inset="48px 5% auto auto"
						titleBar={<BrowserTabs tabs={tabs} />}
					>
						<BrowserToolbar url="acme.atlassian.com" />
						<IssueTrackerPage />
					</Window>
					<Window
						title="chat"
						width="min(100%, 448px)"
						height="448px"
						inset="272px auto auto 15%"
						backgroundColor="oklch(from var(--background) l c h / 0.9)"
						backdropFilter="blur(2px)"
						titleBar={
							<div css={css`
								font-weight: bold;
								position: absolute;
								inset: 0 0 auto 0;
								text-align: center;
								padding: 9px 0;
								pointer-events: none;
							`}>Chat</div>
						}
					>
						<ChatPage/>
					</Window>
				</ScreenComponent>
			</div>
		</div>
	</section>;
};