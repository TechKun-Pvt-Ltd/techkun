import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
    KeyboardEvent,
    PointerEvent as ReactPointerEvent,
} from 'react';
import { css } from '@emotion/react';

/**
 * ---------------------------------------------------------------------------
 * Types
 * ---------------------------------------------------------------------------
 */

/** [x1, y1, x2, y2] — the two control points of a cubic bezier timing function.
 *  Endpoints are implicitly fixed at (0,0) and (1,1), matching the CSS
 *  `cubic-bezier()` timing function convention. */
export type CubicBezierValue = [number, number, number, number];

export interface EasingPreset {
    id: string;
    label: string;
    group: string;
    value: CubicBezierValue;
}

export interface BezierEditorProps {
    /** Controlled value. Omit to let the component manage its own state. */
    value?: CubicBezierValue;
    /** Initial value when uncontrolled. Defaults to ease-in-out. */
    defaultValue?: CubicBezierValue;
    /** Called with the new value whenever a handle is dragged or a preset picked. */
    onChange?: (value: CubicBezierValue) => void;
    /** Where the preset strip renders relative to the curve canvas. */
    presetsPosition?: 'top' | 'bottom' | 'none';
    /** Pixel size (both dimensions) of the square curve canvas. */
    size?: number;
    /** Show the numeric x1/y1/x2/y2 inputs and the cubic-bezier() readout. */
    showInspector?: boolean;
    className?: string;
}

/**
 * ---------------------------------------------------------------------------
 * Presets
 * ---------------------------------------------------------------------------
 * Every standard CSS keyword plus every Penner easing that reduces to a
 * *single monotonic cubic bezier*. Elastic and bounce are deliberately
 * excluded: both overshoot and reverse direction multiple times, which a
 * single cubic segment cannot reproduce — they need a piecewise curve or a
 * spring function, not `cubic-bezier()`. The "back" family DOES fit,
 * because a bezier's control points are allowed to sit outside the
 * [0,1] range on the y-axis, which is exactly what "back" needs.
 *
 * Values below follow the widely-used easings.net approximations, which is
 * also what most CSS/animation libraries ship as e.g. `--ease-out-quint`.
 */
export const EASING_PRESETS: EasingPreset[] = [
    { id: 'ease', label: 'ease', group: 'Standard', value: [0.25, 0.1, 0.25, 1] },
    { id: 'ease-in', label: 'ease-in', group: 'Standard', value: [0.42, 0, 1, 1] },
    { id: 'ease-out', label: 'ease-out', group: 'Standard', value: [0, 0, 0.58, 1] },
    { id: 'ease-in-out', label: 'ease-in-out', group: 'Standard', value: [0.42, 0, 0.58, 1] },

    { id: 'in-sine', label: 'In', group: 'Sine', value: [0.12, 0, 0.39, 0] },
    { id: 'out-sine', label: 'Out', group: 'Sine', value: [0.61, 1, 0.88, 1] },
    { id: 'in-out-sine', label: 'In Out', group: 'Sine', value: [0.37, 0, 0.63, 1] },

    { id: 'in-quad', label: 'In', group: 'Quad', value: [0.11, 0, 0.5, 0] },
    { id: 'out-quad', label: 'Out', group: 'Quad', value: [0.5, 1, 0.89, 1] },
    { id: 'in-out-quad', label: 'In Out', group: 'Quad', value: [0.45, 0, 0.55, 1] },

    { id: 'in-cubic', label: 'In', group: 'Cubic', value: [0.32, 0, 0.67, 0] },
    { id: 'out-cubic', label: 'Out', group: 'Cubic', value: [0.33, 1, 0.68, 1] },
    { id: 'in-out-cubic', label: 'In Out', group: 'Cubic', value: [0.65, 0, 0.35, 1] },

    { id: 'in-quart', label: 'In', group: 'Quart', value: [0.5, 0, 0.75, 0] },
    { id: 'out-quart', label: 'Out', group: 'Quart', value: [0.25, 1, 0.5, 1] },
    { id: 'in-out-quart', label: 'In Out', group: 'Quart', value: [0.76, 0, 0.24, 1] },

    { id: 'in-quint', label: 'In', group: 'Quint', value: [0.64, 0, 0.78, 0] },
    { id: 'out-quint', label: 'Out', group: 'Quint', value: [0.22, 1, 0.36, 1] },
    { id: 'in-out-quint', label: 'In Out', group: 'Quint', value: [0.83, 0, 0.17, 1] },

    { id: 'in-expo', label: 'In', group: 'Expo', value: [0.7, 0, 0.84, 0] },
    { id: 'out-expo', label: 'Out', group: 'Expo', value: [0.16, 1, 0.3, 1] },
    { id: 'in-out-expo', label: 'In Out', group: 'Expo', value: [0.87, 0, 0.13, 1] },

    { id: 'in-circ', label: 'In', group: 'Circ', value: [0.55, 0, 1, 0.45] },
    { id: 'out-circ', label: 'Out', group: 'Circ', value: [0, 0.55, 0.45, 1] },
    { id: 'in-out-circ', label: 'In Out', group: 'Circ', value: [0.85, 0, 0.15, 1] },

    { id: 'in-back', label: 'In', group: 'Back', value: [0.36, 0, 0.66, -0.56] },
    { id: 'out-back', label: 'Out', group: 'Back', value: [0.34, 1.56, 0.64, 1] },
    { id: 'in-out-back', label: 'In Out', group: 'Back', value: [0.68, -0.6, 0.32, 1.6] },
];

