'use client';
import {css} from "@emotion/react";
import LogoButton from "@/app/components/navbar-components/logo-button";

export default function Header() {
    return <header>
        <nav css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
        `}>
            <LogoButton />
        </nav>
    </header>;
};