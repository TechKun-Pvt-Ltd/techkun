"use client";

import {css} from "@emotion/react";
import {viewBoxString} from "@/app/utils/graphics-utils";
import logoPath from "@/public/logo-path.json";
import {TECHKUN_LOGO_PATH_HREF} from "@/app/Shared";

const xPadding = 15;
const xOffset = 0.5;
const yOffset = 2;

export default function ProfilePic() {
    return <main>
        <section css={css`
            padding-block-start: 8rem;
            justify-items: center;
        `}>
            <div>
                <svg
                    width="400" viewBox="0 0 400 400"
                    style={{
                        // border: "2px solid var(--border)",
                        // outline: "1px dashed var(--border)", outlineOffset: "-56px"
                    }}
                >
                    {/*<line x1="0%" y1="50%" x2="100%" y2="50%" strokeWidth="2" stroke="var(--border)" />*/}
                    {/*<line x1="50%" y1="0%" x2="50%" y2="100%" strokeWidth="2" stroke="var(--border)" />*/}
                    {/*<line x1={`${xPadding}%`} y1="0%" x2={`${xPadding}%`} y2="100%" strokeWidth="2" stroke="var(--border)" />*/}
                    {/*<line x1={`${100 - xPadding}%`} y1="0%" x2={`${100 - xPadding}%`} y2="100%" strokeWidth="2" stroke="var(--border)" />*/}
                    <svg
                        x={`${xPadding + xOffset}%`} y={`${yOffset}%`}
                        width={`${100 - 2 * xPadding}%`} height="100%"
                        viewBox={viewBoxString(logoPath.viewBox)}
                    >
                        <use href={TECHKUN_LOGO_PATH_HREF} fill="var(--primary-color)" />
                    </svg>
                </svg>
            </div>
        </section>
    </main>;
}