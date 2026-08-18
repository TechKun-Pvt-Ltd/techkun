import TrigWheel, {TrigAngleTransformer, useTrigWheel} from "../TrigWheel";
import cssSupportsQuery from "@/app/utils/css-supports-query";
import {css} from "@emotion/react";
import React, {JSX} from "react";
import {Angle, PathBuilder, Point2D, Vector2D} from "svg-path-kit";
import {useConicReveal} from "@/hooks/use-conic-reveal";
import {MotionValue} from "motion";
import {Once} from "@/components/Once";
import { motion } from "motion/react";
import {round} from "svg-path-kit/numbers";
import cssSupports from "@/app/utils/css-supports";

const VIEW_BOX_START = 0;
const VIEW_BOX_SIZE = 100;
const TRIG_CIRCLE_RADIUS = 0.435 * VIEW_BOX_SIZE;
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

const MINUS_ONE_AND_ONE = [-1, 1] as const;

function IconRing({ radius, size = 4, renderers }: {
    radius: number;
    size: number;
    renderers: ((position: Point2D, size: number) => JSX.Element)[];
}) {
    const { center } = useTrigWheel();
    const HALF_PI = 0.5 * Math.PI;
    const RELATIVE_POSITION = Math.PI / 6 - Math.PI / 60;
    return renderers.map((render, i) => {
        const angle = Math.floor(i * 0.5) * HALF_PI + MINUS_ONE_AND_ONE[i % 2] * RELATIVE_POSITION;
        const position = center.add(Vector2D.polar(radius, angle));
        return <React.Fragment key={i}>
            {/*<circle cx={icon.position.x} cy={icon.position.y} r="4" />*/}
            {render(Point2D.of(round(position.x, 4), round(position.y, 4)), size)}
        </React.Fragment>
    });
}

function TextRing({radius, texts, charAngle, fontSize = 3}: {
    radius: number;
    texts: string[];
    charAngle: number;
    fontSize: number;
}) {
    return texts.map((text, i) => {
        const sweepDirection = MINUS_ONE_AND_ONE[Math.floor(i / 2) % 2];
        return <TrigWheel.Text
            key={text}
            startAngle={`${Math.PI / 4 + i * Math.PI / 2 + -sweepDirection * charAngle * text.length / 2}rad`}
            sweepDirection={sweepDirection}
            charAngle={charAngle + "rad"}
            radius={radius}
            fontSize={fontSize}
        >{text}</TrigWheel.Text>;
    });
}

