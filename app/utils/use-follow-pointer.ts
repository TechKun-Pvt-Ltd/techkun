import {RefObject, useEffect} from "react";
import {useSpring} from "motion/react";
import motion_dom, {cancelFrame, frame} from "motion-dom";
import {clamp} from "motion";

const spring = { damping: 5, stiffness: 50, restDelta: 0.001 };

export function useFollowPointer(ref: RefObject<HTMLDivElement | null>) {
	const x = useSpring(0.5, spring);
	const y = useSpring(1, spring);

	useEffect(() => {
		if (!ref.current) return;

		let frameRead: motion_dom.Process;
		function handlePointerMove(this: HTMLDivElement, { clientX, clientY }: PointerEvent) {
			const rect = this.getBoundingClientRect();
			const relativeX = clientX - rect.x;
			const relativeY = clientY - rect.y;

			frameRead = frame.read(() => {
				x.set(clamp(0, 1, relativeX / rect.width));
				y.set(clamp(0, 1, relativeY / rect.height));
			});
		}
		ref.current.addEventListener("pointermove", handlePointerMove);

		return () => {
			cancelFrame(frameRead);
			ref.current?.removeEventListener("pointermove", handlePointerMove);
		};
	}, []);

	return { x, y };
}