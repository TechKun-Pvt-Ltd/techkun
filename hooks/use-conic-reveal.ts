import {Angle, Point2D, Vector2D} from "svg-path-kit";
import {useTransform} from "motion/react";
import {MotionValue} from "motion";
import {round} from "svg-path-kit/numbers";

export type ConicRevealProps = {
    startAngle?: number;
    centerX: number;
    centerY: number;
    radius: number;
};

const roundOff = (num: number) => round(num, 4);

// const offset = Math.PI / 120;
function conicRevealClipPath({ startAngle = 0, centerX, centerY, radius }: ConicRevealProps) {
    const center = Point2D.of(centerX, centerY);
    const startPolarVector = Vector2D.polar(radius, startAngle);

    const semicircleThreshold = Angle.of(startAngle + Math.PI);
    const semicirclePoint = center.add(Vector2D.polar(radius, semicircleThreshold));

    const endAngle = Angle.of(startAngle + 2 * Math.PI)
    const circleEnd = center.add(Vector2D.polar(radius, endAngle));

    function getBackClipPath(a: Angle) {
        // a = a.add(offset);
        const firstArc = +a < +semicircleThreshold ?
            `A ${radius} ${radius} 0 0 1 ${roundOff(semicirclePoint.x)} ${roundOff(semicirclePoint.y)}` :
            `a 0 0 0 0 1 0 0`;
        return `
			M ${center.x} ${center.y}
			l ${roundOff(radius * a.cosine)} ${roundOff(radius * a.sine)}
			${firstArc}
			A ${radius} ${radius} 0 0 1 ${roundOff(circleEnd.x)} ${roundOff(circleEnd.y)}
			Z
        `;
    }
    function getFrontClipPath(a: Angle) {
        if (+a > +endAngle)
            a = endAngle;

        // a = a.subtract(offset);
        const firstArcAngle = +a < +semicircleThreshold ? a : semicircleThreshold;
        const secondArc = firstArcAngle === semicircleThreshold ?
            `A ${radius} ${radius} 0 0 1 ${roundOff(center.x + radius * a.cosine)} ${roundOff(center.y + radius * a.sine)}` :
            `a 0 0 0 0 1 0 0`;
        return `
			M ${center.x} ${center.y}
			l ${roundOff(startPolarVector.x)} ${roundOff(startPolarVector.y)}
			A ${radius} ${radius} 0 ${+firstArcAngle > Math.PI ? 1 : 0} 1 ${roundOff(center.x + radius * firstArcAngle.cosine)} ${roundOff(center.y + radius * firstArcAngle.sine)}
			${secondArc}
			Z
        `;
    }

    return [getBackClipPath, getFrontClipPath];
}

export function useConicReveal({ angle, ...props }: ConicRevealProps & { angle: MotionValue<Angle> }) {
    const [getBackClipPath, getFrontClipPath] = conicRevealClipPath(props);

    const backClipPath = useTransform(angle, getBackClipPath);
    const frontClipPath = useTransform(angle, getFrontClipPath);

    return [frontClipPath, backClipPath];
}