const shapes: string[] = [];
// {
//     const headSize = 1.25;
//     const armLength = 2;
//     const armHeight = 1.25;
//
//     const gutter = 0.5;
//     const pb = PathBuilder.m(centerPoint.add(Vector2D.of(0, -gutter * 0.75)));
//     let skewAngle = Math.PI / 4;
//     pb.l(Vector2D.polar(headSize, Math.PI + skewAngle));
//     pb.l(Vector2D.polar(headSize, -skewAngle));
//     pb.l(Vector2D.polar(headSize, skewAngle));
//     pb.z();
//
//     skewAngle = Math.PI / 5;
//     pb.m(centerPoint.add(Vector2D.of(-gutter / 2, 0)));
//     pb.l(Vector2D.polar(armLength, Math.PI + skewAngle));
//     pb.l(Vector2D.of(0, armHeight));
//     pb.l(Vector2D.polar(armLength, skewAngle));
//     pb.z();
//
//     pb.m(centerPoint.add(Vector2D.of(gutter / 2, 0)));
//     pb.l(Vector2D.polar(armLength, -skewAngle));
//     pb.l(Vector2D.of(0, armHeight));
//     pb.l(Vector2D.polar(armLength, Math.PI - skewAngle));
//     pb.z();
//
//     shapes.push(pb.toSVGPathString());
// }
{
    const headSize = 1.25;
    const leftArmLength = 2;
    const rightArmLength = 2.5;
    const armHeight = 1.25;

    const gutter = 0.5;
    const pb2 = PathBuilder.m(centerPoint.add(Vector2D.of(0, -gutter * 0.75)));
    let skewAngle = Math.PI / 5;
    pb2.l(Vector2D.polar(headSize, Math.PI + skewAngle));
    pb2.l(Vector2D.polar(headSize, -skewAngle));
    pb2.l(Vector2D.polar(headSize, skewAngle));
    pb2.z();

    pb2.m(centerPoint.add(Vector2D.of(-gutter / 2, 0)));
    pb2.l(Vector2D.polar(leftArmLength, Math.PI + skewAngle));
    pb2.l(Vector2D.of(0, armHeight));
    pb2.l(Vector2D.polar(leftArmLength, skewAngle));
    pb2.z();

    pb2.m(centerPoint.add(Vector2D.of(gutter / 2, 0)));
    pb2.l(Vector2D.polar(rightArmLength, -skewAngle));
    pb2.l(Vector2D.of(0, armHeight));
    pb2.l(Vector2D.polar(rightArmLength, Math.PI - skewAngle));
    pb2.z();

    shapes.push(pb2.toSVGPathString());
}
// {
//     const lineGap = 0.5;
//     const lineHeight = 0.75;
//     const lineLength = 2;
//
//     const penLength = 2.125;
//     const penThickness = 0.75;
//     const penAngle = Angle.of(Math.PI / 2.5);
//
//     const pb3 = PathBuilder.m(centerPoint.add(Vector2D.of(lineLength / 4, -lineGap / 2)));
//     pb3.l(Vector2D.of(-lineLength, 0));
//     pb3.l(Vector2D.of(0, -lineHeight));
//     pb3.l(Vector2D.of(lineLength, 0));
//     pb3.z();
//
//     pb3.m(centerPoint.add(Vector2D.of(lineLength / 4, lineGap / 2)));
//     pb3.l(Vector2D.of(-lineLength, 0));
//     pb3.l(Vector2D.of(0, lineHeight));
//     pb3.l(Vector2D.of(lineLength, 0));
//     pb3.z();
//
//     pb3.m(centerPoint.add(Vector2D.of(lineLength / 4 + 0.25, lineGap / 2 + lineHeight)));
//     pb3.l(Vector2D.polar(penLength, penAngle.negated()));
//     pb3.l(Vector2D.polar(penThickness, penAngle.negated().halfTurnForward()));
//     pb3.l(Vector2D.polar(penLength - 0.75, penAngle.negated()).opposite());
//     pb3.z();
//
//     shapes.push(pb3.toSVGPathString());
// }
{
    const headLength = 1.25;
    const headHeight = 1.25;
    const leftArmLength = 2;
    const rightArmLength = 2;
    const armHeight = 1.25;

    const gutter = 0.5;
    const pb4 = PathBuilder.m(centerPoint.add(Vector2D.of(0, -gutter * 0.75)));
    let skewAngle = Math.PI / 4;
    pb4.l(Vector2D.polar(headLength, Math.PI + skewAngle));
    pb4.l(Vector2D.polar(headHeight, -skewAngle));
    pb4.l(Vector2D.polar(headLength, skewAngle));
    pb4.z();

    skewAngle = Math.PI / 6;
    pb4.m(centerPoint.add(Vector2D.of(-gutter / 2, 0)));
    pb4.l(Vector2D.polar(leftArmLength, Math.PI + skewAngle));
    pb4.l(Vector2D.of(0, armHeight));
    pb4.l(Vector2D.polar(leftArmLength, skewAngle));
    pb4.z();

    pb4.m(centerPoint.add(Vector2D.of(gutter / 2, 0)));
    pb4.l(Vector2D.polar(rightArmLength, -skewAngle));
    pb4.l(Vector2D.of(0, armHeight));
    pb4.l(Vector2D.polar(rightArmLength, Math.PI - skewAngle));
    pb4.z();

    shapes.push(pb4.toSVGPathString());
}
// {
//     const radialDistance = 0.5;
//     const gutter = 0.25;
//     const pb2 = PathBuilder.m(centerPoint.add(Vector2D.of(0, -gutter)).add(Vector2D.polar(radialDistance, -Math.PI / 6)));
//     const baseLength = pb2.l(centerPoint.add(Vector2D.of(0, -gutter)).add(Vector2D.polar(radialDistance, Math.PI + Math.PI / 6))).length;
//     const slantLine = pb2.l(Vector2D.polar(1.75, Math.PI + Math.PI / 6)).vector;
//     pb2.l(Vector2D.of(baseLength - 2 * slantLine.x, 0));
//     pb2.z();
//
//     pb2.m(centerPoint.add(Vector2D.polar(gutter, Math.PI - Math.PI / 6)).add(Vector2D.of(0, radialDistance)));
//     pb2.l(Vector2D.polar(baseLength, Math.PI + Math.PI / 3));
//     pb2.l(Vector2D.polar(1.75, Math.PI + Math.PI / 6));
//     pb2.l(Vector2D.polar(baseLength - 2 * slantLine.x, Math.PI / 3));
//     pb2.z();
//
//     pb2.m(centerPoint.add(Vector2D.polar(gutter, Math.PI / 6)).add(Vector2D.of(0, radialDistance)));
//     pb2.l(Vector2D.polar(baseLength, -Math.PI / 3));
//     pb2.l(Vector2D.polar(1.75, -Math.PI / 6));
//     pb2.l(Vector2D.polar(baseLength - 2 * slantLine.x, Math.PI - Math.PI / 3));
//     pb2.z();
//
//     shapes.push(pb2.toSVGPathString());
// }

