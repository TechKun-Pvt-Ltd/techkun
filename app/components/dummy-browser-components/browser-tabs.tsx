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
            min-width: 16px;
            max-width: 256px;
            padding: 7px 12px;

            .tab-contents {
                flex: 1 1 100%;
                overflow: clip;
                display: flex;
                align-items: center;
                gap: 8px;
				mask: linear-gradient(
					to right,
					black calc(100% - 16px),
					transparent 100%
				);
            }

            .favicon {
                height: 1em;
                aspect-ratio: 1 / 1;
                width: auto;
            }

            .title {
                flex: 1 1 0;
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
				<div className="tab-contents">
					<Image className="favicon" src={tab.icon} alt="favicon"/>
					<p className="title">
						{tab.notifications && <span>({tab.notifications})</span>} {tab.title}
					</p>
				</div>
			</div>
			<div className="separator"></div>
		</React.Fragment>)}
	</div>;
}