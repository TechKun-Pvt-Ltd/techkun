'use client';
import {css} from "@emotion/react";
import HomeLink, {type HomeLinkHandle} from "@/components/links/HomeLink.tsx";
import React, {useImperativeHandle, useRef} from "react";
import ContactOptionsGroup, {type ContactOptionsGroupHandle} from "@/components/site-chrome/ContactOptionsGroup.tsx";

const navCss = css`
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    min-height: 0;
    max-height: 100%;
`;

export type HeaderHandle = {
    // Expands the home link and, on the homepage, hides the contact options.
    expand(): void;
    // Collapses the home link and, on the homepage, shows the contact options.
    collapse(): void;
};

export default function Header({ref, isHomepage, hasContactOptions}: {
    ref?: React.Ref<HeaderHandle>;
    isHomepage: boolean;
    hasContactOptions: boolean;
}) {
    const homeLinkRef = useRef<HomeLinkHandle>(null);
    const contactOptionsRef = useRef<ContactOptionsGroupHandle>(null);

    useImperativeHandle(ref, () => ({
        expand() {
            homeLinkRef.current?.expand();
            if (isHomepage) contactOptionsRef.current?.hide();
        },
        collapse() {
            homeLinkRef.current?.collapse();
            if (isHomepage) contactOptionsRef.current?.show();
        }
    }), [isHomepage]);

    return <header style={{ pointerEvents: "none" }}>
        <nav css={navCss}>
            <HomeLink ref={homeLinkRef} style={{ pointerEvents: "auto", marginBlock: "-2px" }} />
            {hasContactOptions && <ContactOptionsGroup ref={contactOptionsRef} isVisible={!isHomepage} variant="header" />}
        </nav>
    </header>;
};
