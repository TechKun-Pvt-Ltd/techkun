import type { EasingFunction } from "times-fps";

// Standard Penner easing set. All functions take t in [0, 1] and return
// a progress value — same contract "times-fps" expects.

export const linear: EasingFunction = (t) => t;

export const sineIn: EasingFunction = (t) => 1 - Math.cos((t * Math.PI) / 2);
export const sineOut: EasingFunction = (t) => Math.sin((t * Math.PI) / 2);
export const sineInOut: EasingFunction = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

export const quadIn: EasingFunction = (t) => t * t;
export const quadOut: EasingFunction = (t) => 1 - (1 - t) * (1 - t);
export const quadInOut: EasingFunction = (t) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

export const cubicIn: EasingFunction = (t) => t * t * t;
export const cubicOut: EasingFunction = (t) => 1 - Math.pow(1 - t, 3);
export const cubicInOut: EasingFunction = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const quartIn: EasingFunction = (t) => Math.pow(t, 4);
export const quartOut: EasingFunction = (t) => 1 - Math.pow(1 - t, 4);
export const quartInOut: EasingFunction = (t) =>
    t < 0.5 ? 8 * Math.pow(t, 4) : 1 - Math.pow(-2 * t + 2, 4) / 2;

export const quintIn: EasingFunction = (t) => Math.pow(t, 5);
export const quintOut: EasingFunction = (t) => 1 - Math.pow(1 - t, 5);
export const quintInOut: EasingFunction = (t) =>
    t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2;

export const expoIn: EasingFunction = (t) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10));
export const expoOut: EasingFunction = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const expoInOut: EasingFunction = (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return t < 0.5
        ? Math.pow(2, 20 * t - 10) / 2
        : (2 - Math.pow(2, -20 * t + 10)) / 2;
};

export const circIn: EasingFunction = (t) => 1 - Math.sqrt(1 - Math.pow(t, 2));
export const circOut: EasingFunction = (t) => Math.sqrt(1 - Math.pow(t - 1, 2));
export const circInOut: EasingFunction = (t) =>
    t < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;

const BACK_C1 = 1.70158;
const BACK_C3 = BACK_C1 + 1;
const BACK_C2 = BACK_C1 * 1.525;

export const backIn: EasingFunction = (t) =>
    BACK_C3 * t * t * t - BACK_C1 * t * t;
export const backOut: EasingFunction = (t) =>
    1 + BACK_C3 * Math.pow(t - 1, 3) + BACK_C1 * Math.pow(t - 1, 2);
export const backInOut: EasingFunction = (t) =>
    t < 0.5
        ? (Math.pow(2 * t, 2) * ((BACK_C2 + 1) * 2 * t - BACK_C2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((BACK_C2 + 1) * (t * 2 - 2) + BACK_C2) + 2) / 2;

const ELASTIC_C4 = (2 * Math.PI) / 3;
const ELASTIC_C5 = (2 * Math.PI) / 4.5;

export const elasticIn: EasingFunction = (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * ELASTIC_C4);
};
export const elasticOut: EasingFunction = (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ELASTIC_C4) + 1;
};
export const elasticInOut: EasingFunction = (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return t < 0.5
        ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * ELASTIC_C5)) / 2
        : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * ELASTIC_C5)) / 2 + 1;
};

function bounceOutRaw(t: number): number {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
}

export const bounceOut: EasingFunction = bounceOutRaw;
export const bounceIn: EasingFunction = (t) => 1 - bounceOutRaw(1 - t);
export const bounceInOut: EasingFunction = (t) =>
    t < 0.5
        ? (1 - bounceOutRaw(1 - 2 * t)) / 2
        : (1 + bounceOutRaw(2 * t - 1)) / 2;