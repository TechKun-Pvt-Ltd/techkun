// Satori (used by ImageResponse) doesn't support oklch(), so the brand color has to be
// converted to sRGB hex ahead of time. Conversion via Björn Ottosson's OKLab formulas:
// https://bottosson.github.io/posts/oklab/
export function oklchToHex(l: number, c: number, hueDegrees: number) {
    const hueRadians = (hueDegrees * Math.PI) / 180;
    const a = c * Math.cos(hueRadians);
    const b = c * Math.sin(hueRadians);

    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

    const l3 = l_ ** 3;
    const m3 = m_ ** 3;
    const s3 = s_ ** 3;

    const linear = {
        r: 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
        g: -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
        b: -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3,
    };

    const toSrgbChannel = (v: number) => {
        const clamped = Math.min(Math.max(v, 0), 1);
        const encoded = clamped <= 0.0031308
            ? 12.92 * clamped
            : 1.055 * clamped ** (1 / 2.4) - 0.055;
        return Math.round(encoded * 255).toString(16).padStart(2, "0");
    };

    return `#${toSrgbChannel(linear.r)}${toSrgbChannel(linear.g)}${toSrgbChannel(linear.b)}`;
}