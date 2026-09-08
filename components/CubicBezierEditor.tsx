import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
    KeyboardEvent,
    PointerEvent as ReactPointerEvent,
} from 'react';
import { css } from '@emotion/react';
import {Point2D} from "svg-path-kit";
import {clamp} from "times-fps";

/**
 * ---------------------------------------------------------------------------
 * Types
 * ---------------------------------------------------------------------------
 */

/** [x1, y1, x2, y2] — the two control points of a cubic bezier timing function.
 *  Endpoints are implicitly fixed at (0,0) and (1,1), matching the CSS
 *  `cubic-bezier()` timing function convention. */
export type CubicBezierValue = readonly [number, number, number, number];

export interface EasingPreset {
    id: string;
    label: string;
    group?: string;
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
    { id: 'linear', label: 'linear', value: [0, 0, 1, 1] },

    { id: 'ease', label: 'ease', group: 'Standard', value: [0.25, 0.1, 0.25, 1] },
    { id: 'ease-in', label: 'ease-in', group: 'Standard', value: [0.42, 0, 1, 1] },
    { id: 'ease-out', label: 'ease-out', group: 'Standard', value: [0, 0, 0.58, 1] },
    { id: 'ease-in-out', label: 'ease-in-out', group: 'Standard', value: [0.42, 0, 0.58, 1] },

    { id: 'sine-in', label: 'sine-in', group: 'Sine', value: [0.12, 0, 0.39, 0] },
    { id: 'sine-out', label: 'sine-out', group: 'Sine', value: [0.61, 1, 0.88, 1] },
    { id: 'sine-in-out', label: 'sine-in-out', group: 'Sine', value: [0.37, 0, 0.63, 1] },

    { id: 'quad-in', label: 'quad-in', group: 'Quad', value: [0.11, 0, 0.5, 0] },
    { id: 'quad-out', label: 'quad-out', group: 'Quad', value: [0.5, 1, 0.89, 1] },
    { id: 'quad-in-out', label: 'quad-in-out', group: 'Quad', value: [0.45, 0, 0.55, 1] },

    { id: 'cubic-in', label: 'cubic-in', group: 'Cubic', value: [0.32, 0, 0.67, 0] },
    { id: 'cubic-out', label: 'cubic-out', group: 'Cubic', value: [0.33, 1, 0.68, 1] },
    { id: 'cubic-in-out', label: 'cubic-in-out', group: 'Cubic', value: [0.65, 0, 0.35, 1] },

    { id: 'quart-in', label: 'quart-in', group: 'Quart', value: [0.5, 0, 0.75, 0] },
    { id: 'quart-out', label: 'quart-out', group: 'Quart', value: [0.25, 1, 0.5, 1] },
    { id: 'quart-in-out', label: 'quart-in-out', group: 'Quart', value: [0.76, 0, 0.24, 1] },

    { id: 'quint-in', label: 'quint-in', group: 'Quint', value: [0.64, 0, 0.78, 0] },
    { id: 'quint-out', label: 'quint-out', group: 'Quint', value: [0.22, 1, 0.36, 1] },
    { id: 'quint-in-out', label: 'quint-in-out', group: 'Quint', value: [0.83, 0, 0.17, 1] },

    { id: 'expo-in', label: 'expo-in', group: 'Expo', value: [0.7, 0, 0.84, 0] },
    { id: 'expo-out', label: 'expo-out', group: 'Expo', value: [0.16, 1, 0.3, 1] },
    { id: 'expo-in-out', label: 'expo-in-out', group: 'Expo', value: [0.87, 0, 0.13, 1] },

    { id: 'circ-in', label: 'circ-in', group: 'Circ', value: [0.55, 0, 1, 0.45] },
    { id: 'circ-out', label: 'circ-out', group: 'Circ', value: [0, 0.55, 0.45, 1] },
    { id: 'circ-in-out', label: 'circ-in-out', group: 'Circ', value: [0.85, 0, 0.15, 1] },