function CenterIcon(props: React.ComponentProps<typeof motion.path>) {
    return <motion.path
        d={shapes[0]}
        css={css`
            transition: d 0.3s ease;
            pointer-events: bounding-box;
            &:hover {
                d: path("${shapes[1]}");
            }
        `}
        whileHover={cssSupports.d ? null : {d: shapes[1]} as any}
        {...props}
    />;
}

const firstText = "Your product needs a";
const revealedText = "revolution";
const charAngle = 0.064;

export default function RevolutionWheel({angle, angleRangeStart}: { angle: MotionValue<Angle>, angleRangeStart: number }) {
    const [frontClipPath, backClipPath] = useConicReveal({
        angle: angle,
        startAngle: angleRangeStart,
        centerX: CIRCLE_CENTER,
        centerY: CIRCLE_CENTER,
        radius: VIEW_BOX_SIZE / 2
    });

    const innerCircleRadius = TRIG_CIRCLE_RADIUS * 0.48;
    const innerCircle = <TrigWheel.Circle
        r={innerCircleRadius}
        fill="var(--_dial-fill-color)" stroke="var(--_stroke-color)"
        strokeWidth="0.1"
        strokeDasharray={`0 1 ${Math.PI * innerCircleRadius / 2 - 2} 2 ${Math.PI * innerCircleRadius / 2 - 2} 1`}
    />;

    const radialBoxesDefs = [
        {
            radius: TRIG_CIRCLE_RADIUS * 0.6,
            angle: Math.PI + Math.PI / 3 + Math.PI / 30,
            radialSize: TRIG_CIRCLE_RADIUS * 0.4,
            angularSize: Math.PI / 4
        },
        {
            radius: TRIG_CIRCLE_RADIUS * 0.6,
            angle: Math.PI,
            radialSize: TRIG_CIRCLE_RADIUS * 0.4,
            angularSize: Math.PI / 3
        }
    ];
    const radialBoxes = radialBoxesDefs.map(box => {
        const STROKE_WIDTH = 0.1;
        const pb = PathBuilder.m(centerPoint.add(Vector2D.polar(box.radius + box.radialSize, box.angle)));
        pb.circularArc(box.radius + box.radialSize, box.angle, box.angle + box.angularSize);
        return <React.Fragment key={`${box.radius}-${box.angle}-${box.radialSize}-${box.angularSize}`}>
            <TrigWheel.RadialBox
                {...box}
                rotationStartThreshold="0rad"
                fill="var(--_fill-color)" stroke="var(--_stroke-color)"
                strokeWidth={STROKE_WIDTH}
            />
            <path fill="none" stroke="var(--_lighter-stroke)" strokeWidth={STROKE_WIDTH} className="trig-wheel-rotate" d={pb.toSVGPathString()} />
        </React.Fragment>;
    });

    const tinyRadialBoxes = <>
        <TrigWheel.RadialBox
            radius={TRIG_CIRCLE_RADIUS * 0.6} angle={Math.PI / 60}
            radialSize={TRIG_CIRCLE_RADIUS * 0.2} angularSize={Math.PI / 2.6}
            rotationStartThreshold="0rad"
            fill="var(--_dial-fill-color)" stroke="var(--_stroke-color)"
            strokeWidth="0.1"
        />
    </>;

    const dashedWheel = <>
        <TrigWheel.DashedWheel radius={TRIG_CIRCLE_RADIUS * 0.4} stroke="var(--_stroke-color)" />
        <TrigWheel.DashedWheel radius={TRIG_CIRCLE_RADIUS * 0.4} stroke="var(--_lighter-stroke)" markersPerQuarter={1} />
    </>;

    const quotePart1 = "Design is not just what it looks and feels like";
    const quotePart2 = "Design is how it works";
    const quoteCharAngle = 0.064;

    return <svg
        viewBox={`${VIEW_BOX_START} ${VIEW_BOX_START} ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`}
        strokeLinejoin="round" strokeLinecap="round"
        css={css`
            height: 100%;
            width: 100%;
            will-change: transform;

            g.back-layer {
                --_dial-fill-color: oklch(from var(--neutral-900) l c h / 0.375);
                --_fill-color: oklch(from var(--neutral-900) l c h / 0.375);
                --_stroke-color: oklch(from var(--neutral-700) l c h / 0.75);
                --_lighter-stroke: var(--neutral-400);
            }

            g.front-layer {
                --_dial-fill-color: oklch(from var(--secondary-neutral-900) l c h / 0.25);
                --_fill-color: none;
                --_stroke-color: oklch(from var(--secondary-neutral-700) l c h / 0.75);
                --_lighter-stroke: var(--primary-400);
            }
        `}
    >
        <TrigWheel
            angle={angle}
            startX={VIEW_BOX_START} startY={VIEW_BOX_START}
            size={VIEW_BOX_SIZE} radius={TRIG_CIRCLE_RADIUS}
        >
            <defs>
                <radialGradient id="brand-radial-gradient">
                    <stop offset="-20%" stopColor="var(--secondary-800)"/>
                    <stop offset="80%" stopColor="var(--secondary-neutral-950)"/>
                </radialGradient>
            </defs>
            <g stroke="var(--secondary-neutral-800)" strokeWidth="0.25" fill="none">
                <TrigWheel.XAxis/>
                <TrigWheel.YAxis/>
                <TrigWheel.RotorXProjection/>
                <TrigWheel.RotorYProjection/>
            </g>
            <ClippedG clipPathId="back-clip-path" pathData={backClipPath} className="back-layer">
                {innerCircle}
                {tinyRadialBoxes}
                {radialBoxes}
                {dashedWheel}
                <TrigWheel.Text
                    style={{textTransform: "uppercase"}}
                    radius={TRIG_CIRCLE_RADIUS - 5}
                    startAngle={`${charAngle * (firstText.length + 1)}rad`} charAngle={`${charAngle}rad`}
                    rotationStartThreshold={`${charAngle}rad`}
                    rotationEndThreshold={`${Math.PI - charAngle * (firstText.length + 1)}rad`}
                    sweepDirection="ccw"
                    fontSize={2.5}
                    color="var(--neutral-400)"
                >{firstText}</TrigWheel.Text>
                <TrigWheel.Text
                    radius={TRIG_CIRCLE_RADIUS * 0.54}
                    charAngle={quoteCharAngle + "rad"} fontSize={2.5}
                    startAngle={-(Math.PI / 2 + quoteCharAngle * quotePart1.length / 2) + "rad"}
                    color="var(--neutral-600)"
                >{quotePart1}</TrigWheel.Text>
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
                <TrigWheel.Text
                    style={{textTransform: "uppercase"}}
                    radius={TRIG_CIRCLE_RADIUS - 5}
                    startAngle={-" ".length * charAngle + "rad"} charAngle={`${charAngle}rad`}
                    sweepDirection="ccw"
                    rotationStartThreshold={"0rad"}
                    fontSize={2.5}
                    color="var(--secondary-neutral-200)"
                >{revealedText}</TrigWheel.Text>
                <TrigWheel.Text
                    style={{textTransform: "uppercase"}}
                    radius={TRIG_CIRCLE_RADIUS - 5}
                    startAngle={"0rad"} charAngle={`${charAngle}rad`}
                    sweepDirection="ccw"
                    rotationStartThreshold={(2 * Math.PI - charAngle * "LET'S KICKSTART YOUR".length) + "rad"}
                    fontSize={2.5}
                    color="var(--secondary-neutral-200)"
                >{"LET'S KICKSTART YOUR"}</TrigWheel.Text>
                <TrigWheel.Text
                    radius={TRIG_CIRCLE_RADIUS * 0.54}
                    charAngle={quoteCharAngle + "rad"} fontSize={2.5}
                    startAngle={(3 * Math.PI / 2 - quoteCharAngle * quotePart1.length / 2) + "rad"}
                    rotationStartThreshold={(3 * Math.PI / 2 - quoteCharAngle * (quotePart1.length / 2 - quotePart2.length - 1)) + "rad"}
                    color="var(--secondary-neutral-600)"
                >{quotePart2}</TrigWheel.Text>
            </ClippedG>
            <g stroke="var(--primary-900)" strokeWidth="0.25" fill="none">
                <TrigWheel.ExtendedRotor strokeDasharray="2"/>
                <TrigWheel.Rotor style={{
                    filter:
                        "drop-shadow(0.3px 0.5px 0.7px oklch(from var(--primary-900) l c h / 0.32)) " +
                        "drop-shadow(0.4px 0.8px 1px oklch(from var(--primary-900) l c h / 0.32)) " +
                        "drop-shadow(1px 2px 2.5px oklch(from var(--primary-900) l c h / 0.32))"
                }}/>
            </g>
            <TrigWheel.Circle
                fill="var(--neutral-950)" stroke="var(--neutral-900)" strokeWidth="0.1"
                r={TRIG_CIRCLE_RADIUS * 0.32}
                // style={{
                // 	filter:
                // 		"drop-shadow(0.3px 0.5px 0.7px oklch(from var(--secondary-neutral-900) l c h / 0.16)) " +
                // 		"drop-shadow(0.4px 0.8px 1px oklch(from var(--secondary-neutral-900) l c h / 0.16)) " +
                // 		"drop-shadow(1px 2px 2.5px oklch(from var(--secondary-neutral-900) l c h / 0.16))"
                // }}
            />
            <TrigWheel.Circle
                fill="none" stroke="var(--neutral-900)" strokeWidth="0.1"
                r={TRIG_CIRCLE_RADIUS * 0.24}
            />
            <g css={css`
                --_radius: calc(0.2 * var(${TrigWheel.cssProps.radius}));
                --_gap: calc(0.2 * var(--_radius));
                --_circumference: calc(2 * pi * var(--_radius));

                .progress-indicator {
                    --_angle: clamp(0deg, var(${TrigWheel.cssProps.angle}) - var(--i) * 90deg, 90deg);
                    --_switch: round(down, var(--_angle) / (90deg), 1);
                    @supports not ${cssSupportsQuery.unitStripping} {
                        --_switch: round(down, tan(atan2(var(--_angle), 90deg)), 1);
                    }

                    r: var(--_radius);
                    stroke-dasharray: 0, calc(var(--i) * 0.5 * pi * var(--_radius) + var(--_gap)),
                    calc(0.5 * pi * var(--_radius) - 2 * var(--_gap)), var(--_circumference);
                    stroke: color-mix(in oklch, var(--neutral-900) calc((1 - var(--_switch)) * 100%), var(--primary-800) calc(var(--_switch) * 100%));

                    transition: stroke 0.2s ease-in-out;
                }
            `}>
                {Array.from({length: 4}, (_, i) => <TrigWheel.Circle
                    key={i} className="progress-indicator"
                    style={{'--i': i} as React.CSSProperties}
                    fill="none" stroke="var(--neutral-900)" strokeWidth="0.5"
                    strokeLinecap="butt"
                />)}
            </g>
            <TrigWheel.Circle
                css={css`
                    --_radius: calc(0.24 * var(${TrigWheel.cssProps.radius}));
                    --_circumference: calc(2 * pi * var(--_radius));

                    r: var(--_radius);
                    stroke-dasharray: 0, var(--_circumference), var(--_circumference), 0;
                    stroke-dashoffset: calc(-4 * var(--_radius) * var(${TrigWheel.cssProps.angle}) / (1rad));
                    @supports not ${cssSupportsQuery.unitStripping} {
                        stroke-dashoffset: calc(-4 * var(--_radius) * tan(atan2(var(${TrigWheel.cssProps.angle}), 1rad)));
                    }

                    transition: 0.2s ease-in-out;
                    transition-property: opacity, filter;
                `}
                fill="none" stroke="var(--primary-900)" strokeWidth="0.1"
            />
            <TrigWheel.RotorTerminal fill="var(--primary-700)"/>
            <TrigWheel.RotorTerminal fill="var(--primary-400)" r="0.5"/>
            <CenterIcon fill="var(--neutral-900)"/>
        </TrigWheel>
    </svg>;
}