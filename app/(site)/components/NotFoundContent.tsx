"use client";
import React from "react";
import {css} from "@emotion/react";
import PrimaryButton from "@/components/links/PrimaryButton.tsx";

export default function NotFoundContent() {
    return <main>
        <section css={css`
            padding-block-start: 2%;
            justify-items: center;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
        `}>
            <div css={css`
                width: 100%;
                max-width: 40rem;
            `}>
                <h1 className="section-title" css={css`margin-block-end: 0.5em;`}>
                    Page not found
                </h1>
                <p className="section-subtitle mb-10">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <PrimaryButton href="/" className="type-body-lg py-3 px-7" external={false}>
                    Take me home
                </PrimaryButton>
            </div>
        </section>
    </main>;
};
