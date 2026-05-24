import * as React from "react";
import {HTMLAttributes, useInsertionEffect} from "react";

import {noop, pipe} from "motion-utils";

import {mix} from "motion-dom";

import {
	AnimatePresence,
	LayoutGroup,
	motion,
	MotionConfig,
	MotionStyle,
	useIsomorphicLayoutEffect,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform
} from "motion/react";

import {filterMouseEvent, filterPrimaryPointer, usePointerPosition,} from "@/app/utils/use-pointer-position";

import {animate, MotionNodeAnimationOptions, MotionValue, SpringOptions} from "motion";
import {createPortal} from "react-dom";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/

const DEFAULT_CURSOR_SIZE = 17;
const POINTER_CURSOR_SIZE = 31;

const TEXT_CURSOR_WIDTH = 4;
const TEXT_CURSOR_HEIGHT = 20;

/* -------------------------------------------------------------------------------------------------
 * Utilities
 * -----------------------------------------------------------------------------------------------*/

function resolveCursorDimensions(
	defaultWidth: number | string,
	defaultHeight: number | string,
	style?: MotionStyle
) {
	return {
		width: style?.width ?? defaultWidth,
		height: style?.height ?? defaultHeight,
	};
}

function getCursorDimensions({
	 type,
	 state,
	 hasChildren,
	 style,
	 isMagnetic,
	 magneticOptions,
	 matchTextSize,
}: {
	type: CursorType;
	state: CursorState;
	hasChildren: boolean;
	style?: MotionStyle;
	isMagnetic: boolean;
	magneticOptions: MagneticOptions;
	matchTextSize: boolean;
}) {
	const targetBounds =
		isMagnetic && state.targetBoundingBox;

	if (hasChildren && !targetBounds) {
		return resolveCursorDimensions(
			"auto",
			"auto",
			style
		);
	}

	switch (type) {
		case "pointer": {
			const {
				padding,
				morph,
			} = magneticOptions;

			if (
				isMagnetic &&
				morph &&
				state.targetBoundingBox
			) {
				const {
					width,
					height,
				} = state.targetBoundingBox;

				return {
					width: width + padding * 2,
					height: height + padding * 2,
				};
			}

			return resolveCursorDimensions(
				POINTER_CURSOR_SIZE,
				POINTER_CURSOR_SIZE,
				style
			);
		}

		case "text":
			if (matchTextSize && state.fontSize) {
				return {
					width: TEXT_CURSOR_WIDTH,
					height: state.fontSize,
				};
			}

			return resolveCursorDimensions(
				TEXT_CURSOR_WIDTH,
				TEXT_CURSOR_HEIGHT,
				style
			);

		default:
			return resolveCursorDimensions(
				DEFAULT_CURSOR_SIZE,
				DEFAULT_CURSOR_SIZE,
				style
			);
	}
}

/* -------------------------------------------------------------------------------------------------
 * Portal
 * -----------------------------------------------------------------------------------------------*/

function renderCursorPortal(children: React.ReactNode) {
	const [body, setBody] = React.useState<HTMLElement | null>(null);

	React.useLayoutEffect(() => {
		setBody(document.body);
	}, []);

	return body
		? createPortal(children, body)
		: null;
}

/* -------------------------------------------------------------------------------------------------
 * Cursor Visibility Manager
 * -----------------------------------------------------------------------------------------------*/

let visibilityManager: CursorVisibilityManager | null = null;

type CursorVisibilityListener = { show(): void; hide(): void; };

type CursorVisibilityManager = {
	on(listener: CursorVisibilityListener): () => void;
};

function createCursorVisibilityManager(): CursorVisibilityManager {
	const listeners = new Set<CursorVisibilityListener>();

	function show() {
		listeners.forEach(listener => listener.show());
	}

	function hide() {
		listeners.forEach(listener => listener.hide());
	}

	function attach() {
		document.body.addEventListener(
			"mouseenter",
			show
		);

		document.body.addEventListener(
			"mouseleave",
			hide
		);
	}

	function detach() {
		document.body.removeEventListener(
			"mouseenter",
			show
		);

		document.body.removeEventListener(
			"mouseleave",
			hide
		);
	}

	return {
		on(listener: CursorVisibilityListener) {
			if (!listeners.size) {
				attach();
			}

			listeners.add(listener);

			return () => {
				listeners.delete(listener);

				if (listeners.size === 0) {
					detach();
				}
			};
		},
	};
}

function getCursorVisibilityManager(): CursorVisibilityManager {
	if (!visibilityManager) {
		visibilityManager =
			createCursorVisibilityManager();
	}

	return visibilityManager;
}

