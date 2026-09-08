'use client';
import {RefObject, useEffect} from "react";
import navbarThresholdStatus from "@/app/utils/navbar-threshold-status.ts";

/**
 * Wires a contact-options container up to `navbarThresholdStatus`: toggles the
 * `--_switch` custom property and each `.contact-option`'s focusability as the
 * page scrolls past the hero. Runs (and re-runs) whenever the container mounts
 * while `active`, so it naturally re-attaches when a consumer conditionally
 * renders the container based on viewport width.
 */
export default function useContactOptionsSwitch(containerRef: RefObject<HTMLElement | null>, active: boolean) {
	useEffect(() => {
		if (!(active && containerRef.current)) return;

		const containerElement = containerRef.current;
		const links = containerElement.querySelectorAll<HTMLElement>(".contact-option");
		function listener(belowThreshold: boolean) {
			for (const link of links) {
				if (!belowThreshold && document.activeElement === link)
					link.blur();
				link.tabIndex = belowThreshold ? 0 : -1;
			}
			containerElement.style.setProperty("--_switch", belowThreshold ? "1" : "0");
		}
		listener(navbarThresholdStatus.get());
		return navbarThresholdStatus.onChange(listener);
	}, [active]);
}
