'use client'
import React from "react";
import {css} from "@emotion/react";
import Precision from "@/app/components/banner-components/Precision";
import Beauty from "@/app/components/banner-components/Beauty";
import Identity from "@/app/components/banner-components/Identity";

export default function Banner() {
	return <section>
		<div css={css`
            display: flex;
            justify-content: center;
            align-items: start;
            padding-block: 160px 96px;
            text-align: center;
		`}>
			<h1 className="hero-heading">
				<span className="text-4xl" style={{display: 'inline-block'}}>
					We build software<br/>
					with
				</span><br/>
				<span css={css`
					display: inline-block;
                    color: var(--neutral-400);

                    .plus-icon {
                        width: 0.52em;
                        height: auto;
                    }
					.precomma {
						margin-inline-end: 0.05em;
					}
				`}>
					<span style={{display: 'inline-block', marginBlockEnd: '0.25em'}}>
						<Beauty className="precomma"/>, <Precision className="precomma"/>,
					</span><br/>
					<span><Plus/> </span>
					<span style={{ marginInlineEnd: "0.4em" }}><Identity />.</span>
				</span>
			</h1>
		</div>
	</section>;
}

function Plus() {
	return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
				stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
				className="plus-icon">
		<path d="M5 12h14"/>
		<path d="M12 5v14"/>
	</svg>;
}