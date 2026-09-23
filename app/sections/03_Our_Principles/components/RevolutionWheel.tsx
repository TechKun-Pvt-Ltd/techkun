import PolarSpace, {usePolarSpace} from "../../../../components/PolarSpace.tsx";
import {rotationClasses, rotationCssVars, rotationThresholdStyle} from "./rotation-css-api.ts";
import supportsQuery from "@/app/utils/css/supports-query.ts";
import {css} from "@emotion/react";
import React, {useEffect, useRef} from "react";
import {Angle, PathBuilder, Point2D, Vector2D} from "svg-path-kit";
import {useConicReveal} from "@/hooks/use-conic-reveal.ts";
import {MotionValue} from "motion";
import {Once} from "@/components/Once.tsx";
import {animate, motion, useTransform} from "motion/react";
import cssSupports from "@/app/utils/css/supports.ts";

const VIEW_BOX_START = 0;
const VIEW_BOX_SIZE = 100;
const WHEEL_RADIUS = 0.435 * VIEW_BOX_SIZE;
const CIRCLE_CENTER = VIEW_BOX_START + VIEW_BOX_SIZE / 2;

const centerPoint = Point2D.of(CIRCLE_CENTER);
function ClippedG({clipPathId, pathData, ...props}: {
    clipPathId: string;
    pathData: string | MotionValue<string>;
} & React.ComponentProps<"g">) {
    return <>
        <Once id={clipPathId}>
            <defs>
                <clipPath id={clipPathId}>
                    <motion.path d={pathData} />
                </clipPath>
            </defs>
        </Once>
        <g clipPath={`url(#${clipPathId})`} {...props} />
    </>;
}

function AxisCrosshair() {
    const { centerX, centerY } = usePolarSpace();
    return <>
        <line className="x-axis" x1={VIEW_BOX_START} y1={centerY} x2={VIEW_BOX_START + VIEW_BOX_SIZE} y2={centerY} />
        <line className="y-axis" x1={centerX} y1={VIEW_BOX_START} x2={centerX} y2={VIEW_BOX_START + VIEW_BOX_SIZE} />
    </>;
}

function Rotor() {
    return <>
        <g stroke="var(--color-stroke-revolution-wheel-rotor)" strokeWidth="0.25" fill="none">
            <PolarSpace.Spoke radius={VIEW_BOX_SIZE / 2} className={rotationClasses.rotating} strokeDasharray="2"/>
            <PolarSpace.Spoke
                radius={WHEEL_RADIUS}
                className={rotationClasses.rotating}
                style={{
                    filter:
                        "drop-shadow(0.3px 0.5px 0.7px oklch(from var(--color-stroke-revolution-wheel-rotor) l c h / 0.32)) " +
                        "drop-shadow(0.4px 0.8px 1px oklch(from var(--color-stroke-revolution-wheel-rotor) l c h / 0.32)) " +
                        "drop-shadow(1px 2px 2.5px oklch(from var(--color-stroke-revolution-wheel-rotor) l c h / 0.32))"
                }}
            />
        </g>
        <motion.circle
            cx={CIRCLE_CENTER + WHEEL_RADIUS} cy={CIRCLE_CENTER}
            r={1} fill="var(--color-fill-revolution-wheel-rotor-tip)"
            className={rotationClasses.rotating}
        />
        <motion.circle
            cx={CIRCLE_CENTER + WHEEL_RADIUS} cy={CIRCLE_CENTER}
            r={0.5} fill="var(--color-fill-revolution-wheel-rotor-tip-core)"
            className={rotationClasses.rotating}
        />
    </>;
}

function RotorProjections({ angle }: { angle: MotionValue<Angle> }) {
    const rotorX = useTransform(angle, a => CIRCLE_CENTER + WHEEL_RADIUS * a.cos);
    const rotorY = useTransform(angle, a => CIRCLE_CENTER + WHEEL_RADIUS * a.sin);

    return <>
        <motion.line x1={CIRCLE_CENTER} y1={rotorY} x2={rotorX} y2={rotorY} strokeDasharray="2"/>
        <motion.line x1={rotorX} y1={CIRCLE_CENTER} x2={rotorX} y2={rotorY} strokeDasharray="2"/>
    </>;
}

