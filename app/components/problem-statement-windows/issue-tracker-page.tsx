import React from "react";
import {css} from "@emotion/react";

const highPriorityIcon = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M3 10L8 5L13 10"
		stroke="#FF7452"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	/>
</svg>;

const highestPriorityIcon = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M3 11L8 6L13 11"
		stroke="#FF5630"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	/>
	<path
		d="M3 7L8 2L13 7"
		stroke="#FF5630"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	/>
</svg>;

const blockerPriorityIcon = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<circle cx="8" cy="8" r="7" fill="#DE350B"/>
	<rect x="4" y="7" width="8" height="2" rx="1" fill="white"/>
</svg>;

enum Status {
	TODO = "TO DO",
	IN_PROGRESS = "IN PROGRESS",
	REOPENED = "REOPENED"
}

enum Priority {
	HIGH,
	HIGHEST,
	BLOCKER
}

enum DueDateProximity {
	CLOSE,
	PASSED
}

const issues: {
	key: string;
	summary: string;
	assignee: string;
	status: Status;
	priority: Priority;
	dueDate: string;
	dueDateProximity: DueDateProximity;
}[] = [
	{
		key: "NBT-1342",
		summary: "User sessions randomly invalidated after deploy",
		assignee: "Emma J.",
		status: Status.IN_PROGRESS,
		priority: Priority.HIGHEST,
		dueDate: "Today, 3:15am",
		dueDateProximity: DueDateProximity.CLOSE
	},
	{
		key: "NBT-1341",
		summary: "Duplicate invoices generated during retry",
		assignee: "Noah K.",
		status: Status.IN_PROGRESS,
		priority: Priority.BLOCKER,
		dueDate: "Yesterday, 11:45pm",
		dueDateProximity: DueDateProximity.PASSED
	},
	{
		key: "NBT-1340",
		summary: "Race condition in onboarding workflow",
		assignee: "Ava N.",
		status: Status.REOPENED,
		priority: Priority.HIGHEST,
		dueDate: "Yesterday, 9:30pm",
		dueDateProximity: DueDateProximity.PASSED
	},
	{
		key: "NBT-1339",
		summary: "Webhook retries causing double writes",
		assignee: "Liam C.",
		status: Status.IN_PROGRESS,
		priority: Priority.BLOCKER,
		dueDate: "Today, 2:30am",
		dueDateProximity: DueDateProximity.CLOSE
	},
	{
		key: "NBT-1338",
		summary: "Production memory spike after cache warmup",
		assignee: "Maya P.",
		status: Status.TODO,
		priority: Priority.HIGHEST,
		dueDate: "Yesterday, 8:15pm",
		dueDateProximity: DueDateProximity.PASSED
	},
	{
		key: "NBT-1337",
		summary: "Tenant permissions leaking across organizations",
		assignee: "Ethan B.",
		status: Status.IN_PROGRESS,
		priority: Priority.BLOCKER,
		dueDate: "Yesterday, 10:45pm",
		dueDateProximity: DueDateProximity.PASSED
	},
	{
		key: "NBT-1336",
		summary: "API rate limiting not enforced on some endpoints",
		assignee: "Olivia D.",
		status: Status.REOPENED,
		priority: Priority.HIGH,
		dueDate: "Today, 4:15am",
		dueDateProximity: DueDateProximity.CLOSE
	},
	{
		key: "NBT-1335",
		summary: "Data inconsistency between services after partial rollback",
		assignee: "James T.",
		status: Status.IN_PROGRESS,
		priority: Priority.BLOCKER,
		dueDate: "Yesterday, 7:45pm",
		dueDateProximity: DueDateProximity.PASSED
	},
	{
		key: "NBT-1334",
		summary: "Payments stuck in processing state indefinitely",
		assignee: "Sophia L.",
		status: Status.TODO,
		priority: Priority.HIGHEST,
		dueDate: "Today, 5:30am",
		dueDateProximity: DueDateProximity.CLOSE
	},
	{
		key: "NBT-1333",
		summary: "Search index out of sync with database records",
		assignee: "Lucas R.",
		status: Status.IN_PROGRESS,
		priority: Priority.HIGH,
		dueDate: "Yesterday, 11:15pm",
		dueDateProximity: DueDateProximity.PASSED
	},
	{
		key: "NBT-1332",
		summary: "File uploads failing intermittently on large assets",
		assignee: "Milo W.",
		status: Status.REOPENED,
		priority: Priority.HIGHEST,
		dueDate: "Today, 6:45am",
		dueDateProximity: DueDateProximity.CLOSE
	},
	{
		key: "NBT-1331",
		summary: "Email notifications not sent to some users",
		assignee: "Noah K.",
		status: Status.TODO,
		priority: Priority.HIGH,
		dueDate: "Today, 6:15am",
		dueDateProximity: DueDateProximity.CLOSE
	},
	{
		key: "NBT-1330",
		summary: "Incorrect tax calculation on invoices",
		assignee: "Emma J.",
		status: Status.IN_PROGRESS,
		priority: Priority.BLOCKER,
		dueDate: "Yesterday, 9:45pm",
		dueDateProximity: DueDateProximity.PASSED
	},
	{
		key: "NBT-1329",
		summary: "Organization switching returns 403 randomly",
		assignee: "Ava N.",
		status: Status.REOPENED,
		priority: Priority.HIGHEST,
		dueDate: "Yesterday, 10:15pm",
		dueDateProximity: DueDateProximity.PASSED
	},
	{
		key: "NBT-1328",
		summary: "GraphQL queries timing out in production",
		assignee: "Liam C.",
		status: Status.IN_PROGRESS,
		priority: Priority.BLOCKER,
		dueDate: "Yesterday, 11:30pm",
		dueDateProximity: DueDateProximity.PASSED
	},
	{
		key: "NBT-1327",
		summary: "Background jobs piling up and not processing",
		assignee: "Lucas R.",
		status: Status.TODO,
		priority: Priority.BLOCKER,
		dueDate: "Yesterday, 8:45pm",
		dueDateProximity: DueDateProximity.PASSED
	}
];

