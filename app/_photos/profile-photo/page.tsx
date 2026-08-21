"use client";

import {css} from "@emotion/react";
import {viewBoxString} from "@/app/utils/graphics-utils";
import logoPath from "@/public/logo-path.json";
import {LOGO_PATH_HREF} from "@/app/Shared";

export default function ProfilePic() {
    return <main>
        <section css={css`
            padding-block-start: 8rem;
            justify-items: center;
        `}>
            <div>
                <svg
                    width="400" viewBox="0 0 400 400"
                    // style={{
                    //     borderRadius: "50%",
                    //     border: "2px solid var(--border)",
                    //     outline: "1px dashed var(--border)", outlineOffset: "-56px"
                    // }}
                >
                    <svg
                        x="15%" y="5%"
                        width="70%" height="100%"
                        viewBox={viewBoxString(logoPath.viewBox)}
                    >
                        <use href={LOGO_PATH_HREF} fill="var(--primary-color)" />
                    </svg>
                </svg>
            </div>
        </section>
    </main>;
}