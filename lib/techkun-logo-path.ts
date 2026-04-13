import {Angle, fitCubicBezier, fitSplineAtParams, PathBuilder, Point2D, Vector2D} from "svg-path-kit";
import {Superellipse} from "svg-path-kit/curves";
import {
    createFrameSampler,
    easeInOut,
    Timeline,
    type Interpolator,
    type TimelineInspector, TimelineProgress, getInterpolator, getTimelineInspector
} from "times-fps";
import { FrameExporter } from "times-fps/exporter";

interface PathProps {
    thickness: number;
    innerSpacing: number;
    filletSize: number;
    bottomDropLength: number;

    upperArmLength: number;
    lowerArmLength: number;
    interArmGap: number;
    loopWidth: number;

    orbEntryAngle: number;
}

const props: PathProps = {
    thickness: 80,
    innerSpacing: 100,
    filletSize: 25,

    upperArmLength: 315,
    lowerArmLength: 180,
    interArmGap: 85,
    bottomDropLength: 220,
    loopWidth: 235,

    orbEntryAngle: -Math.PI / 4
};

function ifNaN(num: number, fallback: number) {
    return num === num ? num : fallback;
}

const tl = Timeline.ofPhases(
    ['lowerArmEmerges', 10],
    ['bottomDropAppears', 10],
    ['bottomDropElongates', 10],
    ['rightCurveAppears', 10],
    ['leftCurveAppears', 10],
    ['shaftEmerging', 20],
    ['loopElbowAppears', 15],
    ['loopTopWidthAppears', 10],
    ['loopTopCurveAppears', 10],
    ['loopBottomCurveAppears', 10],
    ['loopBottomWidthAppears', 10],
    ['loopCloses', 10],
    ['upperArmAppears', 10],
    ['upperArmElongates', 10],
    ['orbAppears', 10]
);
const p = tl.phases;

const orbBaseAngleRatio = 4 * Math.atan(18 / 35) / Math.PI;

function path(progress: TimelineProgress) {
    const ti = getTimelineInspector(progress);
    const map = getInterpolator(progress);
    const {
        thickness, innerSpacing, filletSize,
        interArmGap, loopWidth
    } = props;
    // console.log(loopWidth + innerSpacing / 2 + 2 * thickness + props.upperArmLength + 35 + 140);
    // console.log(interArmGap + 3 * innerSpacing / 2 + 4 * thickness + props.bottomDropLength);

    const origin: Point2D = Point2D.of(
        loopWidth + 3 * innerSpacing / 2 + 3 * thickness + props.lowerArmLength,
        interArmGap + innerSpacing + 3 * thickness
    );
    const pb = PathBuilder.m(origin);

    const lowerArmLength = map(p.lowerArmEmerges).to(filletSize, props.lowerArmLength);
    const linecapInnerAngle = Angle.of(map(p.bottomDropAppears).to(0, +Angle.HALF_PI));
    const startingCurveYDistance = map(p.bottomDropAppears).to(0, filletSize);
    pb.l(Vector2D.of(-(lowerArmLength - filletSize), 0));
    pb.chordScaledBezier(Vector2D.of(
            -map(p.lowerArmEmerges).to(0, filletSize + thickness / 2 * (1 - linecapInnerAngle.sine)),
            startingCurveYDistance
        ), Math.PI, -linecapInnerAngle,
        map(p.bottomDropAppears).to(0, Math.SQRT1_2)
    );

    const bottomDropLength = map(p.bottomDropElongates).to(filletSize, props.bottomDropLength);
    pb.l(Vector2D.of(0, bottomDropLength - filletSize));

    const bottomRightCurveAngle = Angle.of(map(p.rightCurveAppears).to(0, +Angle.HALF_PI));
    const bottomLeftCurveAngle = Angle.of(map(p.leftCurveAppears).to(0, +Angle.HALF_PI));
    pb.bezierCircularArc(thickness + innerSpacing / 2, 0, bottomRightCurveAngle);
    pb.bezierCircularArc(thickness + innerSpacing / 2, 0, bottomLeftCurveAngle, Angle.HALF_PI);

    const shaftLength = map(p.shaftEmerging).to(0, bottomDropLength + thickness + interArmGap - filletSize);
    pb.l(Vector2D.of(0, -shaftLength));

    formLoop(ti, map, pb, {linecapInnerAngle, bottomLeftCurveAngle, bottomRightCurveAngle});
    formUpperArm(ti, map, pb);

    pb.l(Vector2D.of(0, shaftLength));

    pb.bezierCircularArc(innerSpacing / 2, bottomLeftCurveAngle, 0, Angle.HALF_PI);
    pb.bezierCircularArc(innerSpacing / 2, bottomRightCurveAngle, 0);

    pb.l(Vector2D.of(0, -(bottomDropLength - filletSize + startingCurveYDistance + thickness / 2 * (1 - linecapInnerAngle.cosine))));
    pb.bezierCircularArc(thickness / 2, 0, Angle.HALF_PI, Math.PI);
    pb.l(origin.add(Vector2D.of(0, -thickness)));
    pb.bezierCircularArc(thickness / 2, 0, Angle.HALF_PI, Angle.HALF_PI.negated());
    pb.bezierCircularArc(thickness / 2, 0, Angle.HALF_PI);
    pb.z();

    return pb.toPath().toSVGPath().toString();
}

