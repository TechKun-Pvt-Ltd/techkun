import {motion} from "motion/react";
import React, {createContext, useContext} from "react";
import {round} from "svg-path-kit/numbers";
import {Angle, PathBuilder, Point2D, Vector2D} from "svg-path-kit";
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
	rotorX(a, {center, radius}) {
		return center.x + radius * a.cosine;
	},
	rotorY(a, {center, radius}) {
		return center.y + radius * a.sine;
	}
} satisfies TransformersMap;

type BaseTrigWheelContext = {
	props: {
		angle: MotionValue<Angle>;
		radius: number;
		center: Point2D;
		start: Point2D;
		end: Point2D;
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
			angle, radius,
			center: Point2D.of(centerX, centerY),
			start: Point2D.of(startX, startY),
			end: Point2D.of(endX, endY)
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
	const { center, cssAngle } = useTrigWheel();
	return <motion.g
		style={{ "--angle": cssAngle } as React.CSSProperties}
		css={css`
			.trig-wheel-rotate {
				transform-box: view-box;
				transform-origin: ${center.x}px ${center.y}px;
				transform: rotate(var(--angle));
			}
		`}
	>
		{children}
	</motion.g>;
}

TrigWheel.Circle = function Circle(props: React.ComponentProps<"circle">) {
	const { radius, center } = useTrigWheel();
	return <circle r={radius} cx={center.x} cy={center.y} {...props} />;
};

TrigWheel.DashedWheel = function DashedWheel({radius, markerSize = 2.5, markersPerQuarter = 5, ...props}: {
	radius: number;
	markerSize?: number;
	markersPerQuarter?: number;
} & React.ComponentProps<"circle">) {
	const { center } = useTrigWheel();
	const markerThickness = 0.25;
	const effectiveRadius = radius - markerSize / 2;

	return <circle
		r={effectiveRadius} cx={center.x} cy={center.y}
		fill="none" stroke="currentColor"
		strokeWidth={markerSize}
		strokeDasharray={markerThickness + " " + (Math.PI * effectiveRadius / (2 * markersPerQuarter) - markerThickness)}
		strokeDashoffset={markerThickness / 2}
		className="trig-wheel-rotate"
		{...props}
	/>;
};

TrigWheel.XAxis = function XAxis(props: React.ComponentProps<"line">) {
	const { start, center, end } = useTrigWheel();
	return <line x1={start.x} y1={center.y} x2={end.x} y2={center.y} {...props} />;
};

TrigWheel.YAxis = function YAxis(props: React.ComponentProps<"line">) {
	const { start, center, end } = useTrigWheel();
	return <line x1={center.x} y1={start.y} x2={center.x} y2={end.y} {...props} />
};

TrigWheel.Rotor = function Rotor(props: React.ComponentProps<"line">) {
	const { center, radius } = useTrigWheel();

	return <line
		x1={center.x} y1={center.y}
		x2={center.x + radius} y2={center.y}
		className="trig-wheel-rotate"
		{...props}
	/>
};

TrigWheel.ExtendedRotor = function ExtendedRotor(props: React.ComponentProps<"line">) {
	const { center, end } = useTrigWheel();

	return <line
		x1={center.x} y1={center.y}
		x2={end.x} y2={center.y}
		className="trig-wheel-rotate"
		{...props}
	/>
};

TrigWheel.RotorTerminal = function RotorTerminal(props: React.ComponentProps<typeof motion.circle>) {
	const {center, radius} = useTrigWheel();
	return <motion.circle
		r={1} cx={center.x + radius} cy={center.y}
		className="trig-wheel-rotate"
		{...props}
	></motion.circle>;
};

TrigWheel.RotorXProjection = function RotorXProjection(props: React.ComponentProps<typeof motion.line>) {
	const {center, rotorX, rotorY} = useTrigWheel();
	return <motion.line
		x1={center.x} y1={rotorY}
		x2={rotorX} y2={rotorY}
		strokeDasharray="2"
		{...props}
	></motion.line>;
};

TrigWheel.RotorYProjection = function RotorYProjection(props: React.ComponentProps<typeof motion.line>) {
	const {center, rotorX, rotorY} = useTrigWheel();
	return <motion.line
		x1={rotorX} y1={center.y}
		x2={rotorX} y2={rotorY}
		strokeDasharray="2"
		{...props}
	></motion.line>
};

TrigWheel.Text = function Text({
	radius, startAngle, charAngle,
	rotationStartThreshold,
	rotationEndThreshold,
	sweepDirection,
   	children, color = "currentColor",
   	fontSize, fontFamily = "monospace",
   	...props
}: {
	radius: number;
	startAngle: string;
	charAngle: string;
	rotationStartThreshold?: string;
	rotationEndThreshold?: string;
	sweepDirection?: "cw" | "ccw" | 1 | -1;
	children?: string | string[];
	color?: string;
	fontSize: number | string;
} & React.ComponentProps<"g">) {
	const {center} = useTrigWheel();
	const letters = Array.from(children ?
		typeof children === "string" ? children :
			Array.isArray(children) ? (children as any[]).join("") :
				"" :
		"");

	// language=CSS prefix="div { --variable: " suffix="; }"
	const sweptAngle = rotationStartThreshold ?
		`calc(clamp(
			${rotationStartThreshold},
			var(--angle),
			${rotationEndThreshold || "none"}
		) - ${rotationStartThreshold})` :
		"0rad";

	sweepDirection ||= 1;
	const sweepSign = sweepDirection === "cw" ? 1 : sweepDirection === "ccw" ? -1 : Math.sign(sweepDirection);
	return <g
		fill={color} fontFamily={fontFamily}
		fontSize={fontSize}
		{...props}
		css={css`
			--center-x: ${center.x}px;
			--center-y: ${center.y}px;
			--start-angle: ${startAngle};
			--char-angle: ${charAngle};
			--swept-angle: ${sweptAngle};
			--sweep: ${sweepSign};
			text {
				transform:
					translate(calc(var(--center-x) - 50%), calc(var(--center-y) - 50%))
                	rotate(calc(
						var(--sweep) * 90deg + var(--start-angle)
						+ var(--swept-angle)
						+ var(--sweep) * var(--char-angle) * (var(--i) + 0.5)
					))
                	translateY(calc(-1 * var(--sweep) * ${radius}px));
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
};

TrigWheel.RadialBox = function RadialBox({radius, angle, radialSize, angularSize, rotationStartThreshold, rotationEndThreshold, ...props}: {
	radius: number;
	angle: number;
	radialSize: number;
	angularSize: number;
	rotationStartThreshold?: string;
	rotationEndThreshold?: string;
} & React.ComponentProps<"path">) {
	const {center} = useTrigWheel();

	const pb = PathBuilder.m(center.add(Vector2D.polar(radius, angle)));
	pb.l(Vector2D.polar(radialSize, angle));
	pb.circularArc(radius + radialSize, angle, angle + angularSize);
	pb.l(Vector2D.polar(radialSize, angle + angularSize).opposite());
	pb.circularArc(radius, angle + angularSize, angle);

	// language=CSS prefix="div { --variable: " suffix="; }"
	const sweptAngle = rotationStartThreshold ?
		`calc(clamp(
			${rotationStartThreshold},
			var(--angle),
			${rotationEndThreshold || "none"}
		) - ${rotationStartThreshold})` :
		"0rad";

	return <path
		fill="currentColor" d={pb.toSVGPathString()}
		css={css`
			transform: rotate(${sweptAngle});
			transform-box: view-box;
			transform-origin: ${center.x}px ${center.y}px;
		`}
		{...props}
	/>;
}

const angleLabelTransformer: Transformer<number> = a => round(+a - Math.PI, 4);
TrigWheel.AngleLabel = function AngleLabel(props: React.ComponentProps<typeof motion.text>) {
	const { center, angle, getOrRegister } = useTrigWheel();
	return <motion.text
		x={center.x} y={center.y}
		css={css`
			font-weight: 600;
			transform-box: fill-box;
			transform: translate(-50%, 25%);
		`}
		{...props}
	>
		{angle && getOrRegister("angle-label", angleLabelTransformer)}
	</motion.text>;
};

export default TrigWheel;