const PRESET_GROUPS = Array.from(new Set(EASING_PRESETS.map((p) => p.group)));

/**
 * ---------------------------------------------------------------------------
 * Geometry helpers
 * ---------------------------------------------------------------------------
 * x is always in [0, 1] (the CSS spec requires this — x is "time" and must
 * be monotonic). y is allowed outside [0, 1] to support overshoot ("back").
 * We give the canvas vertical headroom so those handles are reachable.
 */

const Y_MIN = -0.6;
const Y_MAX = 1.6;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const round2 = (n: number) => Math.round(n * 100) / 100;

const toPx = (x: number, y: number, size: number) => ({
    x: x * size,
    y: ((Y_MAX - y) / (Y_MAX - Y_MIN)) * size,
});

const fromPx = (px: number, py: number, size: number) => ({
    x: clamp(px / size, 0, 1),
    y: clamp(Y_MAX - (py / size) * (Y_MAX - Y_MIN), Y_MIN, Y_MAX),
});

const isSameCurve = (a: CubicBezierValue, b: CubicBezierValue) =>
    a.every((v, i) => Math.abs(v - b[i]) < 0.005);

/**
 * ---------------------------------------------------------------------------
 * Styled shell
 * ---------------------------------------------------------------------------
 */

const rootCss = css`
    --ink: #e9e7e0;
    --ink-dim: #8b8e9c;
    --bg: #14161f;
    --panel: #1b1e2a;
    --grid: #2a2e3d;
    --curve: #5eead4;
    --handle: #f2b45b;
    --ref-line: #3a3f52;
    --focus: #7dd3fc;

    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
    background: var(--bg);
    border-radius: 12px;
    color: var(--ink);
    font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
    width: max-content;
`;

const bodyCss = css`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: flex-start;
`;

const canvasWrapCss = css`
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    background: var(--panel);
    touch-action: none;
`;

const inspectorCss = css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 200px;
`;

const fieldRowCss = css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
`;

const fieldCss = css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 11px;
    color: var(--ink-dim);
`;

const numberInputCss = css`
    font: inherit;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 13px;
    color: var(--ink);
    background: var(--panel);
    border: 1px solid var(--grid);
    border-radius: 6px;
    padding: 6px 8px;
    width: 100%;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: var(--focus);
    }

    &::-webkit-inner-spin-button {
        opacity: 0.4;
    }
`;

const codeRowCss = css`
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--panel);
    border: 1px solid var(--grid);
    border-radius: 6px;
    padding: 8px 10px;
`;

const codeCss = css`
    flex: 1;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    color: var(--curve);
    overflow-x: auto;
    white-space: nowrap;
`;

const copyButtonCss = css`
    font: inherit;
    font-size: 11px;
    color: var(--ink-dim);
    background: transparent;
    border: 1px solid var(--grid);
    border-radius: 5px;
    padding: 4px 8px;
    cursor: pointer;
    flex-shrink: 0;

    &:hover {
        color: var(--ink);
        border-color: var(--ink-dim);
    }
`;

const noteCss = css`
    margin: 0;
    font-size: 11px;
    line-height: 1.5;
    color: var(--ink-dim);
    max-width: 460px;
`;

const presetPanelCss = css`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const presetGroupRowCss = css`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const presetGroupLabelCss = css`
    font-size: 11px;
    color: var(--ink-dim);
    width: 44px;
    flex-shrink: 0;
`;

const presetButtonsCss = css`
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
`;

const PresetButton = (active: boolean) => css`
    font: inherit;
    font-size: 12px;
    color: ${active ? '#0f1115' : 'var(--ink)'};
    background: ${active ? 'var(--curve)' : 'var(--panel)'};
    border: 1px solid ${active ? 'var(--curve)' : 'var(--grid)'};
    border-radius: 999px;
    padding: 5px 12px;
    cursor: pointer;
    transition: border-color 120ms ease, color 120ms ease, background 120ms ease;
    
    &:hover {
    border-color: ${active ? 'var(--curve)' : 'var(--ink-dim)'};
    }
    
    &:focus-visible {
    outline: 2px solid var(--focus);
    outline-offset: 2px;
    }