function formUpperArm(
    ti: TimelineInspector,
    map: Interpolator,
    pb: PathBuilder
) {
    const { thickness, filletSize } = props;
    const filletXDistance = map(p.upperArmAppears).to(0, filletSize);
    const filletChordScale = map(p.upperArmAppears).to(0, Math.SQRT1_2);
    const upperArmLength = map(p.upperArmElongates).to(filletSize, props.upperArmLength);
    const orbEntryAngle = Angle.of(map
        .sequence(tl.sequence.subsequence("upperArmAppears"))
        .to(+Angle.HALF_PI, 0, 0, props.orbEntryAngle)
    );
    const cornerAngle = ti(p.upperArmAppears).hasFinished() ?
        Angle.PI : orbEntryAngle.flipForward();
    const cornerYDistance = ti(p.upperArmElongates).hasFinished() ?
        filletSize : filletSize + thickness / 2 * (1 - orbEntryAngle.cosine);

    pb.chordScaledBezier(Vector2D.of(
        filletXDistance,
        map(p.shaftEmerging).to(0, cornerYDistance)
    ), Angle.HALF_PI, cornerAngle, filletChordScale);
    pb.l(Vector2D.of(upperArmLength - filletSize, 0));

    formOrb(ti, map, pb, {orbEntryAngle});

    pb.l(Vector2D.of(-(upperArmLength - filletSize), 0));
    pb.chordScaledBezier(Vector2D.of(
        -filletXDistance,
        map(p.shaftEmerging).to(0, cornerYDistance)
    ), cornerAngle.negated(), Angle.HALF_PI.negated(), filletChordScale);
}

function formOrb(
    ti: TimelineInspector,
    map: Interpolator,
    pb: PathBuilder,
    animationProps: { orbEntryAngle: Angle }
) {
    const { thickness } = props;
    const { orbEntryAngle } = animationProps;
    const orbRestBase = map(p.upperArmElongates).to(0, thickness * 7 / 16);
    const arcDivisions = 4;
    const rotation = (Math.PI - +orbEntryAngle * 2) / arcDivisions;

    const orbRestHeight = orbRestBase * Math.tan(+orbEntryAngle * orbBaseAngleRatio);
    const endcapCircleRadius = ti(p.upperArmAppears).hasFinished() ?
        (thickness / 2 - orbRestHeight) / orbEntryAngle.cosine : thickness / 2;

    pb.chordScaledBezier(
        Vector2D.of(orbRestBase, orbRestHeight), 0, orbEntryAngle.flipForward(), 1 / 2.25
    );
    for (let i = 0; i < arcDivisions; i++) {
        pb.bezierCircularArc(
            endcapCircleRadius,
            orbEntryAngle, +orbEntryAngle + rotation,
            -Angle.HALF_PI + i * rotation
        );
    }
    pb.chordScaledBezier(
        Vector2D.of(-orbRestBase, orbRestHeight), pb.lastCommand.getEndVelocity().angle, 0, 1 / 2.25
    );
}

