"use client";
import React from "react";
import {usePathname} from "next/navigation";
import {useMediaQuery} from "@/hooks/use-media-query.ts";
import ContactOptionsGroup from "@/app/components/contact-options/ContactOptionsGroup.tsx";
import {NAV_CONTACT_OPTIONS_NARROW_QUERY} from "@/app/components/contact-options/constants.ts";

export default function BottomNav() {
    const pathname = usePathname();
    const isHomepage = pathname === "/";
    const isNarrowViewport = useMediaQuery(NAV_CONTACT_OPTIONS_NARROW_QUERY);

    return isNarrowViewport && <ContactOptionsGroup
        className="bottom-nav"
        isHomepage={isHomepage}
        variant="bottom-nav"
    />;
}