function useCursorVisibility(onShow: () => void) {
	const [isVisible, setIsVisible] =
		React.useState(true);

	React.useEffect(() => {
		return getCursorVisibilityManager().on({
			show: () => {
				if (!isVisible) {
					onShow();
					setIsVisible(true);
				}
			},

			hide: () => {
				setIsVisible(false);
			},
		});
	}, [isVisible]);

	return isVisible;
}

/* -------------------------------------------------------------------------------------------------
 * Cursor Target Detection
 * -----------------------------------------------------------------------------------------------*/

function findCursorElement(element: Element) {
	return element.closest<HTMLElement>("[data-cursor]");
}

function findPointerElement(element: Element) {
	return element.closest<HTMLElement>(
		'a, button, input[type="button"]:not(:disabled)'
	);
}

function findTextElement(element: Element) {
	if (
		window.getComputedStyle(element).userSelect ===
		"none"
	) {
		return null;
	}

	return element.closest<HTMLElement>(`
        p,
        textarea:not(:disabled),
        input[type='text']:not(:disabled),
        h1, h2, h3, h4, h5, h6
    `);
}

type CursorType = "pointer" | "text" | "default";

function detectCursorType(element: Element): [CursorType, HTMLElement | null] {
	let cursorElement = findCursorElement(element);

	if (cursorElement)
		return [
			cursorElement.dataset.cursor as CursorType,
			cursorElement,
		];

	cursorElement = findPointerElement(element);

	if (cursorElement)
		return ["pointer", cursorElement];

	cursorElement = findTextElement(element);

	if (cursorElement)
		return ["text", cursorElement];

	return ["default", null];
}

/* -------------------------------------------------------------------------------------------------
 * Cursor State
 * -----------------------------------------------------------------------------------------------*/

type CursorStateManager = {onChange(listener: CursorStateListener): () => void};

let cursorStateManager: CursorStateManager | null = null;

type CursorZone = string | null;

type CursorState = {
	type: CursorType;
	isPressed: boolean;
	fontSize: number | null;
	targetBoundingBox: DOMRect | null;
	target: HTMLElement | null;
	zone: CursorZone;
};
let cursorState: CursorState = {
	type: "default",
	isPressed: false,
	fontSize: null,
	targetBoundingBox: null,
	target: null,
	zone: null,
};

function getCursorZone(element: Element): CursorZone {
	let zone = null;

	if ("closest" in element) {
		const zoneElement = element.closest("[data-cursor-zone]");

		if (zoneElement instanceof HTMLElement)
			zone = zoneElement.dataset.cursorZone || null;
	}

	return zone;
}

type CursorStateListener = (cursorState: CursorState) => void;
function createCursorStateManager() {
	const listeners = new Set<CursorStateListener>();

	function updateCursorState(patch: Partial<CursorState>) {
		cursorState = {
			...cursorState,
			...patch
		};

		listeners.forEach(listener => listener(cursorState));
	}

	const handlePointerDown =
		filterPrimaryPointer(() => !cursorState.isPressed && updateCursorState({ isPressed: true }));

	const handlePointerUp =
		filterPrimaryPointer(() => cursorState.isPressed && updateCursorState({ isPressed: false }));

	const handlePointerOver =
		filterMouseEvent(({ target }) => {
			if (!target) return;

			const [
				type,
				detectedTarget,
			] = detectCursorType(target as Element);

			let changed = false;

			const nextState: Partial<CursorState> = {
				target: detectedTarget,
				zone: getCursorZone(target as Element),
			};

			if (type !== cursorState.type) {
				nextState.type = type;
				changed = true;
			}

			if (nextState.zone !== cursorState.zone)
				changed = true;

			const targetBounds =
				type === "pointer" &&
				detectedTarget
					? detectedTarget.getBoundingClientRect()
					: null;

			if (
				targetBounds !==
				cursorState.targetBoundingBox
			) {
				nextState.targetBoundingBox =
					targetBounds;

				changed = true;
			}

			if (type === "text") {
				const { fontSize } =
					window.getComputedStyle(target as Element);

				const parsedFontSize =
					fontSize
						? parseInt(fontSize)
						: null;

				if (
					parsedFontSize !==
					cursorState.fontSize
				) {
					nextState.fontSize =
						parsedFontSize;

					changed = true;
				}
			} else if (cursorState.fontSize) {
				nextState.fontSize = null;
				changed = true;
			}

			if (changed)
				updateCursorState(nextState);
		});

	function attach() {
		window.addEventListener(
			"pointerover",
			handlePointerOver
		);

		window.addEventListener(
			"pointerdown",
			handlePointerDown
		);

		window.addEventListener(
			"pointerup",
			handlePointerUp
		);
	}

	function detach() {
		window.removeEventListener(
			"pointerover",
			handlePointerOver
		);

		window.removeEventListener(
			"pointerdown",
			handlePointerDown
		);

		window.removeEventListener(
			"pointerup",
			handlePointerUp
		);
	}

	return {
		onChange(listener: CursorStateListener) {
			if (!listeners.size)
				attach();

			listeners.add(listener);

			return () => {
				listeners.delete(listener);

				if (!listeners.size)
					detach();
			};
		},
	};
}

