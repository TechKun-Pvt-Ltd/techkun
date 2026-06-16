'use client';
import {css} from "@emotion/react";
import LogoButton from "@/app/components/navbar-components/logo-button";

export default function Header() {
    return <header style={{ pointerEvents: "none" }}>
        <nav css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
        `}>
            <LogoButton style={{ pointerEvents: "auto" }} />
        </nav>
    </header>;
};