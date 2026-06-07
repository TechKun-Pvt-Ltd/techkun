import {MotionValue} from "motion";
import { motionValue, frame } from "motion-dom";

/**
 * Only fire handler for mouse-based pointer events.
 */
function filterMouseEvent(handler: (ev: PointerEvent) => any): (ev: PointerEvent) => any {
	return event => {
		if (event.pointerType === "mouse")
			handler(event);
	};
}

/**
 * Only fire handler for primary mouse button.
 */
function filterPrimaryPointer(handler: (ev: PointerEvent) => any) {
	return filterMouseEvent(event => {
		if (event.button === 0)
			handler(event);
	});
}

let pointerPosition: { x: MotionValue<number>; y: MotionValue<number> };

/**
 * Creates global shared pointer motion values.
 */
function createPointerPosition() {
	const pointerX = motionValue(0);
	const pointerY = motionValue(0);

	let latestX = 0;
	let latestY = 0;

	function updateMotionValues() {
		pointerX.set(latestX);
		pointerY.set(latestY);
	}

	if (typeof window !== "undefined") {
		window.addEventListener(
			"pointermove",
			filterMouseEvent(event => {
				latestX = event.clientX;
				latestY = event.clientY;

				// Batch into Motion's render loop
				frame.update(updateMotionValues);
			})
		);
	}
	pointerPosition = Object.freeze({ x: pointerX, y: pointerY });
}

/**
 * Shared hook-like accessor for pointer position motion values.
 */
function usePointerPosition() {
	if (!pointerPosition)
		createPointerPosition();

	return pointerPosition;
}

export {
	filterPrimaryPointer,
	filterMouseEvent,
	usePointerPosition,
};