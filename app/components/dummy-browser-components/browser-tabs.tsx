import React from "react";
import {css} from "@emotion/react";
import Image, {StaticImageData} from "next/image";

export type TabData = {
	icon: StaticImageData;
	title: string;
	notifications?: number;
	active?: boolean;
};

export default function BrowserTabs({ tabs }: { tabs: TabData[] }) {
	return <div css={css`
        width: 100%;
		padding: 4px 0;
        display: flex;
        align-items: center;

        .tab {
			border-radius: 8px;
            flex: 1;
			display: flex;
            min-width: 24px;
            max-width: 256px;
            padding: 7px 0;
			
			.padding {
				min-width: 4px;
				flex: 0 1 12px;
			}

            .tab-contents {
				min-width: 0;
                flex: 1;
                overflow: clip;
				padding-left: 8px;
				mask: linear-gradient(
					to right,
					black calc(100% - 16px),
					transparent 100%
				);
            }

            .favicon {
				flex: 0 0 1em;
                width: 1em;
                height: auto;
            }

            .title {
                white-space: nowrap;
            }
        }
		.tab.active {
			background-color: var(--muted);
		}

        .separator {
            border-radius: 1px;
            height: 1em;
            width: 2px;
            background: var(--muted);
        }
		
		.tab.active + .separator {
			display: none;
		}
		.separator:has(+ .tab.active) {
			display: none;
		}
	`}>
		{tabs.map(tab => <React.Fragment key={tab.title}>
			<div className={`tab ${tab.active ? 'active' : ''}`}>
				<div className="padding" />
				<Image className="favicon" src={tab.icon} alt="favicon"/>
				<div className="tab-contents">
					<p className="title">
						{tab.notifications && <span>({tab.notifications})</span>} {tab.title}
					</p>
				</div>
				<div className="padding" />
			</div>
			<div className="separator"></div>
		</React.Fragment>)}
	</div>;
}