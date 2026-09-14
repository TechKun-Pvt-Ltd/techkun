import PolarSpace, {usePolarSpace} from "./PolarSpace.tsx";
import {rotationCssApi, rotationCssVars, rotationThresholdStyle} from "./rotation-css-api.ts";
import supportsQuery from "@/app/utils/css/supports-query.ts";
import {css} from "@emotion/react";
import React, {useEffect, useRef} from "react";
import {Angle, PathBuilder, Point2D, Vector2D} from "svg-path-kit";
import {useConicReveal} from "@/hooks/use-conic-reveal.ts";
import {MotionValue} from "motion";
import {Once} from "@/components/Once.ts";
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

// The only Cartesian bit this wheel needs. PolarSpace has no notion of
// bounds any more (just a center point), so the one consumer that wants
// axis lines spanning the viewBox draws them from its own known constants.
function XAxis(props: React.ComponentProps<"line">) {
    const { centerY } = usePolarSpace();
    return <line x1={VIEW_BOX_START} y1={centerY} x2={VIEW_BOX_START + VIEW_BOX_SIZE} y2={centerY} {...props} />;
}
function YAxis(props: React.ComponentProps<"line">) {
    const { centerX } = usePolarSpace();
    return <line x1={centerX} y1={VIEW_BOX_START} x2={centerX} y2={VIEW_BOX_START + VIEW_BOX_SIZE} {...props} />
}

