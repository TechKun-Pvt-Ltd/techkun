import React, {createContext, useContext} from "react";
import {Angle, PathBuilder, Point2D, Vector2D} from "svg-path-kit";
import {motion} from "motion/react";
import {css} from "@emotion/react";

export type PolarSpaceProps = {
	centerX: number;
	centerY: number;
	children?: React.ReactNode;
};

export type PolarSpaceContextValue = {
	centerX: number;
	centerY: number;
};

const PolarSpaceContext = createContext<PolarSpaceContextValue | null>(null);

// Pure geometry: a center point, and primitives that place things relative
// to it. No angle, no rotation, no CSS custom properties, no DOM node of
// its own — just a Context provider handing centerX/centerY to whatever's
// nested underneath, however deep.
function PolarSpace({centerX, centerY, children}: PolarSpaceProps) {
	return <PolarSpaceContext.Provider value={{centerX, centerY}}>
		{children}
	</PolarSpaceContext.Provider>;
}

export function usePolarSpace() {
	const context = useContext(PolarSpaceContext);
	if (context === null)
		throw new Error("usePolarSpace can only be used inside PolarSpace.");
	return context;
}

PolarSpace.Circle = function Circle(props: React.ComponentProps<"circle">) {
	const {centerX, centerY} = usePolarSpace();
	return <circle cx={centerX} cy={centerY} {...props} />;
};

PolarSpace.AngularTicks = function AngularTicks({radius, tickLength = 2.5, angularSpacing = Math.PI / 10, ...props}: {
	radius: number;
	tickLength?: number;
	angularSpacing?: number;
} & React.ComponentProps<"path">) {
	const {centerX, centerY} = usePolarSpace();
	const center = Point2D.of(centerX, centerY);
	const tickThickness = 0.1;
	const totalTicks = 2 * Math.PI / angularSpacing;

	const pb = PathBuilder.m(center.add(Vector2D.polar(radius, Angle.ZERO)));
	pb.l(Vector2D.polar(tickLength, Angle.ZERO));
	for (let i = 1; i < totalTicks; i++) {
		const angle = Angle.of(i * angularSpacing);
		pb.m(center.add(Vector2D.polar(radius, angle)));
		pb.l(Vector2D.polar(tickLength, angle));
	}

	return <path
		d={pb.toSVGPathString()}
		strokeWidth={tickThickness} stroke="currentColor"
		strokeLinecap="round" fill="none"
		{...props}
	/>;
};

// Replaces the old Rotor/ExtendedRotor line-drawing: a line from center out
// to `radius` along `angle` (default 0). No rotation-awareness — a caller
// that wants it to spin applies useRotation.rotatingClassName externally.
PolarSpace.Spoke = function Spoke({radius, angle = 0, ...props}: {
	radius: number;
	angle?: number;
} & React.ComponentProps<"line">) {
	const {centerX, centerY} = usePolarSpace();
	const tip = Point2D.of(centerX, centerY).add(Vector2D.polar(radius, angle));
	return <line x1={centerX} y1={centerY} x2={tip.x} y2={tip.y} {...props} />;
};

PolarSpace.Text = function Text({
	radius, startAngle, charAngle, sweepDirection,
	children, color = "currentColor",
	fontSize, fontFamily = "monospace",
	...props
}: {
	radius: number;
	startAngle: string;
	charAngle: string;
	sweepDirection?: "cw" | "ccw" | 1 | -1;
	children?: string | string[];
	color?: string;
	fontSize: number | string;
} & React.ComponentProps<"g">) {
	const {centerX, centerY} = usePolarSpace();
	const letters = Array.from(children ?
		typeof children === "string" ? children :
			Array.isArray(children) ? (children as any[]).join("") :
				"" :
		"");

	sweepDirection ||= 1;
	const sweepSign = sweepDirection === "cw" ? 1 : sweepDirection === "ccw" ? -1 : Math.sign(sweepDirection);
	return <g
		fill={color} fontFamily={fontFamily}
		fontSize={fontSize}
		{...props}
		css={css`
			--start-angle: ${startAngle};
			--char-angle: ${charAngle};
			--text-length: ${letters.length};
			--sweep: ${sweepSign};
			text {
				transform:
					translate(calc(${centerX}px - 50%), calc(${centerY}px - 50%))
                	rotate(calc(
						var(--sweep) * 90deg + var(--start-angle)
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

PolarSpace.RadialBox = function RadialBox({radius, angle, radialSize, angularSize, ...props}: {
	radius: number;
	angle: number;
	radialSize: number;
	angularSize: number;
} & React.ComponentProps<"path">) {
	const {centerX, centerY} = usePolarSpace();
	const center = Point2D.of(centerX, centerY);

	const pb = PathBuilder.m(center.add(Vector2D.polar(radius, angle)));
	pb.l(Vector2D.polar(radialSize, angle));
	pb.circularArc(radius + radialSize, angle, angle + angularSize);
	pb.l(Vector2D.polar(radialSize, angle + angularSize).opposite());
	pb.circularArc(radius, angle + angularSize, angle);

	return <path fill="currentColor" d={pb.toSVGPathString()} {...props} />;
};

export default PolarSpace;