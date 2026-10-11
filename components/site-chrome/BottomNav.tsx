import React from "react";
import ContactOptionsGroup, {type ContactOptionsGroupHandle} from "@/components/site-chrome/ContactOptionsGroup.tsx";

export type BottomNavHandle = ContactOptionsGroupHandle;

// Lets clicks through to the page; the contact options opt back in with pointer-events.
export default function BottomNav({ref, isHomepage}: {
    ref?: React.Ref<BottomNavHandle>;
    isHomepage: boolean;
}) {
    return <nav className="bottom-nav" style={{ display: "grid", pointerEvents: "none" }}>
        <ContactOptionsGroup ref={ref} isVisible={!isHomepage} variant="bottom-nav" />
    </nav>;
}