// Static position (center + radius, angle 0) spun by useRotation's plain
// rotating class — not a shared primitive, since "a circle at an arbitrary
// polar point" doesn't generalize the way PolarSpace.Circle's "circle at
// the center" does. One-off, so it's local to this file.
function RotorTerminal(props: React.ComponentProps<typeof motion.circle>) {
    return <motion.circle
        cx={CIRCLE_CENTER + WHEEL_RADIUS} cy={CIRCLE_CENTER}
        className={rotationCssApi.rotating}
        {...props}
    />;
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

const firstText = "Your product needs a";
const revealedText = "revolution";
const charAngle = 0.064;

export default function RevolutionWheel({angle, angleRangeStart}: { angle: MotionValue<Angle>; angleRangeStart: number; }) {
    const [frontClipPath, backClipPath] = useConicReveal({
        angle: angle,
        startAngle: angleRangeStart,
        centerX: CIRCLE_CENTER,
        centerY: CIRCLE_CENTER,
        radius: VIEW_BOX_SIZE / 2
    });

    const rotorX = useTransform(angle, a => CIRCLE_CENTER + WHEEL_RADIUS * a.cosine);
    const rotorY = useTransform(angle, a => CIRCLE_CENTER + WHEEL_RADIUS * a.sine);

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
                className={rotationCssApi.rotatingClamped}
                style={rotationThresholdStyle("0rad")}
            />
            <path fill="none" stroke="var(--_lighter-stroke)" strokeWidth={STROKE_WIDTH} className={rotationCssApi.rotating} d={pb.toSVGPathString()} />
        </React.Fragment>;
    });

    const tinyRadialBoxes = <>
        <PolarSpace.RadialBox
            radius={WHEEL_RADIUS * 0.6} angle={Math.PI / 60}
            radialSize={WHEEL_RADIUS * 0.2} angularSize={Math.PI / 2.6}
            fill="var(--_dial-fill-color)" stroke="var(--_stroke-color)"
            strokeWidth="0.1"
            className={rotationCssApi.rotatingClamped}
            style={rotationThresholdStyle("0rad")}
        />
    </>;

    const dashedWheel = <g className={rotationCssApi.rotating}>
        <PolarSpace.AngularTicks radius={WHEEL_RADIUS * 0.35} stroke="var(--_stroke-color)" />
        <PolarSpace.AngularTicks radius={WHEEL_RADIUS * 0.35} stroke="var(--_lighter-stroke)" angularSpacing={Math.PI / 2} />
    </g>;

    const quotePart1 = "Design is not just what it looks and feels like";
    const quotePart2 = "Design is how it works";
    const quoteCharAngle = 0.064;

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
                    --_dial-fill-color: oklch(from var(--neutral-900) l c h / 0.375);
                    --_fill-color: oklch(from var(--neutral-900) l c h / 0.375);
                    --_stroke-color: var(--neutral-800);
                    --_lighter-stroke: var(--neutral-400);
                }
    
                g.front-layer {
                    --_dial-fill-color: oklch(from var(--secondary-950) l c h / 0.25);
                    --_fill-color: none;
                    --_stroke-color: var(--secondary-neutral-800);
                    --_lighter-stroke: var(--primary-500);
                }
            `}
        >
            <defs>
                <radialGradient id="brand-radial-gradient">
                    <stop offset="-20%" stopColor="var(--secondary-700)"/>
                    <stop offset="80%" stopColor="var(--secondary-neutral-950)"/>
                </radialGradient>
            </defs>
            <g stroke="var(--secondary-neutral-800)" strokeWidth="0.1" fill="none">
                <motion.line x1={CIRCLE_CENTER} y1={rotorY} x2={rotorX} y2={rotorY} strokeDasharray="2"/>
                <motion.line x1={rotorX} y1={CIRCLE_CENTER} x2={rotorX} y2={rotorY} strokeDasharray="2"/>
                <XAxis />
                <YAxis />
            </g>
            <ClippedG clipPathId="back-clip-path" pathData={backClipPath} className="back-layer">
                {innerCircle}
                {tinyRadialBoxes}
                {radialBoxes}
                {dashedWheel}
                <PolarSpace.Text
                    className={rotationCssApi.rotatingClamped}
                    style={{
                        textTransform: "uppercase",
                        ...rotationThresholdStyle(`${charAngle}rad`, `${Math.PI - charAngle * (firstText.length + 1)}rad`)
                    }}
                    radius={WHEEL_RADIUS - 5}
                    startAngle={`${charAngle * (firstText.length + 1)}rad`} charAngle={`${charAngle}rad`}
                    sweepDirection="ccw"
                    fontSize={2.5}
                    color="var(--neutral-400)"
                >{firstText}</PolarSpace.Text>
                <PolarSpace.Text
                    radius={WHEEL_RADIUS * 0.54}
                    charAngle={quoteCharAngle + "rad"} fontSize={2.5}
                    startAngle={-(Math.PI / 2 + quoteCharAngle * quotePart1.length / 2) + "rad"}
                    color="var(--neutral-600)"
                >{quotePart1}</PolarSpace.Text>
            </ClippedG>
            <ClippedG clipPathId="front-clip-path" pathData={frontClipPath} className="front-layer">
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
                    className={rotationCssApi.rotatingClamped}
                    style={{textTransform: "uppercase", ...rotationThresholdStyle("0rad")}}
                    radius={WHEEL_RADIUS - 5}
                    startAngle={-" ".length * charAngle + "rad"} charAngle={`${charAngle}rad`}
                    sweepDirection="ccw"
                    fontSize={2.5}
                    color="var(--secondary-neutral-200)"
                >{revealedText}</PolarSpace.Text>
                <PolarSpace.Text
                    className={rotationCssApi.rotatingClamped}
                    style={{
                        textTransform: "uppercase",
                        ...rotationThresholdStyle((2 * Math.PI - charAngle * "LET'S KICKSTART YOUR".length) + "rad")
                    }}
                    radius={WHEEL_RADIUS - 5}
                    startAngle={"0rad"} charAngle={`${charAngle}rad`}
                    sweepDirection="ccw"
                    fontSize={2.5}
                    color="var(--secondary-neutral-200)"
                >{"LET'S KICKSTART YOUR"}</PolarSpace.Text>
                <PolarSpace.Text
                    className={rotationCssApi.rotatingClamped}
                    style={rotationThresholdStyle(
                        (3 * Math.PI / 2 - quoteCharAngle * (quotePart1.length / 2 - quotePart2.length - 1)) + "rad"
                    )}
                    radius={WHEEL_RADIUS * 0.54}
                    charAngle={quoteCharAngle + "rad"} fontSize={2.5}
                    startAngle={(3 * Math.PI / 2 - quoteCharAngle * quotePart1.length / 2) + "rad"}
                    color="var(--secondary-neutral-600)"
                >{quotePart2}</PolarSpace.Text>
            </ClippedG>
            <g stroke="var(--primary-700)" strokeWidth="0.25" fill="none">
                <PolarSpace.Spoke radius={VIEW_BOX_SIZE / 2} className={rotationCssApi.rotating} strokeDasharray="2"/>
                <PolarSpace.Spoke
                    radius={WHEEL_RADIUS}
                    className={rotationCssApi.rotating}
                    style={{
                        filter:
                            "drop-shadow(0.3px 0.5px 0.7px oklch(from var(--primary-700) l c h / 0.32)) " +
                            "drop-shadow(0.4px 0.8px 1px oklch(from var(--primary-700) l c h / 0.32)) " +
                            "drop-shadow(1px 2px 2.5px oklch(from var(--primary-700) l c h / 0.32))"
                    }}
                />
            </g>
            <PolarSpace.Circle
                fill="var(--neutral-950)" stroke="var(--neutral-900)" strokeWidth="0.1"
                r={WHEEL_RADIUS * 0.32}
                // style={{
                // 	filter:
                // 		"drop-shadow(0.3px 0.5px 0.7px oklch(from var(--secondary-neutral-900) l c h / 0.16)) " +
                // 		"drop-shadow(0.4px 0.8px 1px oklch(from var(--secondary-neutral-900) l c h / 0.16)) " +
                // 		"drop-shadow(1px 2px 2.5px oklch(from var(--secondary-neutral-900) l c h / 0.16))"
                // }}
            />
            <PolarSpace.Circle
                fill="none" stroke="var(--neutral-900)" strokeWidth="0.1"
                r={WHEEL_RADIUS * 0.24}
            />
            <g css={css`
                --_radius: calc(0.2 * ${WHEEL_RADIUS}px);
                --_gap: calc(0.2 * var(--_radius));
                --_circumference: calc(2 * pi * var(--_radius));

                .progress-indicator {
                    --_angle: clamp(0deg, var(${rotationCssVars.angle}) - var(--i) * 90deg, 90deg);
                    --_switch: round(down, var(--_angle) / (90deg), 1);
                    @supports not ${supportsQuery.unitStripping} {
                        --_switch: round(down, tan(atan2(var(--_angle), 90deg)), 1);
                    }

                    r: var(--_radius);
                    stroke-dasharray: 0, calc(var(--i) * 0.5 * pi * var(--_radius) + var(--_gap)),
                    calc(0.5 * pi * var(--_radius) - 2 * var(--_gap)), var(--_circumference);
                    stroke: color-mix(in oklch, var(--neutral-900) calc((1 - var(--_switch)) * 100%), var(--primary-700) calc(var(--_switch) * 100%));

                    transition: stroke 0.2s ease-in-out;
                }
            `}>
                {Array.from({length: 4}, (_, i) => <PolarSpace.Circle
                    key={i} className="progress-indicator"
                    style={{'--i': i} as React.CSSProperties}
                    fill="none" stroke="var(--neutral-900)" strokeWidth="0.5"
                    strokeLinecap="butt"
                />)}
            </g>
            <PolarSpace.Circle
                css={css`
                    --_radius: calc(0.24 * ${WHEEL_RADIUS}px);
                    --_circumference: calc(2 * pi * var(--_radius));

                    r: var(--_radius);
                    stroke-dasharray: 0, var(--_circumference), var(--_circumference), 0;
                    stroke-dashoffset: calc(-4 * var(--_radius) * var(${rotationCssVars.angle}) / (1rad));
                    @supports not ${supportsQuery.unitStripping} {
                        stroke-dashoffset: calc(-4 * var(--_radius) * tan(atan2(var(${rotationCssVars.angle}), 1rad)));
                    }

                    transition: 0.2s ease-in-out;
                    transition-property: opacity, filter;
                `}
                fill="none" stroke="var(--primary-700)" strokeWidth="0.08"
            />
            <RotorTerminal r={1} fill="var(--primary-600)"/>
            <RotorTerminal r={0.5} fill="var(--primary-400)"/>
            <CenterIcon angle={angle} fill="var(--neutral-900)"/>
        </svg>
    </PolarSpace>;
}