export default function IssueTrackerPage() {
	return <div className="small-text" css={css`
        font-family: sans-serif;
        flex-grow: 1;
        background: oklch(0.16 0.01 256);
        padding: 0 16px;
	`}>
		{/*<div css={css`*/}
		{/*	margin-bottom: 16px;*/}
		{/*`}>*/}
		{/*	<p css={css`*/}
		{/*		color: var(--muted-foreground);*/}
		{/*	`}>Projects / Donut Plains</p>*/}
		{/*	<p className="body-text">Issues</p>*/}
		{/*</div>*/}
		<table cellSpacing="0" css={css`
            width: 100%;
            text-align: left;

            th {
                border: 0 solid var(--border);
                //border-top-width: 1px;
                border-bottom-width: 1px;
            }

            th, td {
                padding: 8px;
            }

            .status-tag {
                width: max-content;
                font-weight: bold;
                padding: 2px 6px;
                border-radius: 4px;
                background-color: var(--_bg-color);
                color: var(--_text-color);

                &.todo, &.reopened {
                    --_bg-color: #282d33;
                    --_text-color: #9eacbb;
                }

                &.inprogress {
                    --_bg-color: #0b2c5c;
                    --_text-color: #87b0e9;
                }
            }

            .priority-tag {
                display: flex;
                align-items: center;
                gap: 8px;
            }
		`}>
			<thead>
			<tr>
				<th>Key</th>
				<th>Summary</th>
				<th>Assignee</th>
				<th>Status</th>
				<th>Priority</th>
				<th>Due date</th>
			</tr>
			</thead>
			<tbody>
			{issues.map(issue => {
				return <tr key={issue.key}>
					<td>{issue.key}</td>
					<td>{issue.summary}</td>
					<td>{issue.assignee}</td>
					<td>
						<div
							className={`status-tag ${issue.status === Status.REOPENED ? "reopened" : issue.status === Status.IN_PROGRESS ? "inprogress" : "todo"}`}>{issue.status}</div>
					</td>
					<td>
						<div className="priority-tag">
							{issue.priority === Priority.BLOCKER ? <>
								{blockerPriorityIcon}
								Blocker
							</> : issue.priority === Priority.HIGHEST ? <>
								{highestPriorityIcon}
								Highest
							</> : <>
								{highPriorityIcon}
								High
							</>}
						</div>
					</td>
					<td style={{color: issue.dueDateProximity === DueDateProximity.CLOSE ? "rgb(255, 204, 77)" : "rgb(255, 133, 137)"}}>{issue.dueDate}</td>
				</tr>;
			})}
			</tbody>
		</table>
	</div>;
};