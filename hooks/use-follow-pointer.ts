import {useRef} from "react";
import {SpringOptions} from "motion";
import {useSpring, useTransform} from "motion/react";
import {usePointerPosition} from "@/hooks/use-pointer-position";
import {useMappedValues} from "@/hooks/use-mapped-values";

type BoundingRect = {
	x: number;
	y: number;
	width: number;
	height: number;
};
const initialRect: BoundingRect = {
	x: 0, y: 0, width: 0, height: 0
};
const DEFAULT_SPRING_OPTIONS = { damping: 5, stiffness: 50, restDelta: 0.001 };
const DEFAULT_POSITION: [string, string] = ["50%", "50%"];
const DEFAULT_X_BOUNDS: [number, number] = [0, 1];
const DEFAULT_Y_BOUNDS: [number, number] = [0, 1];

export function useFollowPointer<T extends HTMLElement>(
	{
		defaultPosition = DEFAULT_POSITION,
		springOptions = DEFAULT_SPRING_OPTIONS,
		xBounds = DEFAULT_X_BOUNDS,
		yBounds = DEFAULT_Y_BOUNDS
	}: {
		defaultPosition?: [string, string];
		springOptions?: SpringOptions;
		xBounds?: [number, number];
		yBounds?: [number, number];
	} = {}
) {
	const rootBoundingRect = useRef<BoundingRect>(initialRect);
	const pointer = usePointerPosition();

	const motionCoordinates = useTransform<number, [string, string]>([pointer.x, pointer.y], ([vx, vy]) => {
		if (!(rootBoundingRect.current && rootBoundingRect.current.width && rootBoundingRect.current.height))
			return defaultPosition;

		const xProgress = (vx - rootBoundingRect.current.x) / rootBoundingRect.current.width;
		const yProgress = (vy - rootBoundingRect.current.y) / rootBoundingRect.current.height;
		if (xProgress < xBounds[0] || xProgress > xBounds[1] || yProgress < yBounds[0] || yProgress > yBounds[1])
			return defaultPosition;
		return [`${xProgress * 100}%`, `${yProgress * 100}%`];
	});
	const coordinates = useMappedValues(motionCoordinates, c => c);
	const x = useSpring(coordinates[0], springOptions);
	const y = useSpring(coordinates[1], springOptions);

	const containerRef = (el: T) => {
		if (!el) return;

		function update() {
			if (!el) return;
			rootBoundingRect.current = el.getBoundingClientRect();
		}

		update();
		window.addEventListener("scroll", update);
		window.addEventListener("resize", update);
		return () => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	};

	return {
		pointer,
		x, y,
		containerRef
	};
}