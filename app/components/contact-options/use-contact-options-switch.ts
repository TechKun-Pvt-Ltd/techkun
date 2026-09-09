'use client';
import {RefObject, useEffect} from "react";
import navbarThresholdStatus from "@/app/utils/navbar-threshold-status.ts";

/**
 * Wires a contact-options container up to `navbarThresholdStatus`: toggles the
 * `--_switch` custom property and the container's `inert`-ness as the page
 * scrolls past the hero. `inert` (rather than per-link `tabIndex`) removes the
 * whole subtree from the tab order *and* the accessibility tree while it's
 * translated off-screen, and per spec moves focus out automatically if it was
 * inside — so no manual `.blur()` bookkeeping is needed either. Runs (and
 * re-runs) whenever the container mounts while `active`, so it naturally
 * re-attaches when a consumer conditionally renders the container based on
 * viewport width.
 */
export default function useContactOptionsSwitch(containerRef: RefObject<HTMLElement | null>, active: boolean) {
	useEffect(() => {
		if (!(active && containerRef.current)) return;

		const containerElement = containerRef.current;
		function listener(belowThreshold: boolean) {
			containerElement.inert = !belowThreshold;
			containerElement.style.setProperty("--_switch", belowThreshold ? "1" : "0");
		}
		listener(navbarThresholdStatus.get());
		return navbarThresholdStatus.onChange(listener);
	}, [active]);
}