// A "blade" is a head (3-pointed chevron) plus two swept arms. The command
// sequence is identical for every blade (that's what makes them animatable
// into one another via the shared `d` attribute); only the sizes/angles and
// which way the head points differ between shapes, so those are the only
// things parameterized here.
//
// `direction` flips the whole construction top/bottom: derived by writing
// the "points up" and "points down" shapes side by side and factoring out
// their sign differences (verified against the original hand-written paths).
function buildBladeShape({direction: s, headSize, headSlantAngle, armLength, armHeight, armSlantAngle, gap}: {
    direction: 1 | -1;
    headSize: number; headSlantAngle: number;
    armLength: number; armHeight: number; armSlantAngle: number;
    gap: number;
}) {
    const armOffsetY = (s - 1) / 2 * armHeight;

    const pb = PathBuilder.m(centerPoint.add(Vector2D.of(0, -s * gap)));
    pb.l(Vector2D.polar(headSize, Math.PI + s * headSlantAngle));
    pb.l(Vector2D.polar(headSize, -s * headSlantAngle));
    pb.l(Vector2D.polar(headSize, s * headSlantAngle));
    pb.z();

    pb.m(centerPoint.add(Vector2D.polar(gap, Math.PI - s * armSlantAngle)).add(Vector2D.of(0, armOffsetY)));
    pb.l(Vector2D.polar(armLength, Math.PI + s * armSlantAngle));
    pb.l(Vector2D.of(0, armHeight));
    pb.l(Vector2D.polar(armLength, s * armSlantAngle));
    pb.z();

    pb.m(centerPoint.add(Vector2D.polar(gap, s * armSlantAngle)).add(Vector2D.of(0, armOffsetY)));
    pb.l(Vector2D.polar(armLength, -s * armSlantAngle));
    pb.l(Vector2D.of(0, armHeight));
    pb.l(Vector2D.polar(armLength, Math.PI - s * armSlantAngle));
    pb.z();

    return pb.toSVGPathString();
}

const shapes: string[] = [
    buildBladeShape({direction: 1, headSize: 1.5, headSlantAngle: Math.PI / 6, armLength: 1.5, armHeight: 1.25, armSlantAngle: Math.PI / 6, gap: 0.25}),
    buildBladeShape({direction: 1, headSize: 1.25, headSlantAngle: Math.PI / 6, armLength: 2, armHeight: 1.25, armSlantAngle: Math.PI / 6, gap: 0.25}),
    buildBladeShape({direction: -1, headSize: 1.25, headSlantAngle: Math.PI / 6, armLength: 2, armHeight: 1.25, armSlantAngle: Math.PI / 6, gap: 0.25}),
    buildBladeShape({direction: -1, headSize: 1.25, headSlantAngle: Math.PI / 3, armLength: 2, armHeight: 1.25, armSlantAngle: Math.PI / 5, gap: 0.25})
];

function centerIconPath(a: Angle) {
    return shapes[Math.floor(+a / +Angle.HALF_PI)] ?? shapes[shapes.length - 1];
}

function CenterIcon({angle, ...props}: {angle: MotionValue<Angle>} & React.ComponentProps<"path">) {
    const pathRef = useRef<SVGPathElement>(null);
    const pathData = useTransform(angle, centerIconPath);
    useEffect(() => {
        if (!pathRef.current) return;

        const pathElement = pathRef.current;
        return pathData.on("change", d => {
            if (cssSupports.d)
                pathElement.setAttribute("d", d);
            else
                animate(pathElement, {d}, {duration: 0.3});
        });
    }, []);

    return <path
        ref={pathRef} d={shapes[0]}
        css={css`
            @supports ${supportsQuery.d} {
                transition: d 0.3s ease;
            }
        `}
        {...props}
    />;
}