`;

/**
 * ---------------------------------------------------------------------------
 * Component
 * ---------------------------------------------------------------------------
 */

export default function CubicBezierEditor({
                                              value,
                                              defaultValue = [0.42, 0, 0.58, 1],
                                              onChange,
                                              presetsPosition = 'bottom',
                                              size = 280,
                                              showInspector = true,
                                              className,
                                          }: BezierEditorProps) {
    const [internalValue, setInternalValue] = useState<CubicBezierValue>(defaultValue);
    const bezier = value ?? internalValue;
    const [x1, y1, x2, y2] = bezier;

    const svgRef = useRef<SVGSVGElement>(null);
    const draggingRef = useRef<1 | 2 | null>(null);
    const [copied, setCopied] = useState(false);

    const commit = useCallback(
        (next: CubicBezierValue) => {
            if (value === undefined) setInternalValue(next);
            onChange?.(next);
        },
        [value, onChange]
    );

    const setFromPointer = useCallback(
        (handle: 1 | 2, clientX: number, clientY: number) => {
            if (!svgRef.current) return;
            const rect = svgRef.current.getBoundingClientRect();
            const scale = size / rect.width;
            const { x, y } = fromPx((clientX - rect.left) * scale, (clientY - rect.top) * scale, size);
            const next: CubicBezierValue =
                handle === 1
                    ? [round2(x), round2(y), bezier[2], bezier[3]]
                    : [bezier[0], bezier[1], round2(x), round2(y)];
            commit(next);
        },
        [bezier, commit, size]
    );

    const onHandlePointerDown = (handle: 1 | 2) => (e: ReactPointerEvent<SVGCircleElement>) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        draggingRef.current = handle;
        setFromPointer(handle, e.clientX, e.clientY);
    };

    const onHandlePointerMove = (handle: 1 | 2) => (e: ReactPointerEvent<SVGCircleElement>) => {
        if (draggingRef.current !== handle) return;
        setFromPointer(handle, e.clientX, e.clientY);
    };

    const onHandlePointerUp = (e: ReactPointerEvent<SVGCircleElement>) => {
        draggingRef.current = null;
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    const onHandleKeyDown = (handle: 1 | 2) => (e: KeyboardEvent<SVGCircleElement>) => {
        const step = e.shiftKey ? 0.1 : 0.01;
        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowLeft') dx = -step;
        else if (e.key === 'ArrowRight') dx = step;
        else if (e.key === 'ArrowUp') dy = step;
        else if (e.key === 'ArrowDown') dy = -step;
        else return;
        e.preventDefault();
        const cx = handle === 1 ? x1 : x2;
        const cy = handle === 1 ? y1 : y2;
        const x = clamp(round2(cx + dx), 0, 1);
        const y = clamp(round2(cy + dy), Y_MIN, Y_MAX);
        commit(handle === 1 ? [x, y, x2, y2] : [x1, y1, x, y]);
    };

    const setField = (index: 0 | 1 | 2 | 3) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = parseFloat(e.target.value);
        if (Number.isNaN(raw)) return;
        const n = [...bezier] as CubicBezierValue;
        n[index] = index % 2 === 0 ? clamp(raw, 0, 1) : clamp(raw, Y_MIN, Y_MAX);
        commit(n);
    };

    const cssString = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;

    const copyCss = async () => {
        try {
            await navigator.clipboard.writeText(cssString);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        } catch {
            // clipboard API unavailable — silently ignore
        }
    };

    const p0 = toPx(0, 0, size);
    const p1 = toPx(x1, y1, size);
    const p2 = toPx(x2, y2, size);
    const p3 = toPx(1, 1, size);
    const zero = toPx(0, 0, size);
    const one = toPx(1, 1, size);

    const pathD = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;

    const grouped = useMemo(
        () => PRESET_GROUPS.map((g) => ({ group: g, items: EASING_PRESETS.filter((p) => p.group === g) })),
        []
    );

    const presetPanel = (
        <div css={presetPanelCss}>
            <div css={presetButtonsCss}>
                {grouped[0].items.map((preset) => (
                    <button css={PresetButton(isSameCurve(bezier, preset.value))}
                            key={preset.id}
                            type="button"
                            onClick={() => commit(preset.value)}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>
            {grouped.slice(1).map(({ group, items }) => (
                <div css={presetGroupRowCss} key={group}>
                    <span css={presetGroupLabelCss}>{group}</span>
                    <div css={presetButtonsCss}>
                        {items.map((preset) => (
                            <button css={PresetButton(isSameCurve(bezier, preset.value))}
                                    key={preset.id}
                                    type="button"
                                    onClick={() => commit(preset.value)}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            <p css={noteCss}>
                Elastic and bounce aren&rsquo;t here — they overshoot and reverse direction more than once,
                so no single cubic bezier can draw them. Everything above, including the &ldquo;back&rdquo;
                family, only needs one curve because a bezier&rsquo;s control points can sit outside 0–1 on
                the y-axis.
            </p>
        </div>
    );

    return (
        <div css={rootCss} className={className}>
            {presetsPosition === 'top' && presetPanel}

            <div css={bodyCss}>
                <div css={canvasWrapCss}>
                    <svg
                        ref={svgRef}
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                        role="img"
                        aria-label={`Cubic bezier curve editor, current value ${cssString}`}
                    >
                        {/* grid */}
                        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                            const px = toPx(t, 0, size).x;
                            return <line key={`v${t}`} x1={px} y1={0} x2={px} y2={size} stroke="var(--grid)" strokeWidth={1} />;
                        })}
                        {[0, 1].map((t) => {
                            const py = toPx(0, t, size).y;
                            return <line key={`h${t}`} x1={0} y1={py} x2={size} y2={py} stroke="var(--grid)" strokeWidth={1} />;
                        })}

                        {/* linear reference */}
                        <line x1={zero.x} y1={zero.y} x2={one.x} y2={one.y} stroke="var(--ref-line)" strokeWidth={1} strokeDasharray="3 4" />

                        {/* handle stems */}
                        <line x1={zero.x} y1={zero.y} x2={p1.x} y2={p1.y} stroke="var(--handle)" strokeWidth={1.5} opacity={0.6} />
                        <line x1={one.x} y1={one.y} x2={p2.x} y2={p2.y} stroke="var(--handle)" strokeWidth={1.5} opacity={0.6} />

                        {/* the actual curve, drawn with a real SVG cubic bezier command */}
                        <path d={pathD} fill="none" stroke="var(--curve)" strokeWidth={2.5} strokeLinecap="round" />

                        {/* fixed endpoints */}
                        <circle cx={zero.x} cy={zero.y} r={3.5} fill="var(--ink-dim)" />
                        <circle cx={one.x} cy={one.y} r={3.5} fill="var(--ink-dim)" />

                        {/* draggable control points */}
                        <circle
                            cx={p1.x}
                            cy={p1.y}
                            r={7}
                            fill="var(--handle)"
                            stroke="var(--bg)"
                            strokeWidth={2}
                            tabIndex={0}
                            role="slider"
                            aria-label="First control point"
                            aria-valuetext={`x1 ${x1}, y1 ${y1}`}
                            style={{ cursor: 'grab' }}
                            onPointerDown={onHandlePointerDown(1)}
                            onPointerMove={onHandlePointerMove(1)}
                            onPointerUp={onHandlePointerUp}
                            onKeyDown={onHandleKeyDown(1)}
                        />
                        <circle
                            cx={p2.x}
                            cy={p2.y}
                            r={7}
                            fill="var(--handle)"
                            stroke="var(--bg)"
                            strokeWidth={2}
                            tabIndex={0}
                            role="slider"
                            aria-label="Second control point"
                            aria-valuetext={`x2 ${x2}, y2 ${y2}`}
                            style={{ cursor: 'grab' }}
                            onPointerDown={onHandlePointerDown(2)}
                            onPointerMove={onHandlePointerMove(2)}
                            onPointerUp={onHandlePointerUp}
                            onKeyDown={onHandleKeyDown(2)}
                        />
                    </svg>
                </div>

                {showInspector && (
                    <div css={inspectorCss}>
                        <div css={fieldRowCss}>
                            <label css={fieldCss}>
                                x1
                                <input css={numberInputCss} type="number" step={0.01} min={0} max={1} value={x1} onChange={setField(0)} />
                            </label>
                            <label css={fieldCss}>
                                y1
                                <input css={numberInputCss} type="number" step={0.01} value={y1} onChange={setField(1)} />
                            </label>
                            <label css={fieldCss}>
                                x2
                                <input css={numberInputCss} type="number" step={0.01} min={0} max={1} value={x2} onChange={setField(2)} />
                            </label>
                            <label css={fieldCss}>
                                y2
                                <input css={numberInputCss} type="number" step={0.01} value={y2} onChange={setField(3)} />
                            </label>
                        </div>

                        <div css={codeRowCss}>
                            <code css={codeCss}>{cssString}</code>
                            <button css={copyButtonCss} type="button" onClick={copyCss}>
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>

                        <p css={noteCss}>
                            Drag the amber handles, type exact values, or pick a preset. Arrow keys nudge the
                            focused handle by 0.01 (0.1 with shift).
                        </p>
                    </div>
                )}
            </div>

            {presetsPosition === 'bottom' && presetPanel}
        </div>
    );
}