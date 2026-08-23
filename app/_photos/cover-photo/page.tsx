"use client";
import {css} from "@emotion/react";
import {PathBuilder, Point2D, Vector2D} from "svg-path-kit";
import React from "react";

export default function ProfilePic() {
    const width = 1500;
    const height = 500;
    const radius = 35;
    const gap = 30;

    const pb = PathBuilder.m(Point2D.of(width / 2, height / 2 - radius));
    pb.circularArc(radius, -Math.PI / 2, -Math.PI / 4);
    let currentVelocity = pb.currentVelocity.scale(1.5);
    pb.hermiteCurve(currentVelocity, Vector2D.polar(currentVelocity.length, currentVelocity.angle.negated()), Vector2D.of(gap, 0));
    pb.circularArc(radius, -3 * Math.PI / 4, 3 * Math.PI / 4);
    currentVelocity = pb.currentVelocity.scale(1.5);
    pb.hermiteCurve(currentVelocity, Vector2D.polar(currentVelocity.length, currentVelocity.angle.supplement()).opposite(), Vector2D.of(-gap, 0));
    pb.circularArc(radius, Math.PI / 4, 3 * Math.PI / 4);
    currentVelocity = pb.currentVelocity.scale(1.5);
    pb.hermiteCurve(currentVelocity, Vector2D.polar(currentVelocity.length, currentVelocity.angle.supplement()).opposite(), Vector2D.of(-gap, 0));
    pb.circularArc(radius, Math.PI / 4, 2 * Math.PI - Math.PI / 4);
    currentVelocity = pb.currentVelocity.scale(1.5);
    pb.hermiteCurve(currentVelocity, Vector2D.polar(currentVelocity.length, currentVelocity.angle.negated()), Vector2D.of(gap, 0));
    pb.circularArc(radius, -3 * Math.PI / 4, -Math.PI / 2);

    const oneMinusCosine = radius * (1 - Math.cos(Math.PI / 4));
    const diameter = 2 * radius;
    const stop1 = diameter - oneMinusCosine;
    const stop3 = stop1 + gap + diameter - 2 * oneMinusCosine;
    const totalLength = stop3 + gap + diameter - oneMinusCosine;

    const jointRegionStretch = 10;
    return <main>
        <section css={css`
            padding-block-start: 8rem;
            justify-items: center;
        `}>
            <div>
                <svg viewBox={`0 0 ${width} ${height}`} width={width}>
                    <path d={pb.toSVGPathString()} fill="url(#cover-photo-gradient)" />
                    <linearGradient id="cover-photo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset={(stop1 - jointRegionStretch) / totalLength * 100 + "%"} stopColor="var(--primary-500)" />
                        <stop offset={(stop1 + gap + jointRegionStretch) / totalLength * 100 + "%"} stopColor="var(--secondary-500)" />
                        <stop offset={(stop3 - jointRegionStretch) / totalLength * 100 + "%"} stopColor="var(--secondary-500)" />
                        <stop offset={(stop3 + gap + jointRegionStretch) / totalLength * 100 + "%"} stopColor="var(--tertiary-500)" />
                    </linearGradient>
                </svg>
            </div>
        </section>
    </main>;
}