function WheelHub({angle}: {angle: MotionValue<Angle>}) {
    return <>
        <PolarSpace.Circle
            fill="var(--color-fill-revolution-wheel-hub)" stroke="var(--color-stroke-revolution-wheel-hub)" strokeWidth="0.1"
            r={WHEEL_RADIUS * 0.32}
            // style={{
            // 	filter:
            // 		"drop-shadow(0.3px 0.5px 0.7px oklch(from var(--color-neutral-tinted-900) l c h / 0.16)) " +
            // 		"drop-shadow(0.4px 0.8px 1px oklch(from var(--color-neutral-tinted-900) l c h / 0.16)) " +
            // 		"drop-shadow(1px 2px 2.5px oklch(from var(--color-neutral-tinted-900) l c h / 0.16))"
            // }}
        />
        <PolarSpace.Circle
            fill="none" stroke="var(--color-stroke-revolution-wheel-hub)" strokeWidth="0.1"
            r={WHEEL_RADIUS * 0.24}
        />
        <g css={css`
            --_radius: calc(0.2 * ${WHEEL_RADIUS}px);
            --_gap: calc(0.2 * var(--_radius));
            --_circumference: calc(2 * pi * var(--_radius));

            .progress-indicator {
                --_switch: clamp(0, var(${rotationCssVars.activeQuadrantIndex}) - var(--i), 1);

                r: var(--_radius);
                stroke-dasharray: 0, calc(var(--i) * 0.5 * pi * var(--_radius) + var(--_gap)),
                calc(0.5 * pi * var(--_radius) - 2 * var(--_gap)), var(--_circumference);
                stroke: color-mix(in oklch, var(--color-stroke-revolution-wheel-hub) calc((1 - var(--_switch)) * 100%), var(--color-stroke-revolution-wheel-rotor) calc(var(--_switch) * 100%));

                transition: stroke 0.2s ease-in-out;
            }
        `}>
            {Array.from({length: 4}, (_, i) => <PolarSpace.Circle
                key={i} className="progress-indicator"
                style={{'--i': i} as React.CSSProperties}
                fill="none" stroke="var(--color-stroke-revolution-wheel-hub)" strokeWidth="0.5"
                strokeLinecap="butt"
            />)}
        </g>
        <PolarSpace.Circle
            css={css`
                --_radius: ${0.24 * WHEEL_RADIUS}px;
                --_circumference: calc(2 * pi * var(--_radius));

                r: var(--_radius);
                stroke-dasharray: 0, var(--_circumference), var(--_circumference), 0;
                stroke-dashoffset: calc(-4 * var(--_radius) * var(${rotationCssVars.angle}) / (1rad));
                @supports not ${supportsQuery.unitStripping} {
                    stroke-dashoffset: calc(-4 * var(--_radius) * tan(atan2(var(${rotationCssVars.angle}), 1rad)));
                }
            `}
            fill="none" stroke="var(--color-stroke-revolution-wheel-rotor)" strokeWidth="0.08"
        />
        <CenterIcon angle={angle} fill="var(--color-fill-revolution-wheel-hub-icon)"/>
    </>;
}

const firstText = "Your product needs a";
const revealedText = "revolution";
const charAngle = 0.064;

const quotePart1 = "Design is not just what it looks and feels like";
const quotePart2 = "Design is how it works";
const quoteCharAngle = 0.064;

// Shared by both wheel faces below — none of these depend on the live
// rotation angle, so they're built once here rather than per render.
const innerCircleRadius = WHEEL_RADIUS * 0.48;
const innerCircle = <PolarSpace.Circle
    r={innerCircleRadius}
    fill="var(--_dial-fill-color)" stroke="var(--_stroke-color)"
    strokeWidth="0.1"
    strokeDasharray={`0 1 ${Math.PI * innerCircleRadius / 2 - 2} 2 ${Math.PI * innerCircleRadius / 2 - 2} 1`}
/>;

