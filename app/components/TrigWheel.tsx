import {motion} from "motion/react";
import React, {createContext, useContext} from "react";
import {round} from "svg-path-kit/numbers";
import {Angle} from "svg-path-kit";
import {MotionValue} from "motion";
import {useConstant} from "@/hooks/use-constant";
import {cancelFrame, frame, motionValue} from "motion-dom";
import useAbortSignal from "@/hooks/use-abort-signal";
import {css} from "@emotion/react";

const DEFAULT_START = 0;
const DEFAULT_SIZE = 100;

export type TrigWheelProps = {
	angle: MotionValue<Angle>;
	startX?: number;
	startY?: number;
	size?: number;
	radius?: number;
	children?: React.ReactNode;
};

type Transformer<T = any> = (a: Angle, v: BaseTrigWheelContext["props"]) => T;
type TransformersMap = {
	[key: keyof any]: Transformer;
};
type MapTransformersToMotionValues<T extends TransformersMap> = {
	[K in keyof T]: MotionValue<T[K] extends Transformer<infer R> ? R : never>;
};

const transformersMap = {
	cssAngle(a) {
		return `${+a}rad`;
	},
	rotorX(a, {centerX, radius}) {
		return centerX + radius * a.cosine;
	},
	rotorY(a, {centerY, radius}) {
		return centerY + radius * a.sine;
	}
} satisfies TransformersMap;

type BaseTrigWheelContext = {
	props: {
		angle: MotionValue<Angle>;
		radius: number;
		centerX: number; centerY: number;
		startX: number; startY: number;
		endX: number; endY: number;
	};
	getOrRegister<T>(key: string | symbol, transformer: Transformer<T>): MotionValue<T>;
	unregister(key: string | symbol): void;
};
type TrigWheelContext =
	Omit<BaseTrigWheelContext, "props"> & BaseTrigWheelContext["props"]
	& MapTransformersToMotionValues<typeof transformersMap>;

const TrigWheelContext = createContext<TrigWheelContext | null>(null);

const proxyHandler: ProxyHandler<BaseTrigWheelContext> = {
	get(target, p, receiver): any {
		if (p in target.props)
			return Reflect.get(target.props, p, receiver);
		if (p in target)
			return Reflect.get(target, p, receiver);
		if (!(p in transformersMap))
			return undefined;

		const transformer: Transformer = transformersMap[p as keyof typeof transformersMap];
		return target.getOrRegister(p, transformer);
	}
};

function TrigWheel({
	angle,
	size = DEFAULT_SIZE,
	startX = DEFAULT_START,
	startY = DEFAULT_START,
	radius = 0.4 * size,
	children
}: TrigWheelProps) {
	const endX = startX + size;
	const endY = startY + size;
	const centerX = startX + size / 2;
	const centerY = startY + size / 2;

	const abortSignal = useAbortSignal();
	const valuesMap = useConstant(() => new Map<string | symbol, MotionValue>);

	const baseTrigWheelContext: BaseTrigWheelContext = {
		props: {
			angle,
			radius,
			centerX, centerY,
			startX, startY,
			endX, endY,
		},
		getOrRegister(key, transformer) {
			if (valuesMap.has(key)) return valuesMap.get(key) as any;
			const {props} = baseTrigWheelContext;
			const freshValue = motionValue(transformer(props.angle.get(), props));

			function updateValue() {
				freshValue.set(transformer(props.angle.get(), props));
			}
			const unsubscribe = props.angle.on(
				"change",
				() => frame.preRender(updateValue, false, true)
			);

			abortSignal.addEventListener("abort", () => {
				unsubscribe();
				cancelFrame(updateValue);
			});

			valuesMap.set(key, freshValue);
			return freshValue;
		},
		unregister(key) {
			valuesMap.get(key)?.destroy();
			valuesMap.delete(key);
		}
	};
	return <TrigWheelContext.Provider value={
		new Proxy(baseTrigWheelContext, proxyHandler) as unknown as TrigWheelContext
	}>
		<Container>{children}</Container>
	</TrigWheelContext.Provider>;
}

function useTrigWheel() {
	const context = useContext(TrigWheelContext);
	if (context === null)
		throw new Error("TrigWheelContext can only be used inside TrigWheel.");
	return context;
}

function Container({ children }: { children: React.ReactNode }) {
	const { centerX, centerY, cssAngle } = useTrigWheel();
	return <motion.g
		style={{ "--angle": cssAngle } as React.CSSProperties}
		css={css`
			.trig-wheel-rotate {
				transform-box: view-box;
				transform-origin: ${centerX}px ${centerY}px;
				transform: rotate(var(--angle));
			}
		`}
	>
		{children}
	</motion.g>;
}

TrigWheel.Circle = function Circle(props: React.ComponentProps<"circle">) {
	const { radius, centerX, centerY } = useTrigWheel();
	return <circle r={radius} cx={centerX} cy={centerY} {...props} />;
};