function getCursorStateManager() {
	if (!cursorStateManager)
		cursorStateManager = createCursorStateManager();

	return cursorStateManager;
}

function useCursorState() {
	const [state, setState] = React.useState({...cursorState});

	React.useEffect(() => {
		return getCursorStateManager().onChange(setState);
	}, [state]);

	return state;
}

/* -------------------------------------------------------------------------------------------------
 * Motion Helpers
 * -----------------------------------------------------------------------------------------------*/

type Point = { x: number; y: number };
type MotionPoint = { x: MotionValue<number>; y: MotionValue<number> };

function usePointerInitialization(
	{ x, y }: MotionPoint,
	initialize: () => void
) {
	const [initialized, setInitialized] =
		React.useState(
			x.getPrevious() !== undefined ||
			y.getPrevious() !== undefined
		);

	React.useInsertionEffect(() => {
		if (initialized) return;

		function handleFirstChange() {
			setInitialized(true);
			initialize();
			unsubscribe();
		}

		const unsubscribe = pipe(
			x.on("change", handleFirstChange),
			y.on("change", handleFirstChange)
		);

		return () => unsubscribe();
	}, [x, y, initialized]);

	return initialized;
}

function useOffsetPointerPosition(
	pointer: MotionPoint,
	offset: Point
): MotionPoint {
	return {
		x: useTransform(
			() => pointer.x.get() + offset.x
		),

		y: useTransform(
			() => pointer.y.get() + offset.y
		),
	};
}

function useMixedMotionValue(
	source: MotionValue<number>,
	target: MotionValue<number>,
	progress: MotionValue<number>
) {
	return useTransform(() =>
		mix(
			source.get(),
			target.get(),
			progress.get()
		)
	);
}

function useMagneticAxis(
	pointerAxis: MotionValue<number>,
	snapStrength: number,
	target?: number
) {
	const targetValue = useSpring(0, {
		stiffness: 600,
		damping: 50,
	});

	const progress = useMotionValue(0);

	const mixed = useMixedMotionValue(
		pointerAxis,
		targetValue,
		progress
	);

	const previousTarget =
		React.useRef(target);

	useIsomorphicLayoutEffect(() => {
		if (target) {
			if (
				!previousTarget.current &&
				!progress.isAnimating()
			) {
				targetValue.jump(target);
			} else {
				targetValue.set(target);
			}

			animate(progress, snapStrength);
		} else {
			animate(progress, 0);
		}

		previousTarget.current = target;
	}, [target]);

	return mixed;
}

function useMagneticPointerPosition(
	pointer: MotionPoint,
	enabled: boolean,
	state: CursorState,
	snapStrength: number
) {
	const x = useMagneticAxis(
		pointer.x,
		snapStrength,
		state.targetBoundingBox
			? (
				state.targetBoundingBox.left +
				state.targetBoundingBox.width / 2
			)
			: undefined
	);

	const y = useMagneticAxis(
		pointer.y,
		snapStrength,
		state.targetBoundingBox
			? (
				state.targetBoundingBox.top +
				state.targetBoundingBox.height / 2
			)
			: undefined
	);

	return enabled
		? { x, y }
		: pointer;
}

/* -------------------------------------------------------------------------------------------------
 * Global Cursor Hiding
 * -----------------------------------------------------------------------------------------------*/

function installGlobalCursorStyles() {
	const style = document.createElement("style");

	style.textContent = `
        * {
            cursor: none !important;
        }

        [data-motion-cursor="pointer"] {
            background-color: #333;
        }
    `;

	document.head.appendChild(style);

	return () => {
		document.head.removeChild(style);
	};
}

function useHideNativeCursor(enabled: boolean) {
	useInsertionEffect(
		enabled
			? installGlobalCursorStyles
			: noop as () => void,
		[enabled]
	);
}

/* -------------------------------------------------------------------------------------------------
 * Defaults
 * -----------------------------------------------------------------------------------------------*/

const ZERO_POINT: Point = {
	x: 0,
	y: 0,
};

const CENTER_ORIGIN: Point = {
	x: 0.5,
	y: 0.5,
};

const REDUCED_MOTION_TRANSITION = {
	duration: 0,
};

const DEFAULTS: {
	followSpring: SpringOptions;
	magneticOptions: MagneticOptions;
} = {
	followSpring: {
		stiffness: 1000,
		damping: 100,
	},

	magneticOptions: {
		morph: true,
		padding: 5,
		snap: 0.8,
	},
};