    { id: 'back-in', label: 'back-in', group: 'Back', value: [0.36, 0, 0.66, -0.56] },
    { id: 'back-out', label: 'back-out', group: 'Back', value: [0.34, 1.56, 0.64, 1] },
    { id: 'back-in-out', label: 'back-in-out', group: 'Back', value: [0.68, -0.6, 0.32, 1.6] },
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

const round2 = (n: number) => Math.round(n * 100) / 100;

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
    --panel: #1b1e2a;
    --grid: #2a2e3d;
    --curve: #5eead4;
    --handle: #f2b45b;
    --ref-line: #3a3f52;
    --focus: #7dd3fc;

    display: flex;
    flex-direction: column;
    gap: 16px;
    border-radius: 12px;
    color: var(--ink);
`;

const bodyCss = css`
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 16px;
    align-items: flex-start;
    & > * {
        min-width: 0;
    }
`;

const canvasWrapCss = css`
    position: relative;
    border-radius: 8px;
    --padding-x: 8px;
    --padding-y: 24px;
    --grid-line-x: 10%;
    --grid-line-y: 10%;
    background:
        linear-gradient(
            to right,
            transparent 0% calc(var(--padding-x) - 0.5px),
            var(--secondary-neutral-700) calc(var(--padding-x) - 0.5px) calc(var(--padding-x) + 0.5px),
            transparent calc(var(--padding-x) + 0.5px) calc(100% - var(--padding-x) - 0.5px),
            var(--secondary-neutral-700) calc(100% - var(--padding-x) - 0.5px) calc(100% - var(--padding-x) + 0.5px),
            transparent calc(100% - var(--padding-x) + 0.5px) 100%
        ),
        linear-gradient(
            to bottom,
            transparent 0% calc(var(--padding-y) - 0.5px),
            var(--secondary-neutral-700) calc(var(--padding-y) - 0.5px) calc(var(--padding-y) + 0.5px),
            transparent calc(var(--padding-y) + 0.5px) calc(100% - var(--padding-y) - 0.5px),
            var(--secondary-neutral-700) calc(100% - var(--padding-y) - 0.5px) calc(100% - var(--padding-y) + 0.5px),
            transparent calc(100% - var(--padding-y) + 0.5px) 100%
        ),
        repeating-linear-gradient(
            to right,
            transparent 0% calc(var(--grid-line-x) - 0.5px),
            var(--secondary-neutral-700) calc(var(--grid-line-x) - 0.5px) calc(var(--grid-line-x) + 0.5px),
            transparent calc(var(--grid-line-x) + 0.5px)
        ) content-box,
        repeating-linear-gradient(
            transparent 0% calc(var(--grid-line-y) - 0.5px),
            var(--secondary-neutral-700) calc(var(--grid-line-y) - 0.5px) calc(var(--grid-line-y) + 0.5px),
            transparent calc(var(--grid-line-y) + 0.5px)
        ) content-box,
        var(--panel);
    padding-inline: var(--padding-x);
    padding-block: var(--padding-y);
    width: 100%;
    touch-action: none;
`;

const inspectorCss = css`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const fieldRowCss = css`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const fieldCss = css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 11px;
    color: var(--ink-dim);
    flex: 1;
    min-width: 0;
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
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: var(--focus);
    }

    &::-webkit-inner-spin-button {
        opacity: 0.4;
    }
`;

const copyButtonCss = css`
    font: inherit;
    font-size: 11px;
    color: var(--ink);
    background: transparent;
    background: var(--panel);
    border: 1px solid var(--grid);
    border-radius: 8px;
    padding: 4px 8px;
    cursor: pointer;
    flex-shrink: 0;

    &:hover {
        color: var(--ink);
        border-color: var(--ink-dim);
    }
`;

const presetSelectCss = css`
    font: inherit;
    font-size: 12px;
    color: var(--ink);
    background: var(--panel);
    border: 1px solid var(--grid);
    border-radius: 6px;
    padding: 7px 10px;
    cursor: pointer;
    width: 100%;

    &:focus {
        outline: 2px solid var(--focus);
        outline-offset: 1px;
        border-color: var(--focus);
    }
`;

const presetPanelCss = css`
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 16px;
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
            const { x, y } = { x: clamp((clientX - rect.x) / rect.width, 0, 1), y: 1 - clamp((clientY - rect.y) / rect.height, -1, 2) };
            const next: CubicBezierValue =
                handle === 1
                    ? [round2(x), round2(y), bezier[2], bezier[3]]
                    : [bezier[0], bezier[1], round2(x), round2(y)];
            commit(next);
        },
        [bezier, commit]
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
        const n = [...bezier] as [number, number, number, number];
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

    const p0 = Point2D.of(0, 1 - 0);
    const p1 = Point2D.of(x1, 1 - y1);
    const p2 = Point2D.of(x2, 1 - y2);
    const p3 = Point2D.of(1, 1 - 1);
    const zero = Point2D.of(0, 1 - 0);
    const one = Point2D.of(1, 1 - 1);

    const pathD = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;

    const grouped = useMemo(
        () => PRESET_GROUPS.map((g) => ({ group: g, items: EASING_PRESETS.filter((p) => p.group === g) })),
        []
    );

    const selectedPresetId = useMemo(
        () => EASING_PRESETS.find((preset) => isSameCurve(bezier, preset.value))?.id ?? '',
        [bezier]
    );

    const presetPanel = (
        <div css={presetPanelCss}>
            <select
                css={presetSelectCss}
                value={selectedPresetId}
                onChange={(e) => {
                    const preset = EASING_PRESETS.find((p) => p.id === e.target.value);
                    if (preset) commit(preset.value);
                }}
                aria-label="Easing preset"
            >
                {!selectedPresetId && (
                    <option value="" disabled>
                        Custom easing
                    </option>
                )}

                {grouped.map(({ group, items }) => {
                    const options = items.map((preset) => (
                        <option key={preset.id} value={preset.id}>
                            {preset.label}
                        </option>
                    ));
                    return group ? <optgroup label={group} key={group}>{options}</optgroup> : options;
                })}
            </select>

            <button css={copyButtonCss} type="button" onClick={copyCss}>
                {copied ? 'Copied' : 'Copy'}
            </button>
        </div>
    );

    return (
        <div css={rootCss} className={className}>
            {presetsPosition === 'top' && presetPanel}

            <div css={bodyCss}>
                <div css={canvasWrapCss}>
                    <svg
                        ref={svgRef}
                        width="100%"
                        viewBox={`0 0 1 1`}
                        role="img"
                        aria-label={`Cubic bezier curve editor, current value ${cssString}`}
                        style={{ overflow: "visible" }}
                    >

                        {/* linear reference */}
                        <line x1={zero.x} y1={zero.y} x2={one.x} y2={one.y} stroke="var(--ref-line)" strokeWidth={0.001 * 1} strokeDasharray="3 4" />

                        {/* handle stems */}
                        <line x1={zero.x} y1={zero.y} x2={p1.x} y2={p1.y} stroke="var(--handle)" strokeWidth={0.001 * 1.5} opacity={0.6} />
                        <line x1={one.x} y1={one.y} x2={p2.x} y2={p2.y} stroke="var(--handle)" strokeWidth={0.001 * 1.5} opacity={0.6} />

                        {/* the actual curve, drawn with a real SVG cubic bezier command */}
                        <path d={pathD} fill="none" stroke="var(--curve)" strokeWidth={0.001 * 2.5} strokeLinecap="round" />

                        {/* fixed endpoints */}
                        <circle cx={zero.x} cy={zero.y} r={0.02} fill="var(--ink-dim)" />
                        <circle cx={one.x} cy={one.y} r={0.02} fill="var(--ink-dim)" />

                        {/* draggable control points */}
                        <circle
                            cx={p1.x}
                            cy={p1.y}
                            r={0.02}
                            fill="var(--handle)"
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
                            r={0.02}
                            fill="var(--handle)"
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
                                <input css={numberInputCss} type="number" step={0.01} min={-1} max={2} value={y1} onChange={setField(1)} />
                            </label>
                            <label css={fieldCss}>
                                x2
                                <input css={numberInputCss} type="number" step={0.01} min={0} max={1} value={x2} onChange={setField(2)} />
                            </label>
                            <label css={fieldCss}>
                                y2
                                <input css={numberInputCss} type="number" step={0.01} min={-1} max={2} value={y2} onChange={setField(3)} />
                            </label>
                        </div>
                    </div>
                )}
            </div>

            {presetsPosition === 'bottom' && presetPanel}
        </div>
    );
}