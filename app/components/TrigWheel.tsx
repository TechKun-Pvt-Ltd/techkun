import {motion, useTransform} from "motion/react";
import React, {createContext, useContext} from "react";
import {round} from "svg-path-kit/numbers";
import {Angle} from "svg-path-kit";
import {MotionValue} from "motion";
import {useMappedValues} from "@/hooks/use-mapped-values";

const DEFAULT_START = 0;
const DEFAULT_SIZE = 100;

const TrigWheelContext = createContext({
	radius: 0,
	centerX: 0,
	centerY: 0,
	startX: 0,
	startY: 0,
	endX: 0,
	endY: 0,
	angle: undefined as MotionValue<Angle> | undefined,
	cssAngle: undefined as MotionValue<`${number}rad`> | undefined,
	rotorX: undefined as MotionValue<number> | undefined,
	rotorY: undefined as MotionValue<number> | undefined
});

export type TrigWheelProps = {
	angle: MotionValue<Angle>;
	startX?: number;
	startY?: number;
	size?: number;
	radius?: number;
	children?: React.ReactNode;
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

	const [cssAngle, rotorX, rotorY] = useMappedValues(angle, a => {
		const angleValue = +a;
		return [
			`${angleValue}rad`,
			centerX + radius * a.cosine,
			centerY + radius * a.sine
		];
	});

	return <TrigWheelContext.Provider value={{
		cssAngle, angle, radius,
		centerX, centerY,
		startX, startY,
		endX, endY,
		rotorX, rotorY
	}}>{children}</TrigWheelContext.Provider>;
}

TrigWheel.Circle = function Circle(props: React.ComponentProps<"circle">) {
	const { radius, centerX, centerY } = useContext(TrigWheelContext);
	return <circle r={radius} cx={centerX} cy={centerY} {...props} />;
};

TrigWheel.InnerDashedWheel = function InnerDashedWheel({inset = 8, markerSize = 2.5, markersPerQuarter = 15, ...props}: {
	inset?: number;
	markerSize?: number;
	markersPerQuarter?: number;
} & React.ComponentProps<typeof motion.circle>) {
	const { radius, centerX, centerY, cssAngle } = useContext(TrigWheelContext);
	const markerThickness = 0.25;
	const effectiveRadius = radius - markerSize / 2 - inset;

	return <motion.circle
		r={effectiveRadius} cx={centerX} cy={centerY}
		fill="none" stroke="currentColor"
		strokeWidth={markerSize} strokeDasharray={markerThickness + " " + (Math.PI * effectiveRadius / (2 * markersPerQuarter) - markerThickness)}
		style={{
			rotate: cssAngle ?? "",
			transformBox: 'view-box'
		}}
		{...props}
	/>;
};

TrigWheel.XAxis = function XAxis(props: React.ComponentProps<"line">) {
	const { startX, centerY, endX } = useContext(TrigWheelContext);
	return <line x1={startX} y1={centerY} x2={endX} y2={centerY} {...props} />;
};

TrigWheel.YAxis = function YAxis(props: React.ComponentProps<"line">) {
	const { startY, centerX, endY } = useContext(TrigWheelContext);
	return <line x1={centerX} y1={startY} x2={centerX} y2={endY} {...props} />
};

TrigWheel.Rotor = function Rotor(props: React.ComponentProps<typeof motion.line>) {
	const { centerX, centerY, radius, cssAngle } = useContext(TrigWheelContext);

	return <motion.line
		x1={centerX} y1={centerY}
		x2={centerX + radius} y2={centerY}
		style={{
			rotate: cssAngle ?? "",
			transformBox: 'view-box'
		}}
		{...props}
	/>
};

TrigWheel.ExtendedRotor = function ExtendedRotor(props: React.ComponentProps<typeof motion.line>) {
	const { centerX, centerY, endX, cssAngle } = useContext(TrigWheelContext);

	return <motion.line
		x1={centerX} y1={centerY}
		x2={endX} y2={centerY}
		style={{
			rotate: cssAngle ?? "",
			transformBox: 'view-box'
		}}
		{...props}
	/>
};

TrigWheel.RotorTerminal = function RotorTerminal(props: React.ComponentProps<typeof motion.circle>) {
	const {rotorX, rotorY} = useContext(TrigWheelContext);
	return <motion.circle
		r={1} cx={rotorX} cy={rotorY}
		{...props}
	></motion.circle>;
};

TrigWheel.RotorXProjection = function RotorXProjection(props: React.ComponentProps<typeof motion.line>) {
	const {centerX, rotorX, rotorY} = useContext(TrigWheelContext);
	return <motion.line
		x1={centerX} y1={rotorY}
		x2={rotorX} y2={rotorY}
		strokeDasharray="2"
		{...props}
	></motion.line>;
};

TrigWheel.RotorYProjection = function RotorYProjection(props: React.ComponentProps<typeof motion.line>) {
	const {centerY, rotorX, rotorY} = useContext(TrigWheelContext);
	return <motion.line
		x1={rotorX} y1={centerY}
		x2={rotorX} y2={rotorY}
		strokeDasharray="2"
		{...props}
	></motion.line>
};

TrigWheel.AngleLabel = function AngleLabel(props: React.ComponentProps<typeof motion.text>) {
	const { centerX, centerY, angle } = useContext(TrigWheelContext);
	return <motion.text
		x={centerX + 2} y={centerY - 2}
		{...props}
	>
		{angle && useTransform(angle, a => round(+a + Math.PI / 2, 4))}
	</motion.text>;
};

export default TrigWheel;