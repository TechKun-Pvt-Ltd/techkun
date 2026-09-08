'use client';
import {contactMailAddress} from "@/app/utils/constants";

// Deliberately dependency-light: this only renders when something has already gone
// wrong somewhere in the tree (including, potentially, the layout itself), so it
// avoids Motion/Emotion and the generated design-token CSS and just uses plain
// inline styles — nothing here should be able to fail for the same reason the
// page it's replacing did.
export default function GlobalError({reset}: { error: Error & { digest?: string }; reset: () => void }) {
    return <html lang="en">
        <body style={{
            margin: 0,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            padding: "2rem",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
            background: "#0a0a0f",
            color: "#f5f5f7"
        }}>
            <h1 style={{fontSize: "1.75rem", fontWeight: 500, margin: 0}}>Something went wrong</h1>
            <p style={{maxWidth: "32rem", color: "#a1a1aa", lineHeight: 1.6}}>
                We hit an unexpected error loading this page. Try reloading — if it keeps
                happening, reach us directly at{" "}
                <a href={`mailto:${contactMailAddress}`} style={{color: "#e5b8ff"}}>{contactMailAddress}</a>.
            </p>
            <button
                onClick={reset}
                style={{
                    padding: "0.8rem 1.6rem",
                    borderRadius: "100vh",
                    border: "1px solid #3f3f46",
                    background: "transparent",
                    color: "#f5f5f7",
                    cursor: "pointer",
                    fontSize: "1rem"
                }}
            >
                Try again
            </button>
        </body>
    </html>;
}