TrigWheel.InnerDashedWheel = function InnerDashedWheel({inset = 8, markerSize = 2.5, markersPerQuarter = 15, ...props}: {
	inset?: number;
	markerSize?: number;
	markersPerQuarter?: number;
} & React.ComponentProps<"circle">) {
	const { radius, centerX, centerY } = useTrigWheel();
	const markerThickness = 0.25;
	const effectiveRadius = radius - markerSize / 2 - inset;

	return <circle
		r={effectiveRadius} cx={centerX} cy={centerY}
		fill="none" stroke="currentColor"
		strokeWidth={markerSize} strokeDasharray={markerThickness + " " + (Math.PI * effectiveRadius / (2 * markersPerQuarter) - markerThickness)}
		className="trig-wheel-rotate"
		{...props}
	/>;
};

TrigWheel.XAxis = function XAxis(props: React.ComponentProps<"line">) {
	const { startX, centerY, endX } = useTrigWheel();
	return <line x1={startX} y1={centerY} x2={endX} y2={centerY} {...props} />;
};

TrigWheel.YAxis = function YAxis(props: React.ComponentProps<"line">) {
	const { startY, centerX, endY } = useTrigWheel();
	return <line x1={centerX} y1={startY} x2={centerX} y2={endY} {...props} />
};

TrigWheel.Rotor = function Rotor(props: React.ComponentProps<"line">) {
	const { centerX, centerY, radius } = useTrigWheel();

	return <line
		x1={centerX} y1={centerY}
		x2={centerX + radius} y2={centerY}
		className="trig-wheel-rotate"
		{...props}
	/>
};

TrigWheel.ExtendedRotor = function ExtendedRotor(props: React.ComponentProps<"line">) {
	const { centerX, centerY, endX } = useTrigWheel();

	return <line
		x1={centerX} y1={centerY}
		x2={endX} y2={centerY}
		className="trig-wheel-rotate"
		{...props}
	/>
};

TrigWheel.RotorTerminal = function RotorTerminal(props: React.ComponentProps<typeof motion.circle>) {
	const {centerX, centerY, radius} = useTrigWheel();
	return <motion.circle
		r={1} cx={centerX + radius} cy={centerY}
		className="trig-wheel-rotate"
		{...props}
	></motion.circle>;
};

TrigWheel.RotorXProjection = function RotorXProjection(props: React.ComponentProps<typeof motion.line>) {
	const {centerX, rotorX, rotorY} = useTrigWheel();
	return <motion.line
		x1={centerX} y1={rotorY}
		x2={rotorX} y2={rotorY}
		strokeDasharray="2"
		{...props}
	></motion.line>;
};

TrigWheel.RotorYProjection = function RotorYProjection(props: React.ComponentProps<typeof motion.line>) {
	const {centerY, rotorX, rotorY} = useTrigWheel();
	return <motion.line
		x1={rotorX} y1={centerY}
		x2={rotorX} y2={rotorY}
		strokeDasharray="2"
		{...props}
	></motion.line>
};

TrigWheel.Text = function Text({
	radius, startAngle, charAngle,
	rotationStartThreshold,
	rotationEndThreshold,
   	children, color = "currentColor",
   	fontSize, fontFamily = "monospace",
   	...props
}: {
	radius: number;
	startAngle: string;
	charAngle: string;
	rotationStartThreshold?: string;
	rotationEndThreshold?: string;
	children?: string | string[];
	color?: string;
	fontSize: number | string;
} & React.ComponentProps<"g">) {
	const {centerX, centerY} = useTrigWheel();
	const letters = Array.from(children ?
		typeof children === "string" ? children :
			Array.isArray(children) ? (children as any[]).join("") :
				"" :
		"");

	// language=CSS prefix="div { --variable: " suffix="; }"
	const sweptAngle = rotationStartThreshold ?
		`calc(clamp(
			var(--rotation-start-threshold),
			var(--angle),
			${rotationEndThreshold ? "var(--rotation-end-threshold)" : "none"}
		) - var(--rotation-start-threshold))` :
		"0rad";

	return <g
		fill={color} fontFamily={fontFamily}
		fontSize={fontSize}
		{...props}
		css={css`
			--center-x: ${centerX}px;
			--center-y: ${centerY}px;
			--start-angle: ${startAngle};
			--char-angle: ${charAngle};
			--rotation-start-threshold: ${rotationStartThreshold ?? ""};
			--rotation-end-threshold: ${rotationEndThreshold ?? ""};
			--swept-angle: ${sweptAngle};
			text {
				transform:
					translate(calc(var(--center-x) - 50%), calc(var(--center-y) - 50%))
                	rotate(calc(
						90deg + var(--start-angle)
						+ var(--swept-angle)
						+ var(--char-angle) * (var(--i) + 0.5)
					))
                	translateY(-${radius}px);
				transform-box: fill-box;
				transform-origin: 50% 50%;
			}
		`}
	>
		{letters.map((letter, i) => letter === " " ?
			null :
			<motion.text
				key={i}
				x="0" y={fontSize}
				style={{'--i': i} as React.CSSProperties}
			>{letter}</motion.text>
		)}
	</g>;
}

const angleLabelTransformer: Transformer<number> = a => round(+a + Math.PI / 2, 4);
TrigWheel.AngleLabel = function AngleLabel(props: React.ComponentProps<typeof motion.text>) {
	const { centerX, centerY, angle, getOrRegister } = useTrigWheel();
	return <motion.text
		x={centerX + 2} y={centerY - 2}
		{...props}
	>
		{angle && getOrRegister("angle-label", angleLabelTransformer)}
	</motion.text>;
};

export default TrigWheel;