const radialBoxesDefs = [
    {
        radius: WHEEL_RADIUS * 0.6,
        angle: Math.PI + Math.PI / 3 + Math.PI / 30,
        radialSize: WHEEL_RADIUS * 0.4,
        angularSize: Math.PI / 4
    },
    {
        radius: WHEEL_RADIUS * 0.6,
        angle: Math.PI,
        radialSize: WHEEL_RADIUS * 0.4,
        angularSize: Math.PI / 3
    }
];
const radialBoxes = radialBoxesDefs.map(box => {
    const STROKE_WIDTH = 0.1;
    const pb = PathBuilder.m(centerPoint.add(Vector2D.polar(box.radius + box.radialSize, box.angle)));
    pb.circularArc(box.radius + box.radialSize, box.angle, box.angle + box.angularSize);
    return <React.Fragment key={`${box.radius}-${box.angle}-${box.radialSize}-${box.angularSize}`}>
        <PolarSpace.RadialBox
            {...box}
            fill="var(--_fill-color)" stroke="var(--_stroke-color)"
            strokeWidth={STROKE_WIDTH}
            className={rotationClasses.rotatingClamped}
            style={rotationThresholdStyle("0rad")}
        />
        <path fill="none" stroke="var(--_lighter-stroke)" strokeWidth={STROKE_WIDTH} className={rotationClasses.rotating} d={pb.toSVGPathString()} />
    </React.Fragment>;
});

const tinyRadialBoxes = <>
    <PolarSpace.RadialBox
        radius={WHEEL_RADIUS * 0.6} angle={Math.PI / 60}
        radialSize={WHEEL_RADIUS * 0.2} angularSize={Math.PI / 2.6}
        fill="var(--_dial-fill-color)" stroke="var(--_stroke-color)"
        strokeWidth="0.1"
        className={rotationClasses.rotatingClamped}
        style={rotationThresholdStyle("0rad")}
    />
</>;

const dashedWheel = <g className={rotationClasses.rotating}>
    <PolarSpace.AngularTicks radius={WHEEL_RADIUS * 0.35} stroke="var(--_stroke-color)" />
    <PolarSpace.AngularTicks radius={WHEEL_RADIUS * 0.35} stroke="var(--_lighter-stroke)" angularSpacing={Math.PI / 2} />
</g>;

function BackWheelFace({pathData}: {pathData: string | MotionValue<string>}) {
    return <ClippedG clipPathId="back-clip-path" pathData={pathData} className="back-layer">
        {innerCircle}
        {tinyRadialBoxes}
        {radialBoxes}
        {dashedWheel}
        <PolarSpace.Text
            className={rotationClasses.rotatingClamped}
            style={{
                textTransform: "uppercase",
                ...rotationThresholdStyle(`${charAngle}rad`, `${Math.PI - charAngle * (firstText.length + 1)}rad`)
            }}
            radius={WHEEL_RADIUS - 5}
            startAngle={`${charAngle * (firstText.length + 1)}rad`} charAngle={`${charAngle}rad`}
            sweepDirection="ccw"
            fontSize={2.5}
            color="var(--color-fill-revolution-wheel-back-text)"
        >{firstText}</PolarSpace.Text>
        <PolarSpace.Text
            radius={WHEEL_RADIUS * 0.54}
            charAngle={quoteCharAngle + "rad"} fontSize={2.5}
            startAngle={-(Math.PI / 2 + quoteCharAngle * quotePart1.length / 2) + "rad"}
            color="var(--color-fill-revolution-wheel-back-quote)"
        >{quotePart1}</PolarSpace.Text>
    </ClippedG>;
}