function formLoop(
    ti: TimelineInspector,
    map: Interpolator,
    pb: PathBuilder,
    animationProps: { linecapInnerAngle: Angle; bottomLeftCurveAngle: Angle; bottomRightCurveAngle: Angle }
) {
    const { loopWidth, thickness, filletSize, innerSpacing } = props;
    const {linecapInnerAngle, bottomLeftCurveAngle, bottomRightCurveAngle } = animationProps;

    const loopTopWidth = map(p.loopTopWidthAppears).to(50, loopWidth);
    const loopTopCurveAngle = Angle.of(map(p.loopTopCurveAppears).to(0, +Angle.HALF_PI));
    const loopBottomCurveAngle = Angle.of(map(p.loopBottomCurveAppears).to(0, +Angle.HALF_PI));
    const loopLinecapAngle = map(p.loopCloses).to(+Angle.HALF_PI, 0);
    const filletChordScale = map(p.loopCloses).to(0, Math.SQRT1_2);

    const linecapAngleVector = Vector2D.polar(thickness / 2, loopLinecapAngle);
    const loopBottomWidth = map(p.loopBottomWidthAppears).to(0, loopWidth - Math.max(filletSize, linecapAngleVector.y));
    const cornerCurveClamped = Math.max(0, filletSize - linecapAngleVector.y);

    pb.chordScaledBezier(
        Vector2D.of(
            -cornerCurveClamped,
            -map(p.shaftEmerging).to(0, filletSize + thickness / 2 - linecapAngleVector.x)
        ),
        Angle.HALF_PI.negated(), -loopLinecapAngle, filletChordScale
    );
    pb.l(Vector2D.of(0, -2 * linecapAngleVector.x));
    pb.chordScaledBezier(
        Vector2D.of(
            cornerCurveClamped,
            -map(p.shaftEmerging).to(0, filletSize + thickness / 2 - linecapAngleVector.x)
        ),
        loopLinecapAngle, Angle.HALF_PI, filletChordScale
    );

    const innerElbowStart = pb.currentPosition;

    const superellipseInner = new Superellipse(50, innerSpacing - filletSize, 1.5);
    let segmentEnd = map(p.loopElbowAppears).to(0, -Angle.HALF_PI);
    const loopElbowInner = fitSplineAtParams(pb, superellipseInner, 0, segmentEnd)[0]!;

    const innerAngleEndAngle = ifNaN(
        Math.atan(loopElbowInner.getEndVelocity().slope), +Angle.HALF_PI
    );

    const loopElbowAppearing = ti(p.loopElbowAppears).isActive();
    const elbowInnerStartToOuterEnd = Vector2D.of(thickness, 0);

    const superellipseOuter = new Superellipse(thickness + 50, thickness + (innerSpacing - filletSize), 1.5);
    const loopElbowOuter = fitCubicBezier(superellipseOuter, 0, segmentEnd);

    const outerElbowEnd = innerElbowStart.add(elbowInnerStartToOuterEnd);

    pb.l(Vector2D.of(-(loopTopWidth - 50), 0));
    pb.bezierCircularArc(innerSpacing / 2, 0, loopTopCurveAngle.negated(), Angle.HALF_PI.negated());
    pb.bezierCircularArc(innerSpacing / 2, 0, loopBottomCurveAngle.negated(), -Math.PI);
    pb.l(Vector2D.of(loopBottomWidth, 0));

    const lineCapRotation = loopBottomCurveAngle.complement()
        .add(loopTopCurveAngle.complement())
        .add(innerAngleEndAngle)
        .subtract(bottomLeftCurveAngle.complement())
        .subtract(bottomRightCurveAngle.complement());

    if (loopElbowAppearing) {
        const outerElbowStart = outerElbowEnd.add(Vector2D.from(loopElbowOuter.startingPoint, loopElbowOuter.endingPoint));
        let innerLinecapAngleUnrotation = Angle.of(innerAngleEndAngle).halfTurnBackward().negated();
        const innerElbowEndToOuterStartUnrotated = Vector2D.from(loopElbowInner.terminalPoint, outerElbowStart)
            .rotate(innerLinecapAngleUnrotation);

        const outerElbowSecondHandleVec = Vector2D.from(loopElbowOuter.endingPoint, loopElbowOuter.secondControlPoint)
            .rotate(innerLinecapAngleUnrotation);
        const outerLinecapAngle = Angle.of(outerElbowSecondHandleVec.angle)
            .halfTurnBackward();
        // vector from (cosine, sine) to (-1, 0) scaled by thickness / 2
        const outerElbowStartToCircleEnd = Vector2D.of(
            thickness / 2 * -outerLinecapAngle.cosine,
            thickness / 2 * -(1 + outerLinecapAngle.sine)
        );
        const innerLinecapEllipse = innerElbowEndToOuterStartUnrotated.add(outerElbowStartToCircleEnd);

        pb.bezierEllipticalArc(
            innerLinecapEllipse.x, innerLinecapEllipse.y,
            0, ti(p.bottomDropAppears).hasFinished() ?
                loopLinecapAngle : linecapInnerAngle,
            Angle.HALF_PI.negated()
                .add(linecapInnerAngle.complement())
                .add(lineCapRotation)
        );
        pb.l(Vector2D.of(0, 2 * linecapAngleVector.x));
        pb.bezierCircularArc(thickness / 2,
            -loopLinecapAngle, outerLinecapAngle,
            Angle.HALF_PI.add(lineCapRotation)
        );
    } else {
        pb.bezierCircularArc(
            thickness / 2,
            0, ti(p.bottomDropAppears).hasFinished() ?
                loopLinecapAngle : linecapInnerAngle,
            Angle.HALF_PI.negated()
                .add(linecapInnerAngle.complement())
                .add(lineCapRotation)
        );
        pb.l(Vector2D.of(0, 2 * linecapAngleVector.x));
        pb.bezierCircularArc(thickness / 2,
            -loopLinecapAngle, 0,
            Angle.HALF_PI.add(lineCapRotation)
        );
    }
    pb.l(Vector2D.of(-loopBottomWidth, 0));
    pb.bezierCircularArc(thickness + innerSpacing / 2,
        -loopBottomCurveAngle, 0, -Math.PI
    );
    pb.bezierCircularArc(thickness + innerSpacing / 2,
        -loopTopCurveAngle, 0, Angle.HALF_PI.negated()
    );

    pb.l(Vector2D.of(loopTopWidth - 50, 0));

    if (ti(p.loopElbowAppears).hasStarted())
        pb.c(
            outerElbowEnd.add(Vector2D.from(loopElbowOuter.startingPoint, loopElbowOuter.secondControlPoint)),
            outerElbowEnd.add(Vector2D.from(loopElbowOuter.startingPoint, loopElbowOuter.firstControlPoint)),
            outerElbowEnd
        );
    else
        pb.c(Vector2D.NULL_VECTOR, Vector2D.NULL_VECTOR, Vector2D.NULL_VECTOR);
}

const sampler = createFrameSampler(path);
const outputDirectoryPath = "../public";
const dynamicImport = new Function("p", "return import(p)");
FrameExporter.exportToJson(
    sampler.sampleAt(1),
    outputDirectoryPath, "logo-path"
).then(async p => await dynamicImport(p, { with: { type: 'json' }}))
    .then(r => console.log(r.default));
FrameExporter.exportToJson(
    sampler.collect({duration: 5, easing: easeInOut}),
    outputDirectoryPath, "logo-animation"
).then(async p => await dynamicImport(p, { with: { type: 'json' }}))
    .then(r => console.log(r.default));