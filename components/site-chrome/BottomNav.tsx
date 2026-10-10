import React, {useImperativeHandle, useRef} from "react";
import ContactOptionsGroup, {type ContactOptionsGroupHandle} from "@/components/site-chrome/ContactOptionsGroup.tsx";

export type BottomNavHandle = {
    // Shows the contact options.
    show(): void;
    // Hides the contact options.
    hide(): void;
};

// Lets clicks through to the page; the contact options opt back in with pointer-events.
export default function BottomNav({ref, isHomepage}: {
    ref?: React.Ref<BottomNavHandle>;
    isHomepage: boolean;
}) {
    const contactOptionsRef = useRef<ContactOptionsGroupHandle>(null);

    useImperativeHandle(ref, () => ({
        show: () => contactOptionsRef.current?.show(),
        hide: () => contactOptionsRef.current?.hide()
    }), []);

    return <nav className="bottom-nav" style={{ display: "grid", pointerEvents: "none" }}>
        <ContactOptionsGroup ref={contactOptionsRef} isVisible={!isHomepage} variant="bottom-nav" />
    </nav>;
}