/* -------------------------------------------------------------------------------------------------
 * Transform Template
 * -----------------------------------------------------------------------------------------------*/

function createTransformTemplate(origin: Point) {
	return (_: any, transform: string) =>
		`translate(-${origin.x * 100}%, -${origin.y * 100}%) ${transform}`;
}

const DEFAULT_TRANSITION = {
	duration: 0.15,
	ease: [0.38, 0.12, 0.29, 1],
};

/* -------------------------------------------------------------------------------------------------
 * Cursor Component
 * -----------------------------------------------------------------------------------------------*/

type MagneticOptions = { morph: boolean, padding: number, snap: number };
type CursorProps = {
	follow?: boolean;
	center?: Point;
	offset?: Point;
	spring?: SpringOptions | false;
	magnetic?: Partial<MagneticOptions> | false;
	matchTextSize?: boolean;
	children?: React.ReactNode;
	style?: MotionStyle;
} & MotionNodeAnimationOptions & React.ComponentProps<typeof motion.div>;

export function Cursor({
   follow = false,

   center = follow
	   ? ZERO_POINT
	   : CENTER_ORIGIN,

   offset = ZERO_POINT,

   spring = follow
	   ? DEFAULTS.followSpring
	   : false,

   magnetic = false,
   matchTextSize = false,
   children,
   style,
   ...props
}: CursorProps) {
	const prefersReducedMotion = useReducedMotion();

	useHideNativeCursor(
		!prefersReducedMotion && !follow
	);

	const pointer: MotionPoint = usePointerPosition();

	const offsetPointer = useOffsetPointerPosition(pointer, offset);

	const springX = useSpring(
		offsetPointer.x,
		spring || undefined
	);
	const springY = useSpring(
		offsetPointer.y,
		spring || undefined
	);

	const magneticOptions =
		typeof magnetic === "object"
			? {
				...DEFAULTS.magneticOptions,
				...magnetic,
			}
			: DEFAULTS.magneticOptions;

	const resetSprings = () => {
		const stopX = offsetPointer.x.on(
			"change",
			value => {
				springX.jump(value);
				stopX();
			}
		);

		const stopY = offsetPointer.y.on(
			"change",
			value => {
				springY.jump(value);
				stopY();
			}
		);
	};

	const cursorState = useCursorState();

	const isVisible = useCursorVisibility(resetSprings);

	const {
		x,
		y,
	} = useMagneticPointerPosition(
		spring
			? {
				x: springX,
				y: springY,
			}
			: pointer,

		!!magnetic,
		cursorState,
		magneticOptions.snap
	);

	const {
		width,
		height,
	} = getCursorDimensions({
		type: cursorState.type,
		state: cursorState,
		hasChildren: !!children,
		style,
		isMagnetic: !!magnetic,
		magneticOptions,
		matchTextSize,
	});

	const initialized =
		usePointerInitialization(
			pointer,
			resetSprings
		);

	return renderCursorPortal(initialized ?
		<LayoutGroup>
			<MotionConfig
				transition={
					prefersReducedMotion
						? REDUCED_MOTION_TRANSITION
						: (
							props.transition ||
							DEFAULT_TRANSITION
						)
				}
			>
				<motion.div
					layout
					data-motion-cursor={
						follow
							? "follow"
							: "pointer"
					}
					data-framer-portal-id="motion-cursor"
					initial="exit"
					exit="exit"
					{...props}
					variants={{
						pressed: follow
							? {}
							: {
								scale: 0.9,
							},

						...props.variants,

						default: {
							opacity: 1,
							scale: 1,
							...props.variants?.default,
						},

						exit: {
							opacity: 0,
							scale: 0,
							...props.variants?.exit,
						},
					}}
					animate={[
						"default",
						cursorState.type,

						magnetic &&
						cursorState.targetBoundingBox
							? "magnetic"
							: "",

						isVisible
							? (
								cursorState.isPressed
									? "pressed"
									: ""
							)
							: "exit",
					]}
					transformTemplate={createTransformTemplate(center)}
					style={{
						borderRadius: follow
							? 0
							: 20,

						zIndex: follow
							? 99998
							: 99999,

						willChange: "transform",
						contain: "layout",

						originX: center.x,
						originY: center.y,

						...style,

						width,
						height,

						x,
						y,

						top: 0,
						left: 0,

						position: "fixed",
						pointerEvents: "none",
					}}
				>
					<AnimatePresence>
						{children}
					</AnimatePresence>
				</motion.div>
			</MotionConfig>
		</LayoutGroup> :
		null
	);
}

export {
	useCursorState,
};