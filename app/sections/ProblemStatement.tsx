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
		padding-block: 48px;
        overflow-x: clip;
	`}>
		<div css={css`
            display: flex;
            flex-direction: column;
			gap: 80px;
		`}>
			<h2 className="section-title">Tired of funding <span style={{whiteSpace: 'nowrap'}}>
				repa
				<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="-1 -12 3.25 13" css={css`
					margin-block-end: -0.125em;
					margin-inline: 0.0625em;
					transform: rotateZ(4deg);
					transition: transform 0.3s ease-in-out;
					span:hover > & {
						transform: rotateZ(-4deg);
					}
				`}>
					<path d="M 0 0 L 0.1841 -7.4977 C 0.1967 -8.013 0.0498 -8.5195 -0.2365 -8.948 C -0.7003 -9.6422 -0.6092 -10.5674 -0.0189 -11.1577 C 0.0315 -11.2081 0.1177 -11.1724 0.1177 -11.1011 L 0.1177 -9.8511 C 0.1177 -9.741 0.1897 -9.6439 0.2951 -9.6119 C 0.579 -9.5258 0.8821 -9.5258 1.166 -9.6119 C 1.2713 -9.6439 1.3434 -9.741 1.3434 -9.8511 L 1.3434 -11.1011 C 1.3434 -11.1724 1.4296 -11.2081 1.48 -11.1577 C 2.0703 -10.5674 2.1614 -9.6422 1.6976 -8.948 C 1.4113 -8.5195 1.2644 -8.013 1.277 -7.4977 L 1.4611 0 A 0.7305 0.7305 -90 1 1 0.0004 0 Z M 1.2328 0 A 0.5023 0.5023 -90 0 0 0.2283 0 A 0.5023 0.5023 -90 0 0 1.2328 0 Z"
						  fill="currentColor"
					/>
				</svg>
				rs
			</span>?</h2>
			<div css={css`
                height: 768px;
			`}>
				<ScreenComponent borderRadius="24px">
					<ErrorConsole/>
					<Window
						title="tasks"
						width="min(100%, 768px)"
						height="640px"
						inset="48px calc(5% * var(--scale-factor)) auto auto"
						titleBar={<BrowserTabs tabs={tabs} />}
					>
						<BrowserToolbar url="acme.atlassian.com" />
						<IssueTrackerPage />
					</Window>
					<Window
						title="chat"
						width="min(100%, 448px)"
						height="448px"
						inset="272px auto auto calc(15% * var(--scale-factor))"
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