function FrontWheelFace({pathData}: {pathData: string | MotionValue<string>}) {
    return <ClippedG clipPathId="front-clip-path" pathData={pathData} className="front-layer">
        <rect fill="url(#brand-radial-gradient)" fillOpacity="0.25" x="0%" y="0%" width="100%" height="100%"
              clipPath="url(#radial-boxes-clip-path)"/>
        {innerCircle}
        {tinyRadialBoxes}
        {radialBoxes}
        <clipPath id="radial-boxes-clip-path">
            {radialBoxes}
        </clipPath>
        {dashedWheel}
        <PolarSpace.Text
            className={rotationClasses.rotatingClamped}
            style={{textTransform: "uppercase", ...rotationThresholdStyle("0rad")}}
            radius={WHEEL_RADIUS - 5}
            startAngle={-" ".length * charAngle + "rad"} charAngle={`${charAngle}rad`}
            sweepDirection="ccw"
            fontSize={2.5}
            color="var(--color-fill-revolution-wheel-front-text)"
        >{revealedText}</PolarSpace.Text>
        <PolarSpace.Text
            className={rotationClasses.rotatingClamped}
            style={{
                textTransform: "uppercase",
                ...rotationThresholdStyle((2 * Math.PI - charAngle * "LET'S KICKSTART YOUR".length) + "rad")
            }}
            radius={WHEEL_RADIUS - 5}
            startAngle={"0rad"} charAngle={`${charAngle}rad`}
            sweepDirection="ccw"
            fontSize={2.5}
            color="var(--color-fill-revolution-wheel-front-text)"
        >{"LET'S KICKSTART YOUR"}</PolarSpace.Text>
        <PolarSpace.Text
            className={rotationClasses.rotatingClamped}
            style={rotationThresholdStyle(
                (3 * Math.PI / 2 - quoteCharAngle * (quotePart1.length / 2 - quotePart2.length - 1)) + "rad"
            )}
            radius={WHEEL_RADIUS * 0.54}
            charAngle={quoteCharAngle + "rad"} fontSize={2.5}
            startAngle={(3 * Math.PI / 2 - quoteCharAngle * quotePart1.length / 2) + "rad"}
            color="var(--color-fill-revolution-wheel-front-quote)"
        >{quotePart2}</PolarSpace.Text>
    </ClippedG>;
}

export default function RevolutionWheel({angle, angleRangeStart}: { angle: MotionValue<Angle>; angleRangeStart: number; }) {
    const [frontClipPath, backClipPath] = useConicReveal({
        angle: angle,
        startAngle: angleRangeStart,
        centerX: CIRCLE_CENTER,
        centerY: CIRCLE_CENTER,
        radius: VIEW_BOX_SIZE / 2
    });

    return <PolarSpace centerX={CIRCLE_CENTER} centerY={CIRCLE_CENTER}>
        <svg
            aria-hidden="true"
            viewBox={`${VIEW_BOX_START} ${VIEW_BOX_START} ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`}
            strokeLinejoin="round" strokeLinecap="round"
            style={{
                [rotationCssVars.centerX]: `${CIRCLE_CENTER}px`,
                [rotationCssVars.centerY]: `${CIRCLE_CENTER}px`
            } as React.CSSProperties}
            css={css`
                height: 110%;
                width: 100%;
                will-change: transform;
    
                g.back-layer {
                    --_dial-fill-color: var(--color-fill-revolution-wheel-back-dial);
                    --_fill-color: var(--color-fill-revolution-wheel-back);
                    --_stroke-color: var(--color-stroke-revolution-wheel-back);
                    --_lighter-stroke: var(--color-stroke-revolution-wheel-back-accent);
                }
    
                g.front-layer {
                    --_dial-fill-color: var(--color-fill-revolution-wheel-front-dial);
                    --_fill-color: none;
                    --_stroke-color: var(--color-stroke-revolution-wheel-front);
                    --_lighter-stroke: var(--color-stroke-revolution-wheel-front-accent);
                }
            `}
        >
            <defs>
                <radialGradient id="brand-radial-gradient">
                    <stop offset="-20%" stopColor="var(--color-fill-revolution-wheel-glow)"/>
                    <stop offset="80%" stopColor="var(--color-fill-revolution-wheel-glow-edge)"/>
                </radialGradient>
            </defs>
            <g stroke="var(--color-stroke-revolution-wheel-axis)" strokeWidth="0.1" fill="none">
                <AxisCrosshair />
                <RotorProjections angle={angle} />
            </g>
            <BackWheelFace pathData={backClipPath} />
            <FrontWheelFace pathData={frontClipPath} />
            <Rotor/>
            <WheelHub angle={angle}/>
        </svg>
    </PolarSpace>;
}